import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Account, Session, User } from "next-auth";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: Account | null;
      user: User | null;
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.user = {
          email: user?.email,
          name: user?.name,
          image: user?.image,
        };
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;
      session.user = token.user as
        | { name?: string | null; email?: string | null; image?: string | null }
        | undefined;
      return session;
    },
    async signIn({ user }: { user: User }) {
      const userRef = doc(db, "users/" + user.email);
      const existingUser = await getDoc(userRef);

      if (!existingUser.exists()) {
        const email = user.email ?? "";
        const name = user.name ?? "";
        const image = user.image ?? "";

        const newUser = await addDoc(collection(db, "users"), {
          email,
          name,
          image,
        });

        if (!newUser) {
          throw new Error("Failed to create user");
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

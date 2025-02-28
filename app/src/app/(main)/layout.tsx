import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/config";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return null;

  return (
    <div className="flex bg-background min-h-[100dvh] bg-[radial-gradient(ellipse_60%_60%_at_10%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-end gap-4 items-center">
          <Avatar className="shadow-xl">
            <AvatarImage src={session.user.image!} />
            <AvatarFallback>{session.user.name!}</AvatarFallback>
          </Avatar>
        </div>
        {children}
      </main>
    </div>
  );
}

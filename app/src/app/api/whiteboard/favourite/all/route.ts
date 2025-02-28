import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const q = query(
      collection(db, "users"),
      where("email", "==", session.user.email!)
    );

    const users = await getDocs(q);
    if (users.empty) throw new Error("User does not exist");

    const user = users.docs[0];
    const favourites = user.data().favourites;

    console.log(favourites);

    return NextResponse.json(
      {
        success: true,
        data: favourites,
        message: "Fetched all favourites",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: error.message,
        },
        { status: 500 }
      );
    else
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "An error occurred",
        },
        { status: 500 }
      );
  }
}

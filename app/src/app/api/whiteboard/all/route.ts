import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const q = query(
      collection(db, "whiteboards"),
      where("admin", "==", session.user.email!)
    );
    const whiteboards = await getDocs(q);
    const allWhiteboards = whiteboards.docs.map((doc) => doc.data());

    return NextResponse.json(
      {
        success: true,
        data: allWhiteboards,
        message: "Fetched all whiteboards",
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

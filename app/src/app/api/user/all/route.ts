import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/config";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q");

    if (!searchQuery || searchQuery.trim() === "")
      throw new Error("Search query is required");

    const q = query(
      collection(db, "users"),
      where("email", ">=", searchQuery),
      where("email", "<", searchQuery + "\uf8ff"),
      where("email", "!=", session.user.email),
      limit(2)
    );

    const usersDoc = await getDocs(q);
    const users = usersDoc.docs.map((doc) => doc.data());

    return NextResponse.json(
      {
        success: true,
        data: users,
        message: "Fetched all users",
      },
      { status: 200 }
    );
  } catch (error) {
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
          message: null,
        },
        { status: 500 }
      );
  }
}

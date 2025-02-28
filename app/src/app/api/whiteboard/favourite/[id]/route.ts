import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Whiteboard } from "@/models/Whiteboard";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) throw new Error("No id provided");

    const whiteboardRef = doc(db, "whiteboards", id);
    const whiteboard = await getDoc(whiteboardRef);

    if (!whiteboard.exists()) throw new Error("Whiteboard does not exist");

    const q = query(
      collection(db, "users"),
      where("email", "==", session.user.email!)
    );

    const users = await getDocs(q);
    if (users.empty) throw new Error("User does not exist");
    const user = users.docs[0];

    if (
      user.data().favourites.some((fav: Whiteboard) => fav.id === whiteboard.id)
    ) {
      throw new Error("Whiteboard already in favourites");
    }

    await updateDoc(user.ref, {
      favourites: [
        ...user.data().favourites,
        {
          id: whiteboard.id,
          admin: whiteboard.data().admin,
          title: whiteboard.data().title,
          publicEditAccess: whiteboard.data().publicEditAccess,
          shareOption: whiteboard.data().shareOption,
          updatedAt: whiteboard.data().updatedAt,
          createdAt: whiteboard.data().createdAt,
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "Whiteboard added to favourites",
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
          message: "An error occurred",
        },
        { status: 500 }
      );
  }
}

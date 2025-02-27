import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) throw new Error("Whiteboard ID not provided");

    const whiteboard = doc(db, "whiteboards", id);
    console.log(whiteboard.id);

    if (!whiteboard) throw new Error("Whiteboard not found");

    await deleteDoc(whiteboard);

    return NextResponse.json(
      {
        success: true,
        message: "Whiteboard deleted",
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const { name } = await req.json();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) throw new Error("Whiteboard ID not provided");

    const whiteboard = doc(db, "whiteboards", id);

    if (!whiteboard) throw new Error("Whiteboard not found");

    await updateDoc(whiteboard, {
      title: name,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Whiteboard Renamed Successfully",
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

"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { db } from "@/lib/firebase/config";
import { Whiteboard } from "@/models/Whiteboard";
import { doc, setDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

export async function createNewWhiteboard(title: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const whiteboardId = uuidv4();
    const whiteboard: Whiteboard = {
      id: whiteboardId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      admin: session.user.email!,
      shareOption: "restricted",
      privateAccessList: [],
      publicEditAccess: "none",
    };

    const docRef = doc(db, "whiteboards", whiteboardId);

    await setDoc(docRef, whiteboard);

    return {
      success: true,
      data: whiteboardId,
      message: "Whiteboard created",
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        data: null,
        message: error.message,
      };
    else
      return {
        success: false,
        data: null,
        message: null,
      };
  }
}

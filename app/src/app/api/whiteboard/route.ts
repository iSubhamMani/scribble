import { ACLFormData } from "@/components/AccessControlForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("Not Authenticated");
    }

    const fd = await req.formData();

    const id = fd.get("id") as string;
    const aclData = JSON.parse(fd.get("aclData") as string) as ACLFormData;

    if (!id) throw new Error("Whiteboard ID not provided");
    if (!aclData) throw new Error("ACL data not provided");

    const whiteboard = doc(db, "whiteboards", id);

    if (!whiteboard) throw new Error("Whiteboard not found");

    await updateDoc(whiteboard, {
      privateAccessList: aclData.privateAccessList,
      publicEditAccess: aclData.publicEditAccess,
      shareOption: aclData.shareOption,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Whiteboard updated",
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
          message: null,
        },
        { status: 500 }
      );
  }
}

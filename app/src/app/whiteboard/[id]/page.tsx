import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import Canvas from "@/components/Canvas";
import Toolbar from "@/components/Toolbar";
import { db } from "@/lib/firebase/config";
import { Whiteboard as WhiteboardModel } from "@/models/Whiteboard";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import React from "react";

type AccessResponse = {
  viewAccess: boolean;
  editAccess: boolean;
  admin: boolean;
  success: boolean;
};

async function checkAccess(id: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    const res: AccessResponse = {
      viewAccess: false,
      editAccess: false,
      admin: false,
      success: false,
    };
    return res;
  }
  const currentUser = session.user.email as string;

  const whiteboardRef = doc(db, "whiteboards", id);
  const whiteboard = (await getDoc(whiteboardRef)).data() as WhiteboardModel;

  if (!whiteboard) {
    const res: AccessResponse = {
      viewAccess: false,
      editAccess: false,
      admin: false,
      success: false,
    };
    return res;
  }

  const admin = whiteboard.admin === currentUser;

  // admin
  if (whiteboard.admin === currentUser) {
    const res: AccessResponse = {
      viewAccess: true,
      editAccess: true,
      admin,
      success: true,
    };
    return res;
  }

  // public access
  if (whiteboard.shareOption === "anyone") {
    const res: AccessResponse = {
      viewAccess: true,
      editAccess: whiteboard.publicEditAccess === "all",
      admin,
      success: true,
    };
    return res;
  }

  // restricted
  const user = whiteboard.privateAccessList.filter(
    (u) => u.user.email === currentUser
  );

  if (whiteboard.shareOption === "restricted" && user.length !== 0) {
    const res: AccessResponse = {
      viewAccess: true,
      editAccess: user[0].editAccess,
      admin,
      success: true,
    };
    return res;
  }

  return {
    viewAccess: false,
    editAccess: false,
    admin,
    success: false,
  };
}

const Whiteboard = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const access = await checkAccess(id);

  if (!access.success)
    return (
      <div>
        <p className="text-center mt-16 text-sm">Access Denied</p>
      </div>
    );

  return (
    access.success &&
    id && (
      <div className="relative">
        {access.editAccess && <Toolbar />}
        <Canvas
          roomId={id}
          editAccess={access.editAccess}
          admin={access.admin}
        />
      </div>
    )
  );
};

export default Whiteboard;

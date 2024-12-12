import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NewWhiteboardBtn from "@/components/NewWhiteboardBtn";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return null;

  return (
    <div className="flex min-h-[100dvh]">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-end gap-4 items-center">
          <Avatar>
            <AvatarImage src={session.user.image!} />
            <AvatarFallback>{session.user.name!}</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-lg md:text-2xl font-medium">Dashboard</h1>
        <div className="my-4">
          <NewWhiteboardBtn />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

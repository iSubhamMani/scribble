import { getServerSession } from "next-auth";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NewWhiteboardBtn from "@/components/NewWhiteboardBtn";
import WhiteboardList from "@/components/WhiteboardList";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return null;

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="flex justify-end gap-4 items-center">
        <Avatar className="shadow-xl">
          <AvatarImage src={session.user.image!} />
          <AvatarFallback>{session.user.name!}</AvatarFallback>
        </Avatar>
      </div>
      <h1 className="text-xl md:text-3xl font-medium patrick-hand">
        Dashboard
      </h1>
      <div className="my-4">
        <NewWhiteboardBtn />
        <WhiteboardList />
      </div>
    </main>
  );
};

export default Dashboard;

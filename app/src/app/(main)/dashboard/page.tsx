import React from "react";
import NewWhiteboardBtn from "@/components/NewWhiteboardBtn";
import WhiteboardList from "@/components/WhiteboardList";

const Dashboard = () => {
  return (
    <>
      <h1 className="text-xl md:text-3xl font-medium patrick-hand">
        Dashboard
      </h1>
      <div className="my-4">
        <NewWhiteboardBtn />
        <WhiteboardList />
      </div>
    </>
  );
};

export default Dashboard;

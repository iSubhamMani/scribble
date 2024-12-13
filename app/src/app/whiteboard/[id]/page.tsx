import Canvas from "@/components/Canvas";
import Toolbar from "@/components/Toolbar";
import React from "react";

const Whiteboard = () => {
  return (
    <div className="relative">
      <Toolbar />
      <Canvas />
    </div>
  );
};

export default Whiteboard;

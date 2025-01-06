import Canvas from "@/components/Canvas";
import Toolbar from "@/components/Toolbar";
import React from "react";

const Whiteboard = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    id && (
      <div className="relative">
        <Toolbar />
        <Canvas roomId={id} />
      </div>
    )
  );
};

export default Whiteboard;

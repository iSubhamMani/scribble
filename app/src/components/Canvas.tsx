"use client";

import { useCanvasStore } from "@/lib/store/canvas";
import React, { useState, useRef, useEffect } from "react";
import useFreeHandDraw from "./tools/FreeHandDraw";
import { Point } from "@/types/Point";
import useRectangle from "./tools/Rectangle";
import useCircle from "./tools/Circle";
import useLine from "./tools/Line";
import { useSession } from "next-auth/react";
import { WebSocketService } from "@/lib/ws/WebSocket";
import { useUserStore } from "@/lib/store/user";
import useSocket from "@/hooks/useSocket";
import useMouseEvents from "@/hooks/useMouseEvents";
import ShareButton from "./ShareButton";
import { ACLData } from "@/models/ACLData";

const Canvas: React.FC<{
  roomId: string;
  editAccess: boolean;
  admin: boolean;
  aclData?: ACLData;
}> = ({
  roomId,
  editAccess,
  admin,
  aclData,
}: {
  roomId: string;
  editAccess: boolean;
  admin: boolean;
  aclData?: ACLData;
}) => {
  const { data: session } = useSession();
  const [wss, setWss] = useState<WebSocketService | null>(null);
  const { setUser } = useUserStore();
  const { scale } = useCanvasStore();
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  // Refs for canvas and container
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to get coordinates
  const getCanvasCoordinates = (
    clientX: number,
    clientY: number
  ): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - offset.x) / scale;
    const y = (clientY - rect.top - offset.y) / scale;

    return { x, y };
  };

  useSocket(session, wss, setWss, roomId);
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    onKeyDown,
  } = useMouseEvents(
    session,
    containerRef,
    canvasRef,
    wss,
    getCanvasCoordinates,
    roomId,
    setOffset,
    editAccess
  );

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  // tools

  const { draw: drawFreeHand } = useFreeHandDraw(
    canvasRef.current,
    getCanvasCoordinates
  );

  const { draw: drawRect } = useRectangle(
    canvasRef.current,
    getCanvasCoordinates
  );

  const { draw: drawCircle } = useCircle(
    canvasRef.current,
    getCanvasCoordinates
  );

  const { draw: drawLine } = useLine(canvasRef.current, getCanvasCoordinates);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw all
    drawFreeHand();
    drawRect();
    drawCircle();
    drawLine();
    //drawText();

    ctx.restore();
  }, [scale, offset, drawFreeHand, drawRect, drawCircle, drawLine]);

  return (
    <div
      id="canvas-container"
      ref={containerRef}
      tabIndex={0}
      className="relative w-full h-screen overflow-hidden bg-zinc-900"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={onKeyDown}
    >
      <canvas
        ref={canvasRef}
        width={2000}
        height={2000}
        className="absolute top-0 left-0"
      />
      <div className="absolute top-4 left-4 bg-zinc-800 p-2 rounded shadow text-primary-foreground text-sm">
        Zoom: {(scale * 100).toFixed(0)}%
      </div>
      {admin && <ShareButton defaultACLData={aclData} whiteboardId={roomId} />}
    </div>
  );
};

export default Canvas;

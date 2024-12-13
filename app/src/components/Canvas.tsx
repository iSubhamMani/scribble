"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import React, { useState, useRef, useEffect } from "react";
import useFreeHandDraw from "./tools/FreeHandDraw";

// Type definitions
interface Point {
  x: number;
  y: number;
}

const Canvas: React.FC = () => {
  const {
    isDrawing,
    isPanning,
    lastPosition,
    scale,
    setIsDrawing,
    setIsPanning,
    setLastPosition,
    setScale,
    tool,
  } = useCanvasStore();
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

  // tools
  const { draw, onMouseDown, onMouseMove } = useFreeHandDraw(
    canvasRef.current,
    getCanvasCoordinates
  );

  // Drawing function
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ctrl key for panning, normal click for drawing
    if (e.ctrlKey) {
      // Panning
      setIsPanning(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    } else {
      // Drawing
      switch (tool) {
        case Tool.freeHand:
          onMouseDown(e);
          break;
        default:
          break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      // Panning logic
      const dx = e.clientX - lastPosition.x;
      const dy = e.clientY - lastPosition.y;

      setOffset((current) => ({
        x: current.x + dx,
        y: current.y + dy,
      }));

      setLastPosition({ x: e.clientX, y: e.clientY });
    } else if (isDrawing) {
      // Drawing logic
      switch (tool) {
        case Tool.freeHand:
          onMouseMove(e);
          break;
        default:
          break;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
  };

  // Zoom handling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    const newScale = Math.min(Math.max(0.1, scale + delta), 5);

    // Calculate zoom point
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Adjust offset to zoom towards mouse point
    setOffset((current) => ({
      x: x - (x - current.x) * (newScale / scale),
      y: y - (y - current.y) * (newScale / scale),
    }));

    setScale(newScale);
  };

  // Rendering lines
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

    // Draw all lines
    draw();

    ctx.restore();
  }, [scale, offset, draw]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gray-100"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={2000}
        height={2000}
        className="absolute top-0 left-0"
      />
      <div className="absolute top-2 left-2 bg-white p-2 rounded shadow">
        Zoom: {(scale * 100).toFixed(0)}%
      </div>
      <div className="absolute top-2 right-2 bg-white p-2 rounded shadow text-sm">
        Hold Ctrl + Drag to Pan
      </div>
    </div>
  );
};

export default Canvas;

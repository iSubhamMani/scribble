"use client";

import { useCanvasStore } from "@/lib/store/canvas";
import { useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color?: string;
  strokeWidth?: number;
}

const useFreeHandDraw = (
  canvas: HTMLCanvasElement | null,
  getCanvasCoordinates: (x: number, y: number) => Point | null
) => {
  const [lines, setLines] = useState<Line[]>([]);
  const { setIsDrawing, scale } = useCanvasStore();

  const onMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setIsDrawing(true);
      setLines((current) => [
        ...current,
        {
          points: [coords],
          color: "red",
          strokeWidth: 2,
        },
      ]);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setLines((current) => {
        const newLines = [...current];
        const latestLine = newLines[newLines.length - 1];
        latestLine.points.push(coords);
        return newLines;
      });
    }
  };

  const draw = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    lines.forEach((line) => {
      if (line.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = line.color || "black";
      ctx.lineWidth = (line.strokeWidth || 2) / scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(line.points[0].x, line.points[0].y);

      line.points.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });

      ctx.stroke();
    });
  };

  return { onMouseDown, onMouseMove, draw };
};

export default useFreeHandDraw;

"use client";

import { useCanvasStore } from "@/lib/store/canvas";
import { Point } from "@/types/Point";
import { useState } from "react";

interface Rectangle {
  start: Point;
  end: Point;
  color?: string;
  strokeWidth?: number;
}

const useRectangle = (
  canvas: HTMLCanvasElement | null,
  getCanvasCoordinates: (x: number, y: number) => Point | null
) => {
  const [rects, setRects] = useState<Rectangle[]>([]);
  const { setIsDrawing, scale } = useCanvasStore();

  const onMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setIsDrawing(true);
      setRects((current) => [
        ...current,
        {
          start: coords,
          end: coords,
          color: "red",
          strokeWidth: 2,
        },
      ]);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setRects((current) => {
        const newRects = [...current];
        const currentRect = newRects[newRects.length - 1];
        currentRect.end = coords;
        return newRects;
      });
    }
  };

  const draw = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    rects.forEach((rect) => {
      const { start, end } = rect;
      const width = end.x - start.x;
      const height = end.y - start.y;

      ctx.beginPath();
      ctx.strokeStyle = rect.color || "black";
      ctx.lineWidth = (rect.strokeWidth || 2) / scale;
      ctx.roundRect(start.x, start.y, width, height, 5);
      ctx.stroke();
    });
  };

  return { onMouseDown, onMouseMove, draw };
};

export default useRectangle;

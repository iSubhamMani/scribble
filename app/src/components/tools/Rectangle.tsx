"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import { useToolsStore } from "@/lib/store/tools";
import { Point } from "@/types/Point";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "@/lib/store/user";

const useRectangle = (
  canvas: HTMLCanvasElement | null,
  getCanvasCoordinates: (x: number, y: number) => Point | null
) => {
  const { rects, setRects } = useToolsStore();
  const { setIsDrawing, scale, setToolsUsed } = useCanvasStore();
  const { user } = useUserStore();

  const onMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setIsDrawing(true);
      setRects((current) => [
        ...current,
        {
          id: uuidv4(),
          drawnBy: user?.email || "guest-" + Math.random(),
          start: coords,
          end: coords,
          color: "white",
          strokeWidth: 2,
        },
      ]);
      setToolsUsed((current) => [...current, Tool.rect]);
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

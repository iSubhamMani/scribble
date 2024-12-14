"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import { useToolsStore } from "@/lib/store/tools";
import { Point } from "@/types/Point";

const useCircle = (
  canvas: HTMLCanvasElement | null,
  getCanvasCoordinates: (x: number, y: number) => Point | null
) => {
  const { circles, setCircles } = useToolsStore();
  const { setIsDrawing, scale, setToolsUsed } = useCanvasStore();

  const onMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setIsDrawing(true);
      setCircles((current) => [
        ...current,
        {
          start: coords,
          end: coords,
          color: "red",
          strokeWidth: 2,
        },
      ]);
      setToolsUsed((current) => [...current, Tool.circle]);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      setCircles((current) => {
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

    circles.forEach((circle) => {
      const { start, end } = circle;
      const radius =
        Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) /
        2;

      ctx.beginPath();
      ctx.strokeStyle = circle.color || "black";
      ctx.lineWidth = (circle.strokeWidth || 2) / scale;
      ctx.arc(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        radius,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    });
  };

  return { onMouseDown, onMouseMove, draw };
};

export default useCircle;

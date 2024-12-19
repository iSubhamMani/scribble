import { Tool, useCanvasStore } from "@/lib/store/canvas";
import { Circle, Rectangle, useToolsStore } from "@/lib/store/tools";
import { Point } from "@/types/Point";
import React, { useState } from "react";

const useMoveTool = (
  getCanvasCoordinates: (x: number, y: number) => Point | null
) => {
  const [mouseDownCoords, setMouseDownCoords] = useState<Point | null>(null);

  const { rects, circles } = useToolsStore();
  const { selectedShape, setIsDrawing, setSelectedShape } = useCanvasStore();
  const boundary = 10;

  const onMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      let minDist = Infinity;
      let closestFigure = null;

      for (const rect of rects) {
        if (
          coords.x >= rect.start.x - boundary &&
          coords.x <= rect.end.x + boundary &&
          coords.y >= rect.start.y - boundary &&
          coords.y <= rect.end.y + boundary
        ) {
          const rectCentre = {
            x: (rect.start.x + rect.end.x) / 2,
            y: (rect.start.y + rect.end.y) / 2,
          };
          const distanceToCentre = Math.sqrt(
            Math.pow(coords.x - rectCentre.x, 2) +
              Math.pow(coords.y - rectCentre.y, 2)
          );
          if (distanceToCentre < minDist) {
            minDist = distanceToCentre;
            closestFigure = { data: rect, type: Tool.rect };
          }
        }
      }

      for (const circle of circles) {
        const center: Point = {
          x: (circle.end.x + circle.start.x) / 2,
          y: (circle.end.y + circle.start.y) / 2,
        };

        const radius =
          Math.sqrt(
            Math.pow(circle.end.x - circle.start.x, 2) +
              Math.pow(circle.end.y - circle.start.y, 2)
          ) / 2;

        if (
          Math.sqrt(
            Math.pow(coords.x - center.x, 2) + Math.pow(coords.y - center.y, 2)
          ) <=
          radius + boundary
        ) {
          const distanceToCentre = Math.sqrt(
            Math.pow(coords.x - center.x, 2) + Math.pow(coords.y - center.y, 2)
          );
          if (distanceToCentre < minDist) {
            minDist = distanceToCentre;
            closestFigure = { data: circle, type: Tool.circle };
          }
        }
      }

      if (closestFigure) {
        setIsDrawing(true);
        setMouseDownCoords(coords);
        setSelectedShape(closestFigure);
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!selectedShape || !mouseDownCoords) return;

    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (coords) {
      const dx = coords.x - mouseDownCoords.x; // Calculate delta
      const dy = coords.y - mouseDownCoords.y;

      const { data, type } = selectedShape;

      switch (type) {
        case Tool.rect:
          const rect = data as Rectangle;
          const updatedRect = rects.find((r) => r === rect);
          if (!updatedRect) return;

          updatedRect.start.x += dx;
          updatedRect.start.y += dy;
          updatedRect.end.x += dx;
          updatedRect.end.y += dy;

          break;
        case Tool.circle:
          const circle = data as Circle;
          const updatedCircle = circles.find((c) => c === circle);
          if (!updatedCircle) return;

          updatedCircle.start.x += dx;
          updatedCircle.start.y += dy;
          updatedCircle.end.x += dx;
          updatedCircle.end.y += dy;
          break;
      }

      // Update starting mouse position for smooth movement
      setMouseDownCoords(coords);
    }
  };

  const onMouseUp = () => {
    setMouseDownCoords(null); // Clear state
    setSelectedShape(null);
  };

  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useMoveTool;

"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import React, { useState, useRef, useEffect } from "react";
import useFreeHandDraw from "./tools/FreeHandDraw";
import { Point } from "@/types/Point";
import useRectangle from "./tools/Rectangle";
import useCircle from "./tools/Circle";
import useLine from "./tools/Line";
import {
  Circle,
  Line,
  Rectangle,
  StraightLine,
  useToolsStore,
} from "@/lib/store/tools";
import useMoveTool from "./tools/MoveTool";

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
    toolsUsed,
    setToolsUsed,
    toolsRemoved,
    setToolsRemoved,
  } = useCanvasStore();
  const { setCircles, setLines, setRects, setStraightLines } = useToolsStore();
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
  const { onMouseMove: onMouseMoveTool, onMouseDown: onMouseDownMove } =
    useMoveTool(getCanvasCoordinates);

  const {
    draw: drawFreeHand,
    onMouseDown: onMouseDownFreeHand,
    onMouseMove: onMouseMoveFreeHand,
  } = useFreeHandDraw(canvasRef.current, getCanvasCoordinates);

  const {
    draw: drawRect,
    onMouseDown: onMouseDownRect,
    onMouseMove: onMouseMoveRect,
  } = useRectangle(canvasRef.current, getCanvasCoordinates);

  const {
    draw: drawCircle,
    onMouseDown: onMouseDownCircle,
    onMouseMove: onMouseMoveCircle,
  } = useCircle(canvasRef.current, getCanvasCoordinates);

  const {
    draw: drawLine,
    onMouseDown: onMouseDownLine,
    onMouseMove: onMouseMoveLine,
  } = useLine(canvasRef.current, getCanvasCoordinates);

  /*const { draw: drawText, onMouseDown: onMouseDownText } = useText(
    canvasRef.current,
    getCanvasCoordinates
  );*/

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
        case Tool.move:
          onMouseDownMove(e);
          break;
        case Tool.freeHand:
          onMouseDownFreeHand(e);
          break;
        case Tool.rect:
          onMouseDownRect(e);
          break;
        case Tool.circle:
          onMouseDownCircle(e);
          break;
        case Tool.line:
          onMouseDownLine(e);
          break;
        case Tool.text:
          //onMouseDownText(e);
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
        case Tool.move:
          onMouseMoveTool(e);
          break;
        case Tool.freeHand:
          onMouseMoveFreeHand(e);
          break;
        case Tool.rect:
          onMouseMoveRect(e);
          break;
        case Tool.circle:
          onMouseMoveCircle(e);
          break;
        case Tool.line:
          onMouseMoveLine(e);
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "z") {
      const lastTool = toolsUsed[toolsUsed.length - 1];
      if (!lastTool) return;
      setToolsUsed((current) => current.slice(0, -1));

      let lastValue = {};

      // remove the last drawn shape
      switch (lastTool) {
        case Tool.freeHand:
          setLines((current) => {
            lastValue = current[current.length - 1];
            return current.slice(0, -1);
          });
          break;
        case Tool.rect:
          setRects((current) => {
            lastValue = current[current.length - 1];
            return current.slice(0, -1);
          });
          break;
        case Tool.circle:
          setCircles((current) => {
            lastValue = current[current.length - 1];
            return current.slice(0, -1);
          });
          break;
        case Tool.line:
          setStraightLines((current) => {
            lastValue = current[current.length - 1];
            return current.slice(0, -1);
          });
          break;
        case Tool.text:
          break;
        default:
          break;
      }

      setToolsRemoved((current) => [
        ...current,
        { tool: lastTool, value: lastValue },
      ]);
    }

    if (e.ctrlKey && e.key === "y") {
      const lastRemovedTool = toolsRemoved[toolsRemoved.length - 1];
      if (!lastRemovedTool) return;
      setToolsRemoved((current) => current.slice(0, -1));
      setToolsUsed((current) => [...current, lastRemovedTool.tool]);

      switch (lastRemovedTool.tool) {
        case Tool.freeHand:
          setLines((current) => [...current, lastRemovedTool.value as Line]);
          break;
        case Tool.rect:
          setRects((current) => [
            ...current,
            lastRemovedTool.value as Rectangle,
          ]);
          break;
        case Tool.circle:
          setCircles((current) => [
            ...current,
            lastRemovedTool.value as Circle,
          ]);
          break;
        case Tool.line:
          setStraightLines((current) => [
            ...current,
            lastRemovedTool.value as StraightLine,
          ]);
          break;
        case Tool.text:
          break;
        default:
          break;
      }
    }
  };

  // Zoom handling
  const handleWheel = (e: React.WheelEvent) => {
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
      className="relative w-full h-screen overflow-hidden bg-gray-100"
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

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
import { ForwardIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { WebSocketMessage, WebSocketService } from "@/lib/ws/WebSocket";
import { useUserStore } from "@/lib/store/user";
import toast from "react-hot-toast";

const Canvas: React.FC = () => {
  const { data: session } = useSession();
  const [wss, setWss] = useState<WebSocketService | null>(null);
  const { setUser } = useUserStore();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

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
    setTool,
  } = useCanvasStore();
  const {
    rects,
    circles,
    lines,
    straightLines,
    setCircles,
    setLines,
    setRects,
    setStraightLines,
  } = useToolsStore();
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
  const {
    onMouseMove: onMouseMoveTool,
    onMouseDown: onMouseDownMove,
    onMouseUp: onMouseUpMove,
  } = useMoveTool(wss, canvasRef.current, getCanvasCoordinates);

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
    if (isDrawing && wss) {
      // Send the last drawn shape to other clients
      let data;
      switch (tool) {
        case Tool.freeHand:
          data = lines[lines.length - 1];
          break;
        case Tool.rect:
          data = rects[rects.length - 1];
          break;
        case Tool.circle:
          data = circles[circles.length - 1];
          break;
        case Tool.line:
          data = straightLines[straightLines.length - 1];
          break;
      }

      if (data) {
        wss.sendDrawEvent(tool, data, data.id);
      }
    }

    setIsDrawing(false);
    setIsPanning(false);
    onMouseUpMove();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // shortcuts

    if (e.key === "v") {
      setTool(Tool.move);
    }

    if (e.key === "f") {
      setTool(Tool.freeHand);
    }

    if (e.key === "r") {
      setTool(Tool.rect);
    }

    if (e.key === "c") {
      setTool(Tool.circle);
    }

    if (e.key === "l") {
      setTool(Tool.line);
    }

    // undo and redo

    if (e.ctrlKey && e.key === "z") {
      const lastTool = toolsUsed[toolsUsed.length - 1];
      if (!lastTool) return;
      setToolsUsed((current) => current.slice(0, -1));

      let lastValue: Rectangle | Line | Circle | StraightLine = {
        id: "",
        drawnBy: "",
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
      };

      // remove the last drawn shape
      switch (lastTool) {
        case Tool.freeHand:
          setLines((current) => {
            const drawnByCurrentUser = current.filter(
              (c) => c.drawnBy === session?.user?.email
            );
            lastValue = drawnByCurrentUser[drawnByCurrentUser.length - 1];
            return current.filter((c) => c !== lastValue);
          });
          break;
        case Tool.rect:
          setRects((current) => {
            const drawnByCurrentUser = current.filter(
              (c) => c.drawnBy === session?.user?.email
            );
            lastValue = drawnByCurrentUser[drawnByCurrentUser.length - 1];
            return current.filter((c) => c !== lastValue);
          });
          break;
        case Tool.circle:
          setCircles((current) => {
            const drawnByCurrentUser = current.filter(
              (c) => c.drawnBy === session?.user?.email
            );
            lastValue = drawnByCurrentUser[drawnByCurrentUser.length - 1];
            return current.filter((c) => c !== lastValue);
          });
          break;
        case Tool.line:
          setStraightLines((current) => {
            const drawnByCurrentUser = current.filter(
              (c) => c.drawnBy === session?.user?.email
            );
            lastValue = drawnByCurrentUser[drawnByCurrentUser.length - 1];
            return current.filter((c) => c !== lastValue);
          });
          break;
        case Tool.text:
          break;
        default:
          break;
      }

      if (!lastValue) return;

      setToolsRemoved((current) => [
        ...current,
        { tool: lastTool, value: lastValue },
      ]);

      if (wss) {
        wss.sendUndoEvent(lastValue, lastTool, lastValue.id);
      }
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

      if (wss) {
        wss.sendRedoEvent(
          lastRemovedTool.value,
          lastRemovedTool.tool,
          lastRemovedTool.value.id
        );
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

  // socket connection
  useEffect(() => {
    if (session?.user?.email) {
      const ws = new WebSocketService(
        `${process.env.NEXT_PUBLIC_WS_URL}`,
        session.user.email
      );

      if (ws)
        toast.success("Connected to the server", {
          position: "bottom-right",
          duration: 2500,
        });

      ws.onDrawEvent((message) => {
        switch (message.type) {
          case "draw":
            handleRemoteDrawing(message);
            break;
          // Add other cases as needed
          case "update":
            handleRemoteUpdate(message);
            break;
          case "undo":
            handleRemoteUndo(message);
            break;
          case "redo":
            handleRemoteRedo(message);
            break;
        }
      });

      setWss(ws);
    }
  }, [session]);

  const handleRemoteDrawing = (message: WebSocketMessage) => {
    switch (message.tool) {
      case Tool.freeHand:
        setLines((current) => [...current, message.data as Line]);
        break;
      case Tool.rect:
        setRects((current) => [...current, message.data as Rectangle]);
        break;
      case Tool.circle:
        setCircles((current) => [...current, message.data as Circle]);
        break;
      case Tool.line:
        setStraightLines((current) => [
          ...current,
          message.data as StraightLine,
        ]);
        break;
    }
  };

  const handleRemoteUpdate = (message: WebSocketMessage) => {
    const { shapeId, tool, data } = message;

    switch (tool) {
      case Tool.rect:
        setRects((current) => {
          const updatedRect = current.find((r) => r.id === shapeId);
          if (!updatedRect) return current;

          updatedRect.start = data.start;
          updatedRect.end = data.end;

          return current;
        });
        break;
      case Tool.circle:
        setCircles((current) => {
          const updatedCircle = current.find((c) => c.id === shapeId);
          if (!updatedCircle) return current;

          updatedCircle.start = data.start;
          updatedCircle.end = data.end;

          return current;
        });
        break;
      case Tool.line:
        setStraightLines((current) => {
          const updatedLine = current.find((l) => l.id === shapeId);
          if (!updatedLine) return current;

          updatedLine.start = data.start;
          updatedLine.end = data.end;

          return current;
        });
        break;
    }
  };

  const handleRemoteUndo = (message: WebSocketMessage) => {
    const { shapeId, tool } = message;

    switch (tool) {
      case Tool.rect:
        setRects((current) => current.filter((r) => r.id !== shapeId));
        break;
      case Tool.circle:
        setCircles((current) => current.filter((c) => c.id !== shapeId));
        break;
      case Tool.line:
        setStraightLines((current) => current.filter((l) => l.id !== shapeId));
        break;
      case Tool.freeHand:
        setLines((current) => current.filter((l) => l.id !== shapeId));
        break;
    }
  };

  const handleRemoteRedo = (message: WebSocketMessage) => {
    const { tool } = message;

    switch (tool) {
      case Tool.rect:
        setRects((current) => [...current, message.data as Rectangle]);
        break;
      case Tool.circle:
        setCircles((current) => [...current, message.data as Circle]);
        break;
      case Tool.line:
        setStraightLines((current) => [
          ...current,
          message.data as StraightLine,
        ]);
        break;
      case Tool.freeHand:
        setLines((current) => [...current, message.data as Line]);
        break;
    }
  };

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
      <div className="flex items-center gap-2 absolute top-4 right-4 bg-primary px-4 py-2 rounded shadow text-base text-primary-foreground">
        Share
        <ForwardIcon className="size-5" />
      </div>
    </div>
  );
};

export default Canvas;

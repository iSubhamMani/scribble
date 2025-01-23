"use client";

import {
  Circle,
  Line,
  Rectangle,
  StraightLine,
  useToolsStore,
} from "@/lib/store/tools";
import { Tool, useCanvasStore } from "@/lib/store/canvas";
import useFreeHandDraw from "@/components/tools/FreeHandDraw";
import useMoveTool from "@/components/tools/MoveTool";
import useRectangle from "@/components/tools/Rectangle";
import useCircle from "@/components/tools/Circle";
import useLine from "@/components/tools/Line";
import { WebSocketService } from "@/lib/ws/WebSocket";
import { Point } from "@/types/Point";
import { Session } from "next-auth";

const useMouseEvents = (
  session: Session | null,
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  wss: WebSocketService | null,
  getCanvasCoordinates: (clientX: number, clientY: number) => Point | null,
  roomId: string,
  setOffset: React.Dispatch<React.SetStateAction<Point>>,
  editAccess: boolean
) => {
  const {
    circles,
    lines,
    straightLines,
    rects,
    setCircles,
    setLines,
    setRects,
    setStraightLines,
  } = useToolsStore();
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
    onMouseMove: onMouseMoveTool,
    onMouseDown: onMouseDownMove,
    onMouseUp: onMouseUpMove,
  } = useMoveTool(wss, getCanvasCoordinates, roomId);
  const { onMouseDown: onMouseDownFreeHand, onMouseMove: onMouseMoveFreeHand } =
    useFreeHandDraw(canvasRef.current, getCanvasCoordinates);

  const { onMouseDown: onMouseDownRect, onMouseMove: onMouseMoveRect } =
    useRectangle(canvasRef.current, getCanvasCoordinates);

  const { onMouseDown: onMouseDownCircle, onMouseMove: onMouseMoveCircle } =
    useCircle(canvasRef.current, getCanvasCoordinates);

  const { onMouseDown: onMouseDownLine, onMouseMove: onMouseMoveLine } =
    useLine(canvasRef.current, getCanvasCoordinates);

  // Drawing function
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ctrl key for panning, normal click for drawing
    if (e.ctrlKey) {
      // Panning
      setIsPanning(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    } else {
      // Drawing
      if (!editAccess) return;
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
      if (!editAccess) return;
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
    if (!editAccess) return;
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
        wss.sendDrawEvent(tool, data, data.id, roomId);
      }
    }

    setIsDrawing(false);
    setIsPanning(false);
    onMouseUpMove();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // shortcuts
    if (!editAccess) return;
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
        wss.sendUndoEvent(lastValue, lastTool, lastValue.id, roomId);
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
          lastRemovedTool.value.id,
          roomId
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

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    onKeyDown,
    handleWheel,
  };
};

export default useMouseEvents;

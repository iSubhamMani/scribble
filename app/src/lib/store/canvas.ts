import { create } from "zustand";

interface Point {
  x: number;
  y: number;
}

export enum Tool {
  freeHand = "FREE_HAND",
  eraser = "ERASER",
  line = "LINE",
  text = "TEXT",
  rect = "RECTANGLE",
}

type Canvas = {
  scale: number;
  isPanning: boolean;
  isDrawing: boolean;
  lastPosition: Point;
  tool: Tool;
  setScale: (scale: number) => void;
  setIsPanning: (isPanning: boolean) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setLastPosition: (lastPosition: Point) => void;
  setTool: (tool: Tool) => void;
};

export const useCanvasStore = create<Canvas>()((set) => ({
  scale: 1,
  isPanning: false,
  isDrawing: false,
  lastPosition: { x: 0, y: 0 },
  tool: Tool.freeHand,
  setScale: (scale) => set({ scale }),
  setIsPanning: (isPanning) => set({ isPanning }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setLastPosition: (lastPosition) => set({ lastPosition }),
  setTool: (tool) => set({ tool }),
}));

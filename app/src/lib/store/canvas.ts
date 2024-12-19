import { create } from "zustand";
import { Circle, Line, Rectangle, StraightLine } from "./tools";

interface Point {
  x: number;
  y: number;
}

export enum Tool {
  move = "MOVE",
  freeHand = "FREE_HAND",
  eraser = "ERASER",
  line = "LINE",
  text = "TEXT",
  rect = "RECTANGLE",
  circle = "CIRCLE",
}

interface ToolsRemoved {
  tool: Tool;
  value: object;
}

interface SelectedShape {
  data: Line | Circle | Rectangle | StraightLine;
  type: Tool;
}

type Canvas = {
  scale: number;
  isPanning: boolean;
  isDrawing: boolean;
  lastPosition: Point;
  tool: Tool;
  toolsUsed: Tool[];
  toolsRemoved: ToolsRemoved[];
  selectedShape: SelectedShape | null;
  setScale: (scale: number) => void;
  setIsPanning: (isPanning: boolean) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setLastPosition: (lastPosition: Point) => void;
  setTool: (tool: Tool) => void;
  setToolsUsed: (updater: (prevRects: Tool[]) => Tool[]) => void;
  setToolsRemoved: (
    updater: (prevRects: ToolsRemoved[]) => ToolsRemoved[]
  ) => void;
  setSelectedShape: (shape: SelectedShape | null) => void;
};

export const useCanvasStore = create<Canvas>()((set) => ({
  scale: 1,
  isPanning: false,
  isDrawing: false,
  lastPosition: { x: 0, y: 0 },
  tool: Tool.move,
  toolsUsed: [],
  toolsRemoved: [],
  selectedShape: null,
  setScale: (scale) => set({ scale }),
  setIsPanning: (isPanning) => set({ isPanning }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setLastPosition: (lastPosition) => set({ lastPosition }),
  setTool: (tool) => set({ tool }),
  setToolsUsed: (updater) =>
    set((state) => ({
      toolsUsed: updater(state.toolsUsed),
    })),
  setToolsRemoved: (updater) =>
    set((state) => ({ toolsRemoved: updater(state.toolsRemoved) })),
  setSelectedShape: (selectedShape) => set({ selectedShape }),
}));

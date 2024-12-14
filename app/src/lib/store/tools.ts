import { Point } from "@/types/Point";
import { create } from "zustand";

export interface Circle {
  start: Point;
  end: Point;
  color?: string;
  strokeWidth?: number;
}

export interface Line {
  points: Point[];
  color?: string;
  strokeWidth?: number;
}

export interface StraightLine {
  start: Point;
  end: Point;
  color?: string;
  strokeWidth?: number;
}

export interface Rectangle {
  start: Point;
  end: Point;
  color?: string;
  strokeWidth?: number;
}

type Tools = {
  circles: Circle[];
  setCircles: (updater: (prevCircles: Circle[]) => Circle[]) => void;
  lines: Line[];
  setLines: (updater: (prevLines: Line[]) => Line[]) => void;
  straightLines: StraightLine[];
  setStraightLines: (
    updater: (prevStraightLines: StraightLine[]) => StraightLine[]
  ) => void;
  rects: Rectangle[];
  setRects: (updater: (prevRects: Rectangle[]) => Rectangle[]) => void;
};

export const useToolsStore = create<Tools>()((set) => ({
  circles: [],
  setCircles: (updater) =>
    set((state) => ({
      circles: updater(state.circles),
    })),
  lines: [],
  setLines: (updater) =>
    set((state) => ({
      lines: updater(state.lines),
    })),
  straightLines: [],
  setStraightLines: (updater) =>
    set((state) => ({
      straightLines: updater(state.straightLines),
    })),
  rects: [],
  setRects: (updater) =>
    set((state) => ({
      rects: updater(state.rects),
    })),
}));

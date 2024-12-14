"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import {
  CircleIcon,
  EraserIcon,
  PencilIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react";

const tools = [
  {
    icon: PencilIcon,
    tool: Tool.freeHand,
  },
  {
    icon: SquareIcon,
    tool: Tool.rect,
  },
  {
    icon: CircleIcon,
    tool: Tool.circle,
  },
  {
    icon: TypeIcon,
    tool: Tool.text,
  },
  {
    icon: EraserIcon,
    tool: Tool.eraser,
  },
];

const Toolbar = () => {
  const { setTool, tool } = useCanvasStore();

  return (
    <div className="z-50 fixed px-4 py-2 top-4 w-max h-max inset-0 mx-auto rounded-full shadow-md border flex gap-2 bg-white">
      {tools.map((t) => {
        return (
          <button
            key={t.tool}
            onClick={() => setTool(t.tool)}
            className={`p-2 ${tool !== t.tool && "hover:bg-primary/20"} ${
              tool === t.tool && "bg-primary text-white"
            }  text-black rounded-full`}
          >
            <t.icon className="size-5" />
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;

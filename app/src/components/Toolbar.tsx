"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import {
  CircleIcon,
  MinusIcon,
  MousePointer2Icon,
  PencilIcon,
  SquareIcon,
  TypeIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tools = [
  {
    icon: MousePointer2Icon,
    tool: Tool.move,
    name: "Move",
    shortcut: "V",
  },
  {
    icon: PencilIcon,
    tool: Tool.freeHand,
    name: "Free Hand",
    shortcut: "F",
  },
  {
    icon: SquareIcon,
    tool: Tool.rect,
    name: "Rectangle",
    shortcut: "R",
  },
  {
    icon: CircleIcon,
    tool: Tool.circle,
    name: "Circle",
    shortcut: "C",
  },
  {
    icon: MinusIcon,
    tool: Tool.line,
    name: "Line",
    shortcut: "L",
  },
  {
    icon: TypeIcon,
    tool: Tool.text,
    name: "Text",
    shortcut: "T",
  },
];

const Toolbar = () => {
  const { setTool, tool } = useCanvasStore();

  return (
    <div className="z-50 fixed px-4 py-2 top-4 mx-auto w-max h-max inset-0 rounded-md shadow-md flex gap-2 bg-zinc-800">
      <TooltipProvider>
        {tools.map((t) => {
          return (
            <Tooltip key={t.tool}>
              <TooltipTrigger
                onClick={() => setTool(t.tool)}
                className={`relative p-2 text-white ${
                  tool !== t.tool && "hover:bg-primary-foreground/10"
                } ${tool === t.tool && "bg-primary"} rounded-md`}
              >
                <span className="absolute -bottom-[2.5px] right-[2px] text-[0.55rem]">
                  {t.shortcut}
                </span>
                <t.icon className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{t.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;

"use client";

import { Tool, useCanvasStore } from "@/lib/store/canvas";
import {
  CircleIcon,
  MinusIcon,
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
    icon: PencilIcon,
    tool: Tool.freeHand,
    name: "Free Hand",
  },
  {
    icon: SquareIcon,
    tool: Tool.rect,
    name: "Rectangle",
  },
  {
    icon: CircleIcon,
    tool: Tool.circle,
    name: "Circle",
  },
  {
    icon: MinusIcon,
    tool: Tool.line,
    name: "Line",
  },
  {
    icon: TypeIcon,
    tool: Tool.text,
    name: "Text",
  },
];

const Toolbar = () => {
  const { setTool, tool } = useCanvasStore();

  return (
    <div className="z-50 fixed px-4 py-2 left-4 my-auto w-max h-max inset-0 rounded-full shadow-md border flex flex-col gap-2 bg-white">
      <TooltipProvider>
        {tools.map((t) => {
          return (
            <Tooltip key={t.tool}>
              <TooltipTrigger
                onClick={() => setTool(t.tool)}
                className={`p-2 ${tool !== t.tool && "hover:bg-primary/20"} ${
                  tool === t.tool && "bg-primary text-white"
                }  text-black rounded-full`}
              >
                <t.icon className="size-5" />
              </TooltipTrigger>
              <TooltipContent side="right">
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

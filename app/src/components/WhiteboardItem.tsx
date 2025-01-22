"use client";

import { Whiteboard } from "@/models/Whiteboard";
import { EllipsisVertical, GlobeIcon } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TableCell, TableRow } from "./ui/table";
import { formatDate } from "@/utils/DateFormatter";
import { useRouter } from "next/navigation";

const WhiteboardItem = (whiteboard: Whiteboard) => {
  const router = useRouter();
  return (
    <TableRow
      onClick={() => router.push(`/whiteboard/${whiteboard.id}`)}
      className="cursor-pointer py-4 px-6 border-t w-full hover:bg-secondary/40 hover:shadow-lg transition-shadow ease-in-out duration-200"
    >
      <TableCell>
        <span className="text-sm font-medium max-w-xl line-clamp-1">
          {whiteboard.title}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span>
                {whiteboard.shareOption === "anyone" ? (
                  <GlobeIcon className="size-5 text-accent" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-5 text-secondary-foreground/75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {whiteboard.shareOption === "anyone" ? "Public" : "Private"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        <span>{formatDate(whiteboard.createdAt)}</span>
      </TableCell>
      <TableCell className="text-center">
        <span>{formatDate(whiteboard.updatedAt)}</span>
      </TableCell>
      <TableCell className="text-center">
        <EllipsisVertical
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="size-8 p-2 text-secondary-foreground hover:bg-secondary rounded-full"
        />
      </TableCell>
    </TableRow>
  );
};

export default WhiteboardItem;

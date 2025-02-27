"use client";

import { Whiteboard } from "@/models/Whiteboard";
import {
  EllipsisVertical,
  GlobeIcon,
  LoaderCircle,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TableCell, TableRow } from "./ui/table";
import { formatDate } from "@/utils/DateFormatter";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteWhiteboard,
  renameWhiteboard,
} from "@/utils/WhiteboardOperations";
import toast from "react-hot-toast";

type DropdownMenuOperations = "rename" | "delete" | "markFavourite";

const WhiteboardItem = (whiteboard: Whiteboard) => {
  const [dropDownOperation, setDropDownOperation] =
    useState<DropdownMenuOperations | null>(null);
  const [dropdownDialogTitle, setDropdownDialogTitle] = useState<string>("");
  const [dropdownDialogDescription, setDropdownDialogDescription] =
    useState<string>("");
  const [newWhiteBoardName, setNewWhiteBoardName] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const qc = useQueryClient();

  const { mutate: muatateDelete, isPending: deleting } = useMutation({
    mutationFn: async () => await deleteWhiteboard(whiteboard.id),
    onSuccess: () => {
      toast.success("Whiteboard deleted successfully");
      qc.invalidateQueries({
        queryKey: ["all-whiteboards"],
      });
      setDialogOpen(false);
      setDropDownOperation(null);
    },
    onError: (error) => {
      toast.error(error || "Error deleting whiteboard");
    },
  });

  const { mutate: mutateRename, isPending: renaming } = useMutation({
    mutationFn: async () =>
      await renameWhiteboard(whiteboard.id, newWhiteBoardName),
    onSuccess: () => {
      toast.success("Whiteboard renamed successfully");
      qc.invalidateQueries({
        queryKey: ["all-whiteboards"],
      });
      setDialogOpen(false);
      setDropDownOperation(null);
    },
    onError: (error) => {
      toast.error(error || "Error renaming whiteboard");
    },
  });

  useEffect(() => {
    if (dropDownOperation === null) return;

    switch (dropDownOperation) {
      case "rename":
        setDropdownDialogTitle("Rename Whiteboard");
        setDropdownDialogDescription("Enter the new name for the whiteboard");
        break;
      case "delete":
        setDropdownDialogTitle("Delete Whiteboard");
        setDropdownDialogDescription(
          "Are you sure you want to delete this whiteboard?"
        );
        break;
      case "markFavourite":
        setDropdownDialogTitle("Mark Favourite");
        setDropdownDialogDescription(
          "Are you sure you want to mark this whiteboard as favourite?"
        );
        break;
    }
  }, [dropDownOperation]);

  const handleConfirmOperation = async () => {
    switch (dropDownOperation) {
      case "rename":
        mutateRename();
        break;
      case "delete":
        muatateDelete();
        break;
      case "markFavourite":
        console.log("Mark Favourite operation");
        break;
    }
  };

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="size-8 p-2 text-secondary-foreground hover:bg-secondary rounded-full"
              />
            </DropdownMenuTrigger>
            <DialogTrigger asChild>
              <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem
                  onClick={() => setDropDownOperation("rename")}
                >
                  <PencilIcon className="size-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDropDownOperation("delete")}
                >
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDropDownOperation("markFavourite")}
                >
                  <StarIcon className="size-4 mr-2" />
                  Mark Favourite
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DialogTrigger>
          </DropdownMenu>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>{dropdownDialogTitle}</DialogTitle>
              <DialogDescription>
                {dropdownDialogDescription}
                {dropDownOperation === "rename" && (
                  <Input
                    className="mt-4"
                    placeholder="Enter new name"
                    value={newWhiteBoardName}
                    onChange={(e) => setNewWhiteBoardName(e.target.value)}
                  />
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleConfirmOperation} type="submit">
                {deleting || renaming ? (
                  <LoaderCircle className="animate-spin size-5 text-secondary-foreground" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default WhiteboardItem;

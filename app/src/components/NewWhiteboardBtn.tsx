"use client";

import { createNewWhiteboard } from "@/actions/whiteboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorToast, successToast } from "@/utils/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useRef, useState } from "react";

const NewWhiteboardBtn = () => {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const q = useQueryClient();
  const closeRef = useRef<HTMLButtonElement>(null);

  const createWhiteBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.trim() === "") return;
    setLoading(true);
    const res = await createNewWhiteboard(title);

    if (res.success) {
      successToast(res.message as string);
      closeRef.current?.click();
      q.invalidateQueries({ queryKey: ["all-whiteboards"], exact: true });
    } else {
      errorToast(res.message || "Failed to create whiteboard");
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-primary/5 hover:bg-primary/10 border border-primary border-dashed max-w-xs p-4 flex flex-col items-center rounded-md space-x-2 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-[40px] text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Whiteboard
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Whiteboard</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={createWhiteBoard}
          className="flex items-center space-x-2"
        >
          <div className="grid flex-1 gap-4">
            <Label htmlFor="title" className="">
              Title
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                placeholder="Enter title"
              />
              <Button
                disabled={loading}
                type="submit"
                size="sm"
                className="px-3"
              >
                {loading ? (
                  <LoaderCircleIcon className="animate-spin size-6" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </form>
        <DialogFooter className="sm:justify-start">
          <DialogClose ref={closeRef} asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewWhiteboardBtn;

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NewWhiteboardBtn = () => {
  const router = useRouter();

  const createWhiteBoard = () => {
    router.push("/whiteboard/123");
  };

  return (
    <Button
      onClick={createWhiteBoard}
      className="text-sm flex items-center"
      variant={"default"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-8 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      New Whiteboard
    </Button>
  );
};

export default NewWhiteboardBtn;

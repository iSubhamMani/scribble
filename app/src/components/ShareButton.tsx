"use client";

import { ForwardIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccessControlForm from "./AccessControlForm";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ShareButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 absolute top-4 right-4">
          Share
          <ForwardIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Share With</DialogTitle>
        </DialogHeader>
        <AccessControlForm />
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;

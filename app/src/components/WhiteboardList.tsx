"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import WhiteboardItem from "./WhiteboardItem";
import { Whiteboard } from "@/models/Whiteboard";
import { LoaderCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const WhiteboardList = () => {
  const {
    data: whiteboards,
    isError,
    isFetching,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["all-whiteboards"],
    queryFn: async () => {
      const res = await axios.get("/api/whiteboard/all");
      return res.data.data;
    },
    staleTime: Infinity,
  });

  console.log(whiteboards);

  if (isFetching) {
    return (
      <div className="flex justify-center mt-6">
        <LoaderCircle className="animate-spin size-6 text-secondary-foreground" />
      </div>
    );
  }

  if (isError) {
    const errorMsg = isAxiosError(error)
      ? error.response?.data.message
      : error.message;
    return (
      <div className="mt-6 flex justify-center">
        <p className="text-destructive text-base">{errorMsg}</p>
      </div>
    );
  }

  if (isSuccess && whiteboards.length === 0) {
    return (
      <div className="mt-16 flex justify-center">
        <div>
          <div className="flex justify-center">
            <Image
              className="opacity-80"
              src={"/create-whiteboard.svg"}
              width={200}
              height={200}
              alt="Create"
            />
          </div>
          <p className="mt-2 text-base text-secondary-foreground">
            Start Scribbling by creating a new Whiteboard
          </p>
        </div>
      </div>
    );
  }

  return (
    isSuccess &&
    whiteboards.length > 0 && (
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-xs">Title</TableHead>
            <TableHead className="w-[150px] text-center">Visibility</TableHead>
            <TableHead className="w-[150px] text-center">Created</TableHead>
            <TableHead className="w-[150px] text-center">Edited</TableHead>
            <TableHead className="w-[50px] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {whiteboards.map((whiteboard: Whiteboard) => (
            <WhiteboardItem key={whiteboard.id} {...whiteboard} />
          ))}
        </TableBody>
      </Table>
    )
  );
};

export default WhiteboardList;

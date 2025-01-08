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
      return res.data;
    },
    staleTime: Infinity,
  });

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

  return (
    isSuccess &&
    whiteboards && (
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
          {whiteboards.data.map((whiteboard: Whiteboard) => (
            <WhiteboardItem key={whiteboard.id} {...whiteboard} />
          ))}
        </TableBody>
      </Table>
    )
  );
};

export default WhiteboardList;

"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import WhiteboardItem from "@/components/WhiteboardItem";
import { Whiteboard } from "@/models/Whiteboard";
import { LoaderCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Favourites = () => {
  const {
    data: whiteboards,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => {
      const res = await axios.get("/api/whiteboard/favourite/all");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
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
        <p className="font-medium text-white text-sm">
          You have not marked any whiteboard as favourite
        </p>
      </div>
    );
  }

  return (
    <div>
      {isFetching && (
        <div className="flex justify-center mt-6">
          <LoaderCircle className="animate-spin size-6 text-secondary-foreground" />
        </div>
      )}
      {isSuccess && whiteboards.length > 0 && (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-xs">Title</TableHead>
              <TableHead className="w-[150px] text-center">
                Visibility
              </TableHead>
              <TableHead className="w-[150px] text-center">Created</TableHead>
              <TableHead className="w-[150px] text-center">Edited</TableHead>
              <TableHead className="w-[30px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {whiteboards.map((whiteboard: Whiteboard) => (
              <WhiteboardItem key={whiteboard.id} {...whiteboard} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Favourites;

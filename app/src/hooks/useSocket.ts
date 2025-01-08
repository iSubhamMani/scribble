"use client";

import { Tool } from "@/lib/store/canvas";
import {
  Circle,
  Line,
  Rectangle,
  StraightLine,
  useToolsStore,
} from "@/lib/store/tools";
import { DrawEventMessage, WebSocketService } from "@/lib/ws/WebSocket";
import { errorToast, successToast } from "@/utils/Toast";
import { Session } from "next-auth";
import { SetStateAction, useEffect } from "react";

const useSocket = (
  session: Session | null,
  wss: WebSocketService | null,
  setWss: React.Dispatch<SetStateAction<WebSocketService | null>>,
  roomId: string
) => {
  const { setCircles, setLines, setRects, setStraightLines } = useToolsStore();

  useEffect(() => {
    if (wss) return;
    if (session?.user?.email) {
      const ws = new WebSocketService(
        `${process.env.NEXT_PUBLIC_WS_URL}`,
        session.user.email,
        roomId
      );

      ws.onServerEvent((message) => {
        if (message.type === "client_event") {
          const { event, data } = message.data;

          switch (event) {
            case "error":
              errorToast(data);
              break;
            case "success":
              successToast(data);
              break;
          }
        } else if (message.type === "draw_event") {
          const drawEvent = message.data as DrawEventMessage;

          switch (drawEvent.event) {
            case "draw":
              handleRemoteDrawing(drawEvent);
              break;
            case "update":
              handleRemoteUpdate(drawEvent);
              break;
            case "undo":
              handleRemoteUndo(drawEvent);
              break;
            case "redo":
              handleRemoteRedo(drawEvent);
              break;
          }
        }
      });

      setWss(ws);
    }
  }, [session, wss]);

  const handleRemoteDrawing = (message: DrawEventMessage) => {
    switch (message.tool) {
      case Tool.freeHand:
        setLines((current) => [...current, message.data as Line]);
        break;
      case Tool.rect:
        setRects((current) => [...current, message.data as Rectangle]);
        break;
      case Tool.circle:
        setCircles((current) => [...current, message.data as Circle]);
        break;
      case Tool.line:
        setStraightLines((current) => [
          ...current,
          message.data as StraightLine,
        ]);
        break;
    }
  };

  const handleRemoteUpdate = (message: DrawEventMessage) => {
    const { shapeId, tool, data } = message;

    switch (tool) {
      case Tool.rect:
        setRects((current) => {
          const updatedRect = current.find((r) => r.id === shapeId);
          if (!updatedRect) return current;

          updatedRect.start = data.start;
          updatedRect.end = data.end;

          return current;
        });
        break;
      case Tool.circle:
        setCircles((current) => {
          const updatedCircle = current.find((c) => c.id === shapeId);
          if (!updatedCircle) return current;

          updatedCircle.start = data.start;
          updatedCircle.end = data.end;

          return current;
        });
        break;
      case Tool.line:
        setStraightLines((current) => {
          const updatedLine = current.find((l) => l.id === shapeId);
          if (!updatedLine) return current;

          updatedLine.start = data.start;
          updatedLine.end = data.end;

          return current;
        });
        break;
    }
  };

  const handleRemoteUndo = (message: DrawEventMessage) => {
    const { shapeId, tool } = message;

    switch (tool) {
      case Tool.rect:
        setRects((current) => current.filter((r) => r.id !== shapeId));
        break;
      case Tool.circle:
        setCircles((current) => current.filter((c) => c.id !== shapeId));
        break;
      case Tool.line:
        setStraightLines((current) => current.filter((l) => l.id !== shapeId));
        break;
      case Tool.freeHand:
        setLines((current) => current.filter((l) => l.id !== shapeId));
        break;
    }
  };

  const handleRemoteRedo = (message: DrawEventMessage) => {
    const { tool } = message;

    switch (tool) {
      case Tool.rect:
        setRects((current) => [...current, message.data as Rectangle]);
        break;
      case Tool.circle:
        setCircles((current) => [...current, message.data as Circle]);
        break;
      case Tool.line:
        setStraightLines((current) => [
          ...current,
          message.data as StraightLine,
        ]);
        break;
      case Tool.freeHand:
        setLines((current) => [...current, message.data as Line]);
        break;
    }
  };

  return null;
};

export default useSocket;

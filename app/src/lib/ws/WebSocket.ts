/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tool } from "../store/canvas";

export type DrawEventMessage = {
  event: "draw" | "clear" | "undo" | "redo" | "update";
  tool: Tool;
  data: any;
  userId: string;
  roomId: string;
  shapeId: string;
};

export type ClientEventMessage = {
  roomId: string;
  userId: string;
};

export type ServerEventMessage = {
  type: "client_event" | "draw_event";
  data: any;
};

export type ClientSocketMessage = {
  type: "join" | "draw";
  data: DrawEventMessage | ClientEventMessage;
};

export class WebSocketService {
  private ws: WebSocket;
  private userId: string;
  private roomId: string;

  constructor(url: string, userId: string, roomId: string) {
    this.ws = this.connect(url);
    this.userId = userId;
    this.roomId = roomId;
  }

  private connect(url: string): WebSocket {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      const joinMsg: ClientSocketMessage = {
        type: "join",
        data: {
          userId: this.userId,
          roomId: this.roomId,
        },
      };

      ws.send(JSON.stringify(joinMsg));
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return ws;
  }

  sendDrawEvent(tool: Tool, data: any, shapeId: string, roomId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const drawData: DrawEventMessage = {
        event: "draw",
        tool,
        data,
        userId: this.userId,
        roomId,
        shapeId,
      };

      const msg: ClientSocketMessage = {
        type: "draw",
        data: drawData,
      };

      this.ws.send(JSON.stringify(msg));
    }
  }

  sendUpdateEvent(tool: Tool, data: any, shapeId: string, roomId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const drawData: DrawEventMessage = {
        event: "update",
        tool,
        data,
        userId: this.userId,
        roomId,
        shapeId,
      };

      const msg: ClientSocketMessage = {
        type: "draw",
        data: drawData,
      };

      this.ws.send(JSON.stringify(msg));
    }
  }

  sendUndoEvent(data: any, tool: Tool, shapeId: string, roomId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const drawData: DrawEventMessage = {
        event: "undo",
        tool,
        data,
        userId: this.userId,
        roomId,
        shapeId,
      };

      const msg: ClientSocketMessage = {
        type: "draw",
        data: drawData,
      };

      this.ws.send(JSON.stringify(msg));
    }
  }

  sendRedoEvent(data: any, tool: Tool, shapeId: string, roomId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const drawData: DrawEventMessage = {
        event: "redo",
        tool,
        data,
        userId: this.userId,
        roomId,
        shapeId,
      };

      const msg: ClientSocketMessage = {
        type: "draw",
        data: drawData,
      };

      this.ws.send(JSON.stringify(msg));
    }
  }

  onServerEvent(callback: (message: ServerEventMessage) => void) {
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerEventMessage;
      // check if message is for client events or draw events

      if (message.type === "client_event") {
        // handle client events
        callback(message);
      } else if (message.type === "draw_event") {
        if (message.data.userId != this.userId) {
          callback(message);
        }
      }
    };
  }
}

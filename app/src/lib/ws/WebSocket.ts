/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tool } from "../store/canvas";

export type WebSocketMessage = {
  type: "draw" | "clear" | "undo" | "redo" | "update";
  tool: Tool;
  data: any;
  userId: string;
  shapeId: string;
};

export class WebSocketService {
  private ws: WebSocket;
  private userId: string;

  constructor(url: string, userId: string) {
    this.ws = this.connect(url);
    this.userId = userId;
  }

  private connect(url: string): WebSocket {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return ws;
  }

  sendDrawEvent(tool: Tool, data: any, shapeId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "draw",
        tool,
        data,
        userId: this.userId,
        shapeId,
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  sendUpdateEvent(tool: Tool, data: any, shapeId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "update",
        tool,
        data,
        userId: this.userId,
        shapeId,
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  sendUndoEvent(data: any, tool: Tool, shapeId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "undo",
        tool,
        data,
        userId: this.userId,
        shapeId,
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  sendRedoEvent(data: any, tool: Tool, shapeId: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "redo",
        tool,
        data,
        userId: this.userId,
        shapeId,
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  onDrawEvent(callback: (message: WebSocketMessage) => void) {
    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(
        event.data
      ) as WebSocketMessage;
      if (message.userId != this.userId) {
        callback(message);
      }
    };
  }
}

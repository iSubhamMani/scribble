import { WebSocket } from "ws";

export interface Client {
  userId: string;
  ws: WebSocket;
}

import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import { Client } from "./models/Client";
import { ClientEventMessage } from "./models/ClientEventMessage";
import { DrawEventMessage } from "./models/DrawEventMessage";

const app = express();
const httpPort = process.env.PORT || 8000;
const rooms: Map<string, Client[]> = new Map();

const httpServer = app.listen(httpPort, () => {
  console.log("HTTP Server is running on port " + httpPort);
});

const wss = new WebSocketServer({ server: httpServer });

const handleRoomJoin = (room: string, userId: string, ws: WebSocket) => {
  if (rooms.has(room)) {
    const clients = rooms.get(room);
    const client = clients?.find((client) => client.userId === userId);

    if (client) {
      const msg = new ClientEventMessage({
        event: "error",
        data: "Already connected to the server",
      });
      ws.send(JSON.stringify(msg));
    } else {
      const msg = new ClientEventMessage({
        event: "success",
        data: "Connected to the server",
      });
      clients?.push({ userId, ws });
      ws.send(JSON.stringify(msg));
    }
  } else {
    rooms.set(room, [{ userId, ws }]);
    const msg = new ClientEventMessage({
      event: "success",
      data: "Connected to the server",
    });
    ws.send(JSON.stringify(msg));
  }
};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const dataFromClient = JSON.parse(message.toString());

    if (dataFromClient.type === "join") {
      const { data } = dataFromClient;
      handleRoomJoin(data.roomId, data.userId, ws);
    } else if (dataFromClient.type === "draw") {
      const { data } = dataFromClient;
      // broadcast the message to all other clients in the room
      const clients = rooms.get(data.roomId);
      const existInRoom = clients?.find((c) => c.userId === data.userId);

      if (clients && existInRoom) {
        clients.forEach((client) => {
          if (client.ws !== ws && client.ws.readyState === ws.OPEN) {
            const msg = new DrawEventMessage(data);
            client.ws.send(JSON.stringify(msg));
          }
        });
      }
    }
  });

  ws.on("close", () => {
    rooms.forEach((clients, roomId) => {
      // Filter out the disconnected client
      const updatedClients = clients.filter((client) => client.ws !== ws);

      // Update the map with the filtered list
      if (updatedClients.length > 0) {
        rooms.set(roomId, updatedClients);
      } else {
        // Remove the room entirely if no clients are left
        rooms.delete(roomId);
      }
    });
  });
});

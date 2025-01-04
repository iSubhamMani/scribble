import { WebSocketServer, WebSocket } from "ws";
import express from "express";

const app = express();
const httpPort = process.env.PORT || 8000;

const httpServer = app.listen(httpPort, () => {
  console.log("HTTP Server is running on port " + httpPort);
});

const wss = new WebSocketServer({ server: httpServer });
const clients: Set<WebSocket> = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("message", (message) => {
    // Broadcast the message to all other clients
    const data = JSON.parse(message.toString());
    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

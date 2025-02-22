import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import socket from "socket.io";
import { ServerState, User } from "../types/index"

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer();
const io = new socket.Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

// TODO: Add states

// All the connected users to the socket server
const connectedClients = new Set();

const serverState = new ServerState();

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  connectedClients.add(socket.id);

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    // Broadcast the message to all connected clients

    io.emit("messageReceived", { id: socket.id, message });
  });

  socket.on("createUser", (username) => {
    console.log("Creating user for current socket");

    // Initialize user
    const user: User = {
      coordinate: [0, 0],
      username: username,
      avatar: "lol"
    }

    serverState.

    io.emit("createdUser", user);
  });

  socket.on("moveUser", (username,  ) => {
    console.log("Moving user", username);
  })

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    connectedClients.delete(socket.id);

    io.emit("clientCount", connectedClients.size);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
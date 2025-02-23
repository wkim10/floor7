import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import socket from "socket.io";
import { ServerState } from "../types/index";

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
// const connectedClients = new Set();

const serverState = new ServerState();

io.on("connection", (socket: socket.Socket) => {
  console.log("A client connected:", socket.id);
  socket.emit("serverStateUpdate", serverState);

  // Handle incoming messages
  socket.on("sendMessage", (message: string) => {
    console.log("Message received:", message);
    io.emit("serverStateUpdate", serverState);
  });

  // Create user from frontend
  socket.on("createUser", (username: string, avatar: string) => {
    console.log("Creating user for current socket: ", socket.id);

    serverState.addUser(username, avatar, socket);
    const user = serverState.connections[socket.id];
    console.log(serverState.map[user.coordinate[0]][user.coordinate[1]]);

    io.emit("serverStateUpdate", serverState);
  });

  // Handle client disconnect e.g. log out
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    serverState.removeUser(socket);
    io.emit("serverStateUpdate", serverState);
  });

  // Handle movement
  socket.on("moveUser", (deltas: [number, number]) => {
    const user = serverState.connections[socket.id];
    if (!user) return;
    // TODO: If user not found?

    serverState.moveUser(
      user.coordinate[0] + deltas[1],
      user.coordinate[1] + deltas[0],
      socket
    );

    const tile = serverState.map[user.coordinate[0]][user.coordinate[1]][0];
    if (
      tile.type === "chair" &&
      !serverState.checkChairOccupied(user.coordinate[0], user.coordinate[1])
    ) {
      console.log("Not occupied");
      io.emit("showJoinModal", socket.id);
    } else if (
      tile.type === "chair" &&
      serverState.checkChairOccupied(user.coordinate[0], user.coordinate[1])
    ) {
      io.emit("showOccupiedModal", socket.id);
    }

    io.emit("serverStateUpdate", serverState);
  });

  socket.on("joinConvo", () => {
    const user = serverState.connections[socket["id"]];
    const tile = serverState.map[user.coordinate[0]][user.coordinate[1]][0];
    if (
      tile.type === "chair" &&
      !serverState.checkChairOccupied(user.coordinate[0], user.coordinate[1])
    ) {
      serverState.joinConvo(tile.id, user.username, socket.id);
      console.log("serverState in joinConvo", serverState);
      io.emit("serverStateUpdate", serverState);

      // If there are both users that have joined the convo, show WebRTC video streaming
      if (
        serverState.conversations[tile.id].user1 &&
        serverState.conversations[tile.id].user2
      ) {
        io.emit("startConvo", {
          newServerState: serverState,
          convoId: tile.id,
          conversation: serverState.conversations[tile.id], // Add this
        });
      }
    }
  });
  socket.on("sendMessage", (data: { message: string; userId: string }) => {
    // Broadcast the message to all clients including sender
    const user = serverState.connections[socket["id"]];
    io.emit("receiveMessage", {
      message: data.message,
      username: user.username,
      timestamp: Date.now(),
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

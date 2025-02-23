import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import socket from "socket.io";
import { ServerState, User } from "../types/index";

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
  socket.on("createUser", (username: string) => {
    console.log("Creating user for current socket: ", socket.id);

    serverState.addUser(username, socket);
    io.emit("serverStateUpdate", serverState);
  });

  // Handle client disconnect e.g. log out
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    serverState.removeUser(socket);
    io.emit("serverStateUpdate", serverState);
  });

  // Handle movement
  socket.on(
    "moveUser",
    (socket: socket.Socket, coordinates: [number, number]) => {
      const user = serverState.connections[socket.id];
      // TODO: If user not found?

      console.log("User has moved: ", user);
      serverState.moveUser(socket.id, coordinates[0], coordinates[1]);

      io.emit("serverStateUpdate", serverState);
    }
  );
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

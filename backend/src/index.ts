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

    // If booth, show booth modal
    if (tile.type === "booth") {
      io.emit("showBoothModal", {
        socketId: socket.id,
        companyName: tile.companyName,
      });
    }

    // If tile is empty, hide the booth and join modals
    if (tile.type === "empty") {
      console.log("Empty tile, hide modals");
      io.emit("hideBoothModal", {
        socketId: socket.id,
      });
      io.emit("hideJoinModal", socket.id);
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
    // Get user from connections using the received userId (socket.id)
    const user = serverState.connections[data.userId];
    if (!user) return;

    // Broadcast to all clients including sender
    io.emit("receiveMessage", {
      message: data.message,
      username: user.username,
      timestamp: Date.now(),
    });
  });
  socket.on("offer", ({ from, to, offer }) => {
    console.log("Offer received, emitting to clients", from, to);
    io.to(to).emit("offer", {
      from,
      to,
      offer,
    });
  });
  socket.on("answer", ({ from, to, answer }) => {
    console.log("Answer received, emitting to clients", from, to);
    io.to(to).emit("answer", {
      from,
      to,
      answer,
    });
  });
  socket.on("iceCandidate", ({ from, to, iceCandidate }) => {
    console.log(
      "Ice candidate received on backend, emitting to clients from",
      from,
      "to",
      to,
      "iceCandidate",
      iceCandidate
    );
    io.to(to).emit("iceCandidate", {
      from,
      to,
      iceCandidate,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

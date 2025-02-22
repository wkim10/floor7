import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import socket from "socket.io";

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer();
const io = new socket.Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

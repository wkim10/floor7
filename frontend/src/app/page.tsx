"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io";
import { ServerState } from "@backend";

type UserId = string;

type ConversationId = string;

export interface User {
  coordinate: [number, number];
  avatar: any; // nani?
  username: string;
  // todo: Biography / resume?
  // todo: Proximity ID
}

// interface Connection {
//   socket: socket.Socket;
//   user?: User;
// }

interface Conversation {
  user1: UserId;
  user2: UserId;
  messages: { timestamp: number; message: string }[]; // unix timestamp
}

class ServerState {
  public connections: Record<Socket["id"], User> = {};
  public conversations: Record<ConversationId, Conversation> = {};
  // private users: Record<Socket["id"], User> = {}; // TODO: Check for race conditions

  constructor() {
    this.connections = {};
    this.conversations = {};
    // this.users = {};
  }

  // Code to add user
  public addUser(username: string, socket: Socket) {
    // Assume they start at 50, 50
    const spawnX = 50;
    const spawnY = 50;

    const user: User = {
      coordinate: [spawnX, spawnY],
      avatar: "avatar", // TODO: Get avatar
      username: username,
    };

    this.connections[socket.id] = user;
  }

  // e.g. For when they log out
  public removeUser(socket: Socket) {
    if (!this.connections[socket.id]) return;

    delete this.connections[socket.id];
  }

  // Code to move user
  public moveUser(socketId: Socket["id"], x: number, y: number) {
    this.connections[socketId].coordinate[0] = x;
    this.connections[socketId].coordinate[1] = y;
  }
}

const socket = io("http://localhost:8000");

const SocketDemo = () => {
  const [username, setUsername] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [serverState, setServerState] = useState<ServerState>(
    new ServerState()
  );

  useEffect(() => {
    // Connection status
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("serverStateUpdate", (serverState: ServerState) => {
      setServerState(serverState);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("serverStateUpdate");
    };
  }, []);

  // Creates user
  const createUser = (e: any) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit("createUser", username);
      setUsername("");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-lg font-bold">
          Status:{" "}
          {connected ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <span className="text-red-600">Disconnected</span>
          )}
        </div>
      </div>

      <form onSubmit={createUser} className="mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded mr-2"
          placeholder="Choose a username"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create user
        </button>
      </form>
    </div>
  );
};

export default SocketDemo;

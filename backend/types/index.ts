import socket, { Socket } from "socket.io";

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

export class ServerState {
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

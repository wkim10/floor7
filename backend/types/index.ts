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

interface Connection {
  socket: socket.Socket;
  user?: User;
}

interface Conversation {
  user1: UserId;
  user2: UserId;
  messages: { timestamp: number; message: string }[]; // unix timestamp
}

export class ServerState {
  public connections: Record<Socket["id"], UserId> = {};
  public conversations: Record<ConversationId, Conversation> = {};
  private users: Record<Socket["id"], User> = {}; // TODO: Check for race conditions

  constructor() {
    this.connections = {};
    this.conversations = {};
    this.users = {};
  }

  // Code to move player
  public addPlayer(user: User) {
    this.removePlayer(ui)  }
  
  public removePlayer(user: User) {
    this.users.
  }
  
  public movePlayer(uid: string, x: number, y: number) {
    this.users[uid].coordinate[0] = x;
    this.users[uid].coordinate[1] = y;

    return this.users;
  }
}

import socket, { Socket } from "socket.io";

type UserId = string;
type ConversationId = string;

export interface User {
  coordinate: [number, number];
  avatar: any;
  username: string;
}

interface Conversation {
  user1: UserId;
  user2: UserId;
  messages: { timestamp: number; message: string }[];
}

export class ServerState {
  public connections: Record<Socket["id"], User> = {};
  public conversations: Record<ConversationId, Conversation> = {};
  public proximityMap: Record<Socket["id"], [Socket["id"]]> = {};
  public map: User[][][] = [[[]]];

  constructor() {
    this.connections = {};
    this.conversations = {};
    // Create empty arrays for each position in the map
    this.map = Array.from({ length: 20 }, () =>
      Array.from({ length: 20 }, () => [])
    );
    this.proximityMap = {};
  }

  public addUser(username: string, socket: Socket) {
    const spawnX = 0;
    const spawnY = 0;
    const user: User = {
      coordinate: [spawnX, spawnY],
      avatar: "avatar",
      username: username,
    };
    this.connections[socket.id] = user;
    this.map[spawnX][spawnY].push(user);
  }

  public removeUser(socket: Socket) {
    const user = this.connections[socket.id];
    if (!user) return;

    // Remove user from the map before deleting from connections
    const [x, y] = user.coordinate;
    this.map[x][y] = this.map[x][y].filter((u) => u !== user);
    delete this.connections[socket.id];
  }

  public moveUser(r: number, c: number, socket: Socket) {
    const user = this.connections[socket.id];
    if (!user) return;

    // Bounds checking
    if (r < 0 || r >= this.map.length || c < 0 || c >= this.map[0].length) {
      return;
    }

    const [prevX, prevY] = user.coordinate;

    // Remove from old position
    this.map[prevX][prevY] = this.map[prevX][prevY].filter((u) => u !== user);

    // Update coordinates
    user.coordinate = [r, c];

    // Add to new position
    this.map[r][c].push(user);
  }
}

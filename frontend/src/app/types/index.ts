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
  public proximityMap: Record<Socket["id"], Socket["id"][]> = {};
  public map: [Socket["id"], User][][][] = [[[]]];
  // 2d map where each tile has a list of [socketId, User] pairs

  constructor() {
    this.connections = {};
    this.conversations = {};
    // Create empty arrays for each position in the map
    this.map = Array.from({ length: 21 }, () =>
      Array.from({ length: 21 }, () => [])
    );
    this.proximityMap = {};
  }

  public addUser(username: string, avatar: string, socket: Socket) {
    const spawnX = 14;
    const spawnY = 10;
    const user: User = {
      coordinate: [spawnX, spawnY],
      avatar,
      username: username,
    };
    this.connections[socket.id] = user;
    this.map[spawnX][spawnY].push([socket.id, user]);
  }

  public removeUser(socket: Socket) {
    const user = this.connections[socket.id];
    if (!user) return;

    // Remove user from the map before deleting from connections
    const [x, y] = user.coordinate;
    this.map[x][y] = this.map[x][y].filter(
      ([socketId, _]) => socketId !== socket.id
    );
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
    this.map[prevX][prevY] = this.map[prevX][prevY].filter(
      ([socketId, _]) => socketId !== socket.id
    );

    // Update coordinates
    user.coordinate = [r, c];

    // Add to new position
    this.map[r][c].push([socket.id, user]);

    // Get current proximity users of the current user
    const oldProximityUsers: Socket["id"][] =
      this.proximityMap[socket.id] || [];

    // Get new proximity users given the user's most updated coords
    const newProximityUsers: Socket["id"][] = this.getProximityUsers(
      socket,
      user
    );

    // Check for users that are no longer in proxmity
    const usersNoLongerInProximity = oldProximityUsers.filter(
      (oldId) => !newProximityUsers.includes(oldId)
    );

    // Update all the users no longer in
    usersNoLongerInProximity.forEach((proximityUser) => {
      if (proximityUser) {
        this.proximityMap[proximityUser] = this.proximityMap[
          proximityUser
        ].filter((proximityUserId) => proximityUserId != socket.id);
      }
    });

    // Set the new proximity users, possible race?
    this.proximityMap[socket.id] = newProximityUsers;

    newProximityUsers.forEach((proximityUser) => {
      if (proximityUser) {
        if (!this.proximityMap[proximityUser]) {
          this.proximityMap[proximityUser] = [];
        } else if (!this.proximityMap[proximityUser].includes(socket.id)) {
          this.proximityMap[proximityUser].push(socket.id);
        }
      }
    });
  }

  private getProximityUsers(socket: Socket, user: User): Socket["id"][] {
    const socketIds: Socket["id"][] = [];
    const [x, y] = user.coordinate;

    // Check a 5x5 area centered on the user
    // This means we check 2 tiles in each direction
    for (let i = x - 2; i <= x + 2; i++) {
      for (let j = y - 2; j <= y + 2; j++) {
        // Skip if outside map bounds
        if (i < 0 || i >= this.map.length || j < 0 || j >= this.map[0].length) {
          continue;
        }

        // Skip the user's own tile
        if (i === x && j === y) {
          continue;
        }

        // Add any users found in this tile
        const usersInTile = this.map[i][j].map((pair) => pair[0]); // Array of socketIds
        socketIds.push(...usersInTile);
      }
    }

    return socketIds;
  }
}

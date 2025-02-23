import socket, { Socket } from "socket.io";
import fs from "fs";
import path from "path";

type UserId = string;
type ConversationId = string;

export interface User {
  coordinate: [number, number];
  avatar: any;
  username: string;
}

// interface Conversation {
//   user1?: UserId;
//   user2?: UserId;
//   // messages: { timestamp: number; message: string }[];
//   timestamp?: number;
// }

interface Conversation {
  user1: string | null; // socketId or null
  user2: string | null; // socketId or null
  timestamp: number | null;
}

export enum TileType {
  table = "table",
  booth = "booth",
  chair = "chair",
  user = "user",
  empty = "empty",
}

interface TileItem {
  type: TileType;
  id: string;
  // will be used as conversationId for booths/tables because users cannot move
  companyName?: string;
  userId?: string;
}

export class ServerState {
  public connections: Record<Socket["id"], User> = {};
  public conversations: Record<ConversationId, Conversation> = {};
  public proximityMap: Record<Socket["id"], Socket["id"][]> = {};
  public map: TileItem[][][] = [[[]]];

  constructor() {
    this.connections = {};
    this.conversations = {};
    this.proximityMap = {};

    // Initialize map with the chairs, tables, booths
    try {
      // Read the map configuration from JSON file
      const mapData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "defaultMap.json"), "utf8")
      );

      // Initialize the map where each cell contains an array of TileItems
      this.map = mapData.map((row: TileItem[]) =>
        row.map((tile: TileItem) => [tile])
      );

      // Initialize fixed conversation mappings
      this.initializeConversationMappings();

      console.log(
        `Map loaded successfully. Dimensions: ${this.map.length}x${this.map[0].length}`
      );

      console.log(`Conversations loaded. Conversations: ${this.conversations}`);
    } catch (error) {
      console.error("Error loading map configuration:", error);
      this.map = Array.from({ length: 21 }, () =>
        Array.from({ length: 21 }, () => [
          {
            type: TileType.empty,
            id: "",
          },
        ])
      );
    }
  }

  private initializeConversationMappings() {
    // Scan through the map to find all chairs and booths
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        const tileItems = this.map[row][col];
        for (const tile of tileItems) {
          if (
            (tile.type === TileType.chair || tile.type === TileType.booth) &&
            tile.id
          ) {
            // Only initialize if we haven't seen this ID before
            if (!this.conversations[tile.id]) {
              this.conversations[tile.id] = {
                user1: null,
                user2: null,
                timestamp: null,
              };
            }
          }
        }
      }
    }
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

    // Add user to the map as a new tile item in the array
    this.map[spawnX][spawnY].push({
      type: TileType.user,
      id: socket.id,
    });
  }

  public removeUser(socket: Socket) {
    const user = this.connections[socket.id];
    if (!user) return;

    // Remove user from the map before deleting from connections
    const [x, y] = user.coordinate;
    this.map[x][y] = this.map[x][y].filter(
      (tileItem) =>
        !(tileItem.type === TileType.user && tileItem.id === socket.id)
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

    // Check if the target tile has a booth, table, or chair
    const hasObstacle = this.map[r][c].some(
      (tileItem) => tileItem.type === TileType.table
    );

    if (hasObstacle || this.checkChairOccupied(r, c)) {
      return; // Cannot move to tiles with obstacles
    }

    const [prevX, prevY] = user.coordinate;

    // Remove from old position
    this.map[prevX][prevY] = this.map[prevX][prevY].filter(
      (tileItem) =>
        !(tileItem.type === TileType.user && tileItem.id === socket.id)
    );

    // Update coordinates
    user.coordinate = [r, c];

    // Add to new position
    this.map[r][c].push({
      type: TileType.user,
      id: socket.id,
    });

    // Update proximity
    this.updateProximity(socket, user);
  }

  public checkChairOccupied(r: number, c: number) {
    if (this.map[r][c].length === 0) {
      return false;
    }
    const chair = this.map[r][c][0];
    if (chair.type !== TileType.chair) {
      return false;
    }
    const conversation = this.conversations[chair.id];

    const users = this.map[r][c].filter((tile) => tile.type === TileType.user);
    const usernames = users.map((user) => this.connections[user.id].username);

    return (
      conversation.user1 !== null && usernames.includes(conversation.user1)
    );
  }

  private updateProximity(socket: Socket, user: User) {
    const oldProximityUsers = this.proximityMap[socket.id] || [];
    const newProximityUsers = this.getProximityUsers(socket, user);

    // Update users no longer in proximity
    const usersNoLongerInProximity = oldProximityUsers.filter(
      (oldId) => !newProximityUsers.includes(oldId)
    );

    usersNoLongerInProximity.forEach((proximityUser) => {
      if (proximityUser) {
        this.proximityMap[proximityUser] = this.proximityMap[
          proximityUser
        ].filter((proximityUserId) => proximityUserId !== socket.id);
      }
    });

    // Update new proximity users
    this.proximityMap[socket.id] = newProximityUsers;
    newProximityUsers.forEach((proximityUser) => {
      if (proximityUser) {
        if (!this.proximityMap[proximityUser]) {
          this.proximityMap[proximityUser] = [];
        }
        if (!this.proximityMap[proximityUser].includes(socket.id)) {
          this.proximityMap[proximityUser].push(socket.id);
        }
      }
    });
  }

  private getProximityUsers(socket: Socket, user: User): Socket["id"][] {
    const socketIds: Socket["id"][] = [];
    const [x, y] = user.coordinate;

    // Check a 5x5 area centered on the user
    for (let i = x - 2; i <= x + 2; i++) {
      for (let j = y - 2; j <= y + 2; j++) {
        if (i < 0 || i >= this.map.length || j < 0 || j >= this.map[0].length) {
          continue;
        }
        if (i === x && j === y) {
          continue;
        }

        // Look for users in this tile
        const userTiles = this.map[i][j].filter(
          (tile) => tile.type === TileType.user
        );
        socketIds.push(...userTiles.map((tile) => tile.id));
      }
    }

    return socketIds;
  }

  public joinConvo(convoId: string, username: string, socketId: string) {
    const user = this.connections[socketId];
    if (!user) return;

    const convo = this.conversations[convoId];
    if (!convo) return;

    if (convo.user1 === null) {
      convo.user1 = username;
    } else if (convo.user2 === null) {
      convo.user2 = username;
    }

    // Start convo since both users are here
    if (convo.user1 && convo.user2) {
      convo.timestamp = Date.now();
    }

    // this.conversations[convoId] = convo;
  }
}

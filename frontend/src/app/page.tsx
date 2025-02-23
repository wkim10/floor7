"use client";

import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { ServerState, User } from "./types/index";
import useAppStore from "@/store";

export const socket = io("http://localhost:8000");

const SocketDemo = () => {
  const {
    username,
    setUsername,
    connected,
    setConnected,
    serverState,
    setServerState,
  } = useAppStore();

  const id = socket["id"];
  console.log(id);
  const tileSizeInPixels: number = 40;

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

    socket.on("serverStateUpdate", (newServerState: ServerState) => {
      console.log("serverState updated", newServerState);
      // console.log("first tile", newServerState.map[0][0]);
      setServerState(newServerState);
    });

    socket.on("moveToTile", (x: number, y: number) => {});

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("serverStateUpdate");
    };
  }, [serverState, setServerState, setConnected]);

  useEffect(() => {
    // Move user around
    const moveUser = (event: KeyboardEvent) => {
      const movementDeltas = { x: 0, y: 0 };

      if (event.key === "ArrowUp" || event.key === "w") {
        movementDeltas.y -= 1;
      } else if (event.key === "ArrowDown" || event.key === "s") {
        movementDeltas.y += 1;
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        movementDeltas.x -= 1;
      } else if (event.key === "ArrowRight" || event.key === "d") {
        movementDeltas.x += 1;
      }

      socket.emit("moveUser", [movementDeltas.x, movementDeltas.y]);
    };
    document.addEventListener("keydown", moveUser);
    return () => document.removeEventListener("keydown", moveUser);
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
    <div className="h-full w-full p-4 flex flex-col bg-white text-black gap-y-8">
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

      <div>
        {Object.values(serverState.connections).map((user: User, index) => {
          return (
            <div key={index}>
              <p
                style={{
                  position: "absolute",
                  left: user.coordinate[0],
                  top: user.coordinate[1],
                  transition: "0.1s ease",
                }}
              >
                {user.username}
              </p>
              <p key={user.username}>
                x: {user.coordinate[0]}, y: {user.coordinate[1]}
              </p>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${serverState.map.length}, ${40}px)`,
          gridTemplateRows: `repeat(${serverState.map[0].length}, ${40}px)`,
          gap: "0px",
        }}
      >
        {serverState.map.map((block, rowIndex) =>
          block.map((users, colIndex) => {
            const tileKey = `${rowIndex}-${colIndex}`;
            return (
              <div
                key={tileKey}
                style={{
                  width: tileSizeInPixels,
                  height: tileSizeInPixels,
                  backgroundColor: `${
                    users.length > 0
                      ? users.length > 1
                        ? "purple"
                        : "red"
                      : "lightblue"
                  }`,
                  border: "1px solid black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {users.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      padding: "2px 4px",
                      borderRadius: "4px",
                    }}
                  >
                    {users.map((user) => user.username).join(", ")}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SocketDemo;

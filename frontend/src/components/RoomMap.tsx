"use client";

import React, { useEffect } from "react";
import { ServerState } from "@/app/types";
import useAppStore from "@/store";
import Video from "@/components/video";
import { socket } from "@/app/page";
import Image from "next/image";

export const RoomMap = () => {
  const { username, setUsername, connected, setConnected, serverState, setServerState } =
    useAppStore();

  // const tileSizeInPixels: number = 24;

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

      if (event.key === "w") {
        movementDeltas.y -= 1;
      } else if (event.key === "s") {
        movementDeltas.y += 1;
      } else if (event.key === "a") {
        movementDeltas.x -= 1;
      } else if (event.key === "d") {
        movementDeltas.x += 1;
      }

      socket.emit("moveUser", [movementDeltas.x, movementDeltas.y]);
    };
    document.addEventListener("keydown", moveUser);
    return () => document.removeEventListener("keydown", moveUser);
  }, []);

  const user = serverState.connections[socket.id ?? ""];
  if (!user) {
    return;
  }

  return (
    <div className="h-full w-full p-4 flex flex-col bg-white text-black gap-y-8 mt-24">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${serverState.map.length}, ${32}px)`,
          gridTemplateRows: `repeat(${serverState.map[0].length}, ${32}px)`,
          gap: "0px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {serverState.map.map((block, rowIndex) =>
          block.map((users, colIndex) => {
            const tileKey = `${rowIndex}-${colIndex}`;
            return (
              <div key={tileKey + colIndex} className="relative border border-black/5 w-full h-full">
                {/* Find all users at this coordinate */}
                {Object.values(serverState.connections).map((mappedUser) => {
                  if (
                    mappedUser.coordinate[0] === rowIndex &&
                    mappedUser.coordinate[1] === colIndex
                  ) {
                    return (
                      <div key={mappedUser.username} className="absolute top-0 left-0">
                        <Image
                          alt={`${tileKey}-${mappedUser.username}`}
                          src={`/images/avatar${parseInt(mappedUser.avatar)}.png`}
                          width={32}
                          height={32}
                        />
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white/80 px-2 py-1 rounded">
                          {mappedUser.username}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          })
        )}
      </div>
      <Video />
    </div>
  );
};

export default RoomMap;

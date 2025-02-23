"use client";

import React, { useEffect, useState } from "react";
import { ServerState } from "@/app/types";
import useAppStore from "@/store";
import Video from "@/components/video";
import { socket } from "@/app/page";
import Image from "next/image";
import defaultMap from "@/utils/defaultMap.json";

export const RoomMap = () => {
  const {
    username,
    setUsername,
    connected,
    setConnected,
    serverState,
    setServerState,
  } = useAppStore();

  const [showJoinChatModal, setShowJoinChatModal] = useState<boolean>(false);
  const [showOccupiedModal, setShowOccupiedModal] = useState<boolean>(false);
  const [showWebRTCModal, setShowWebRTCModal] = useState<boolean>(false);
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

    socket.on("showJoinModal", (socketId) => {
      if (socketId === socket.id) {
        setShowJoinChatModal(true);
      }
    });

    socket.on("showOccupiedModal", (socketId) => {
      if (socketId === socket.id) {
        setShowOccupiedModal(true);
      }
    });

    socket.on("startConvo", ({ newServerState, convoId, conversation }) => {
      console.log(newServerState, convoId, conversation);
      if (socket.id != undefined) {
        console.log("socketid found but connections", newServerState.connections);
        const username = newServerState.connections[socket.id].username;
        if (
          username === conversation.user1 ||
          username === conversation.user2
        ) {
          console.log("Start convo", convoId, conversation);
          setShowWebRTCModal(true);
        }
      } else {
        console.log("socketid not foun in startConvo");
      }
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

  const joinConversation = () => {
    // Backend will handle updating conversation mapping
    socket.emit("joinConvo");
    setShowJoinChatModal(false);
  };

  return (
    <div className="h-full w-full p-4 flex flex-col bg-white text-black gap-y-8 mt-24">
      {showJoinChatModal && (
        <div className="bg-white absolute left-50 top-50">
          <div>Join chat?</div>
          <div onClick={() => joinConversation()}>Join</div>
          <div onClick={() => setShowJoinChatModal(false)}>Decline</div>
        </div>
      )}
      {showOccupiedModal && (
        <div className="bg-white absolute left-50 top-50">
          <div>Seat occupied!</div>
        </div>
      )}
      {showWebRTCModal && (
        <div className="bg-red absolute left-50 top-50">You've joined!</div>
      )}
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
          block.map((tileItems, colIndex) => {
            const tileKey = `${rowIndex}-${colIndex}`;
            return (
              <div
                key={tileKey + colIndex}
                className="relative border border-black/5 w-full h-full"
              >
                {/* Render static tiles (booth, chair, table) first */}
                {tileItems.map((tileItem, index) => {
                  if (tileItem.type === "booth") {
                    return (
                      <div
                        key={`booth-${tileItem.id}`}
                        className="absolute top-0 left-0 h-full w-full bg-red-400"
                      />
                    );
                  } else if (tileItem.type === "chair") {
                    return (
                      <div
                        key={`chair-${tileItem.id}`}
                        className="absolute top-0 left-0 h-full w-full rounded-[9999px] bg-slate-400"
                      />
                    );
                  } else if (tileItem.type === "table") {
                    return (
                      <div
                        key={`table-${tileItem.id}`}
                        className="absolute top-0 left-0 h-full w-full bg-blue-400"
                      />
                    );
                  }
                  return null;
                })}

                {/* Render users on top of static tiles */}
                {Object.values(serverState.connections).map((mappedUser) => {
                  if (
                    mappedUser.coordinate[0] === rowIndex &&
                    mappedUser.coordinate[1] === colIndex
                  ) {
                    return (
                      <div key={mappedUser.username} className="absolute z-10 top-0 left-0">
                        <Image
                          alt={`${tileKey}-${mappedUser.username}`}
                          src={`/images/avatar${parseInt(
                            mappedUser.avatar
                          )}.png`}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white/80 px-2 py-1 rounded">
                          {mappedUser.username}
                        </div>
                      </div>
                    );
                  } else if (defaultMap[rowIndex][colIndex].type === "booth") {
                    return (
                      <div
                        key={mappedUser.username}
                        className="absolute top-0 left-0 h-full w-full bg-red-400"
                      />
                    );
                  } else if (defaultMap[rowIndex][colIndex].type === "chair") {
                    return (
                      <div
                        key={mappedUser.username}
                        className="absolute top-0 left-0 h-full w-full rounded-lg bg-slate-400"
                      />
                    );
                  } else if (defaultMap[rowIndex][colIndex].type === "table") {
                    return (
                      <div
                        key={mappedUser.username}
                        className="absolute top-0 left-0 h-full w-full bg-blue-400"
                      />
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

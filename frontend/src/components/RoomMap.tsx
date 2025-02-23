"use client";

import React, { useEffect, useState } from "react";
import { ServerState } from "@/app/types";
import useAppStore from "@/store";
import Video from "@/components/video";
import { socket } from "@/app/intro/page";
import Image from "next/image";
import defaultMap from "@/utils/defaultMap.json";
import Apple from "./AppleBooth";
import MathWorks from "./MathWorksBooth";
import Epic from "./EpicBooth";
import Nvidia from "./NvidiaBooth";
import Meta from "./MetaBooth";
import Spotify from "./SpotifyBooth";
import Conversation from "./Conversation";

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
  // const [showOccupiedModal, setShowOccupiedModal] = useState<boolean>(false);
  // const [showWebRTCModal, setShowWebRTCModal] = useState<boolean>(false);

  // const tileSizeInPixels: number = 24;

  const [showSpotifyModal, setShowSpotifyModal] = React.useState(false);
  const [showAppleModal, setShowAppleModal] = React.useState(false);
  const [showMetaModal, setShowMetaModal] = React.useState(false);
  const [showEpicModal, setShowEpicModal] = React.useState(false);
  const [showMathWorksModal, setShowMathWorksModal] = React.useState(false);
  const [showNvidiaModal, setShowNvidiaModal] = React.useState(false);

  const [showConversation, setShowConversation] = React.useState(false);

  const [other, setOther] = useState<string>();

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

    // socket.on("showOccupiedModal", (socketId) => {
    //   if (socketId === socket.id) {
    //     setShowOccupiedModal(true);
    //   }
    // });

    socket.on("startConvo", ({ newServerState, convoId, conversation }) => {
      console.log(newServerState, convoId, conversation);
      if (socket.id != undefined) {
        const username = newServerState.connections[socket.id].username;
        if (
          username === conversation.user1 ||
          username === conversation.user2
        ) {
          const otherUsername =
            username === conversation.user1
              ? conversation.user2
              : conversation.user1;
          let otherSocketId = "";
          for (const key of Object.keys(newServerState.connections)) {
            if (newServerState.connections[key].username === otherUsername) {
              otherSocketId = key;
            }
          }
          if (username === conversation.user1) {
            setOther(otherSocketId);
          }

          setShowConversation(true);
        }
      } else {
        console.log("socketid not found in startConvo");
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
    <>
      {showJoinChatModal && (
        <div
          className="text-red absolute top-50 left-50"
          onClick={() => joinConversation()}
        >
          Join convo???
        </div>
      )}

      {showAppleModal ? <Apple setShowModal={setShowAppleModal} /> : null}
      {showMathWorksModal ? (
        <MathWorks setShowModal={setShowMathWorksModal} />
      ) : null}
      {showEpicModal ? <Epic setShowModal={setShowEpicModal} /> : null}
      {showNvidiaModal ? <Nvidia setShowModal={setShowNvidiaModal} /> : null}
      {showMetaModal ? <Meta setShowModal={setShowMetaModal} /> : null}
      {showSpotifyModal ? <Spotify setShowModal={setShowSpotifyModal} /> : null}
      {showConversation ? (
        <Conversation other={other} setShowModal={setShowConversation} />
      ) : null}
      <div className="h-full w-full p-4 flex flex-col bg-white text-black gap-y-8 mt-24">
        <div
          style={{
            display: "grid",
            // gridTemplateColumns: `repeat(${serverState.map.length}, ${32}px)`,
            // gridTemplateRows: `repeat(${serverState.map[0].length}, ${32}px)`,
            gridTemplateColumns: `repeat(${defaultMap.length}, ${32}px)`,
            gridTemplateRows: `repeat(${defaultMap[0].length}, ${32}px)`,
            gap: "0px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {serverState.map.map((block, rowIndex) =>
            block.map((users, colIndex) => {
              const tileKey = `${rowIndex}-${colIndex}`;
              const tileType = defaultMap[rowIndex][colIndex].type;
              const tileCompany = defaultMap[rowIndex][colIndex].companyName;
              const showName = defaultMap[rowIndex][colIndex].showName;

              return (
                <div
                  key={tileKey}
                  className="relative border border-black/5 w-full h-full"
                >
                  {/* Background color layer */}
                  <div
                    className={`absolute inset-0 ${
                      tileType === "booth"
                        ? tileCompany === "spotify"
                          ? "bg-[#1ED760]"
                          : tileCompany === "mathworks"
                          ? "bg-[#E43E04]"
                          : tileCompany === "apple"
                          ? "bg-[#B3B3B3]"
                          : tileCompany === "epic"
                          ? "bg-[#BE1E3F]"
                          : tileCompany === "nvidia"
                          ? "bg-[#76B900]"
                          : "bg-[#007EF7]"
                        : tileType === "chair"
                        ? "bg-slate-400 rounded-lg"
                        : tileType === "table"
                        ? "bg-blue-400"
                        : ""
                    }`}
                  />
                  {showName ? (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white/80 px-2 py-1 rounded">
                      {tileCompany}
                    </div>
                  ) : null}

                  {/* Avatar layer */}
                  {Object.values(serverState.connections).map((mappedUser) => {
                    if (
                      mappedUser.coordinate[0] === rowIndex &&
                      mappedUser.coordinate[1] === colIndex
                    ) {
                      return (
                        <div
                          key={mappedUser.username}
                          className="absolute z-10 top-0 left-0"
                        >
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
                    }
                    return null;
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default RoomMap;

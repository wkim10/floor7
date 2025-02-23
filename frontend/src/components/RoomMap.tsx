"use client";

import React, { useEffect, useState } from "react";
import { ServerState } from "@/app/types";
import useAppStore from "@/store";
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

interface ChatMessage {
  message: string;
  username: string; // Change from userId to username
  timestamp: number;
  isVisible: boolean;
}

export const RoomMap = () => {
  const {
    username,
    setUsername,
    connected,
    setConnected,
    setOther,
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

  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const MESSAGE_DURATION = 3000;

  useEffect(() => {
    socket.on("receiveMessage", ({ message, username, timestamp }) => {
      console.log("receiveMessage", message, username, timestamp);
      // Remove previous message from same user and add new one
      setMessages((prev) => [
        ...prev.filter((msg) => msg.username !== username),
        {
          message: message.replace(/^\//, ""), // Remove leading slash
          username,
          timestamp,
          isVisible: true,
        },
      ]);

      // First set to invisible after duration
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === timestamp ? { ...msg, isVisible: false } : msg
          )
        );
      }, MESSAGE_DURATION);

      // Then remove after animation
      setTimeout(() => {
        setMessages((prev) =>
          prev.filter((msg) => msg.timestamp !== timestamp)
        );
      }, MESSAGE_DURATION + 1000);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTyping) return; // Block movement while typing

      if (event.key === "/") {
        setIsChatVisible(true);
        setIsTyping(true); // Disable movement
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const processedMessage = chatMessage.replace(/^\//, "").trim();

        if (processedMessage) {
          const tempTimestamp = Date.now();
          setMessages((prev) => [
            ...prev.filter((msg) => msg.username !== user?.username),
            {
              message: processedMessage,
              username: user?.username || "",
              timestamp: tempTimestamp,
              isVisible: true,
              coordinates: user.coordinate,
            },
          ]);

          // Schedule visibility and removal
          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.timestamp === tempTimestamp
                  ? { ...msg, isVisible: false }
                  : msg
              )
            );
          }, MESSAGE_DURATION);

          setTimeout(() => {
            setMessages((prev) =>
              prev.filter((msg) => msg.timestamp !== tempTimestamp)
            );
          }, MESSAGE_DURATION + 1000);

          socket.emit("sendMessage", {
            message: processedMessage,
            userId: socket.id,
          });
        }

        setChatMessage("");
        setIsChatVisible(false);
        setIsTyping(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isChatVisible, chatMessage, isTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const renderUserWithMessage = (mappedUser: any) => (
    <div key={mappedUser.username} className="absolute z-10 top-0 left-0">
      <Image
        alt={`${mappedUser.username}-avatar`}
        src={`/images/avatar${parseInt(mappedUser.avatar)}.png`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-white/80 px-2 py-1 rounded">
        {mappedUser.username}
      </div>

      {viewBooth !== "" &&
      socket.id &&
      mappedUser.username === serverState.connections[socket.id].username ? (
        <div
          onClick={() => {
            switch (viewBooth) {
              case "spotify":
                setShowSpotifyModal(true);
                break;
              case "apple":
                setShowAppleModal(true);
                break;
              case "meta":
                setShowMetaModal(true);
                break;
              case "epic":
                setShowEpicModal(true);
                break;
              case "mathworks":
                setShowMathWorksModal(true);
                break;
              case "nvidia":
                setShowNvidiaModal(true);
                break;
            }
          }}
          className="absolute whitespace-nowrap -translate-x-[33.25px] cursor-pointer p-3 text-[12px] rounded-xl bg-opacity-60 bg-black inline-block text-white"
        >
          View booth
        </div>
      ) : null}

      {messages
        .filter((msg) => msg.username === mappedUser.username && msg.isVisible)
        .map((msg) => (
          <div
            key={msg.timestamp}
            className="absolute -top-7 left-1/2 transform -translate-x-1/2 
           whitespace-nowrap text-sm bg-black/75 text-white px-3 py-1 
           rounded-full transition-all duration-500"
            style={{
              opacity: msg.isVisible ? 1 : 0,
              transform: `translate(-50%, ${msg.isVisible ? "-100%" : "-80%"})`,
            }}
          >
            {msg.message}
          </div>
        ))}

      {/* Chat input */}
      {isChatVisible && user.username === mappedUser.username && (
        <input
          type="text"
          value={chatMessage}
          onChange={handleChange}
          autoFocus
          className="absolute -top-14 left-1/2 transform -translate-x-1/2 
                   border rounded px-2 py-1 text-sm"
          placeholder="Type a message..."
        />
      )}
    </div>
  );
  const [showConversation, setShowConversation] = React.useState(false);
  const [showAppleConversation, setShowAppleConversation] =
    React.useState(false);
  const [showMetaConversation, setShowMetaConversation] = React.useState(false);
  const [showEpicConversation, setShowEpicConversation] = React.useState(false);
  const [showMathWorksConversation, setShowMathWorksConversation] =
    React.useState(false);
  const [showNvidiaConversation, setShowNvidiaConversation] =
    React.useState(false);
  const [showSpotifyConversation, setShowSpotifyConversation] =
    React.useState(false);
  const [viewBooth, setViewBooth] = React.useState("");

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
      setServerState(newServerState);
    });

    socket.on("showJoinModal", (socketId) => {
      if (socketId === socket.id) {
        setShowJoinChatModal(true);
      }
    });

    socket.on("hideJoinModal", (socketId) => {
      console.log("Calling hideJoinModal", socketId, socket.id);
      if (socketId === socket.id) {
        console.log("Hiding join modal");
        setShowJoinChatModal(false);
      }
    });

    //   socket.on("startConvo", ({ newServerState, convoId, conversation }) => {
    //     console.log(newServerState, convoId, conversation);
    //     if (socket.id != undefined) {
    //       const username = newServerState.connections[socket.id].username;
    //       if (
    //         username === conversation.user1 ||
    //         username === conversation.user2
    //       ) {
    //         const otherUsername =
    //           username === conversation.user1
    //             ? conversation.user2
    //             : conversation.user1;
    //         var otherSocketId = "";
    //         for (let key of Object.keys(newServerState.connections)) {
    //           if (newServerState.connections[key].username === otherUsername) {
    //             otherSocketId = key;
    //           }
    //         }
    //         if (username === conversation.user1) {
    //           setOther(otherSocketId);
    //         }

    //         setShowConversation(true);
    //       }
    //     } else {
    //       console.log("socketid not found in startConvo");
    //     }
    //   });

    //   socket.on("moveToTile", (x: number, y: number) => {});

    //   return () => {
    //     socket.off("connect");
    //     socket.off("disconnect");
    //     socket.off("serverStateUpdate");
    //   };
    // }, [serverState, setServerState, setConnected]);

    socket.on("startConvo", ({ newServerState, convoId, conversation }) => {
      console.log(newServerState, convoId, conversation);
      if (socket.id != undefined) {
        console.log(
          "socketid found but connections",
          newServerState.connections
        );
        const username = newServerState.connections[socket.id].username;
        if (
          username === conversation.user1 ||
          username === conversation.user2
        ) {
          console.log("Start convo", convoId, conversation);
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

          // Always ensure it's one person calling, not both
          if (username === conversation.user1) {
            setOther(otherSocketId);
          } else {
            setOther(undefined);
          }

          setShowConversation(true);
        }
      } else {
        console.log("socketid not foun in startConvo");
      }
    });

    // Replace the existing showBoothModal handler with:
    socket.on("showBoothModal", ({ socketId, companyName }) => {
      if (socket.id && socketId === socket.id) {
        setViewBooth(companyName);
      }
    });

    socket.on("hideBoothModal", ({ socketId }) => {
      if (socket.id && socketId === socket.id) {
        setViewBooth("");
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
      if (isTyping || isChatVisible) return;
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
  }, [isTyping, isChatVisible]);

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
      {showAppleModal ? (
        <Apple
          setShowModal={setShowAppleModal}
          setConversationModal={setShowAppleConversation}
        />
      ) : null}
      {showMathWorksModal ? (
        <MathWorks
          setShowModal={setShowMathWorksModal}
          setConversationModal={setShowMathWorksConversation}
        />
      ) : null}
      {showEpicModal ? (
        <Epic
          setShowModal={setShowEpicModal}
          setConversationModal={setShowEpicConversation}
        />
      ) : null}
      {showNvidiaModal ? (
        <Nvidia
          setShowModal={setShowNvidiaModal}
          setConversationModal={setShowNvidiaConversation}
        />
      ) : null}
      {showMetaModal ? (
        <Meta
          setShowModal={setShowMetaModal}
          setConversationModal={setShowMetaConversation}
        />
      ) : null}
      {showSpotifyModal ? (
        <Spotify
          setShowModal={setShowSpotifyModal}
          setConversationModal={setShowSpotifyConversation}
        />
      ) : null}
      {showConversation ? (
        <Conversation setShowModal={setShowConversation} />
      ) : null}
      {showAppleConversation ? (
        <Conversation setShowModal={setShowAppleConversation} company="apple" />
      ) : null}
      {showEpicConversation ? (
        <Conversation setShowModal={setShowEpicConversation} company="epic" />
      ) : null}
      {showMetaConversation ? (
        <Conversation setShowModal={setShowMetaConversation} company="meta" />
      ) : null}
      {showNvidiaConversation ? (
        <Conversation
          setShowModal={setShowNvidiaConversation}
          company="nvidia"
        />
      ) : null}
      {showSpotifyConversation ? (
        <Conversation
          setShowModal={setShowSpotifyConversation}
          company="spotify"
        />
      ) : null}
      {showMathWorksConversation ? (
        <Conversation
          setShowModal={setShowMathWorksConversation}
          company="mathworks"
        />
      ) : null}
      <div className="h-full w-full p-4 flex flex-col bg-white text-black gap-y-8 mt-24">
        {showJoinChatModal && (
          <div
            className="absolute left-1/2 bottom-20 transform -translate-x-1/2 whitespace-nowrap cursor-pointer px-2 py-1 text-[12px] rounded-full bg-black bg-opacity-60 text-white z-20"
            onClick={() => {
              joinConversation();
            }}
          >
            Join Chat
          </div>
        )}
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
                      {tileCompany
                        ? tileCompany.charAt(0).toUpperCase() +
                          tileCompany.slice(1).toLowerCase()
                        : ""}
                    </div>
                  ) : null}

                  {/* Avatar layer */}
                  {Object.values(serverState.connections).map((mappedUser) => {
                    if (
                      mappedUser.coordinate[0] === rowIndex &&
                      mappedUser.coordinate[1] === colIndex
                    ) {
                      return renderUserWithMessage(mappedUser);
                    }
                    return null;
                  })}
                </div>
              );
            })
          )}
        </div>
        {/* <Video /> */}
      </div>
    </>
  );
};

export default RoomMap;

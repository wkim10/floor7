"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ServerState } from "../../../backend/types/index";

const socket = io("http://localhost:8000");

const SocketDemo = () => {
  const [username, setUsername] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [serverState, setServerState] = useState<ServerState>(
    new ServerState()
  );

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

    socket.on("serverStateUpdate", (serverState: ServerState) => {
      setServerState(serverState);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("serverStateUpdate");
    };
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
    <div>Hi</div>
    // <div className="p-4">
    //   <div className="mb-4">
    //     <div className="text-lg font-bold">
    //       Status:{" "}
    //       {connected ? (
    //         <span className="text-green-600">Connected</span>
    //       ) : (
    //         <span className="text-red-600">Disconnected</span>
    //       )}
    //     </div>
    //     <div className="text-sm text-gray-600">
    //       Connected Clients: {clientCount}
    //     </div>
    //   </div>

    //   <form onSubmit={createUser} className="mb-4">
    //     <input
    //       type="text"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       className="border p-2 rounded mr-2"
    //       placeholder="Choose a username"
    //     />
    //     <button
    //       type="submit"
    //       className="bg-blue-500 text-white px-4 py-2 rounded"
    //     >
    //       Create user
    //     </button>
    //   </form>

    //   <div className="border rounded p-4">
    //     <h2 className="text-lg font-bold mb-2">Users:</h2>
    //     {users.map((user, index) => (
    //       <div key={index} className="mb-2">
    //         <span
    //           className="font-semibold"
    //           style={{
    //             position: "absolute",
    //             left: user.coordinate[0],
    //             top: user.coordinate[1],
    //           }}
    //         >
    //           {user.username}
    //         </span>
    //       </div>
    //     ))}
    //   </div>

    //   <div>{serverState}</div>
    // </div>
  );
};

export default SocketDemo;

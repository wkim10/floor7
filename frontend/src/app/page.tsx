"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { User } from "../../../backend/types/index"

const socket = io("http://localhost:8000");

const SocketDemo = () => {
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [connected, setConnected] = useState(false);

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

    // Listen for messages
    socket.on("messageReceived", (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    // Listen for client count updates
    socket.on("clientCount", (count) => {
      setClientCount(count);
    });

    // When new users are created, add them to the list
    socket.on("createdUser", (data) => {
      setUsers((prev) => [...prev, data]);
    })

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("messageReceived");
      socket.off("clientCount");
    };
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };
  
  // Creates user
  const createUser = (e: any) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit("createUser", username);
      setUsername("");
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="text-lg font-bold">
          Status:{" "}
          {connected ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <span className="text-red-600">Disconnected</span>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Connected Clients: {clientCount}
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

      <form onSubmit={sendMessage} className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded mr-2"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>

      <div className="border rounded p-4">
        <h2 className="text-lg font-bold mb-2">Messages:</h2>
        {receivedMessages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{msg.id}: </span>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="border rounded p-4">
        <h2 className="text-lg font-bold mb-2">Users:</h2>
        {users.map((user, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold" style={{ 
              position: "absolute", 
              left: user.coordinate[0], 
              top: user.coordinate[1]}}>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocketDemo;

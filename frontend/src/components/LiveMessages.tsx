"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: number;
  user_id: number;
  name?: string;
  content: string;
  created_at?: string;
}

let socket: Socket;

export default function LiveMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // Initialize socket
    socket = io("http://localhost:5000");

    // Fetch existing messages
    fetch("http://localhost:5000/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Failed to load messages:", err));

    // Listen for real-time updates
    socket.on("new_message", (msg: Message) => {
      setMessages(prev => [msg, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    socket.emit("send_message", { user_id: 1, content: newMsg });
    setNewMsg("");
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md max-w-xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">💬 Live Messages</h2>

      <div className="h-60 overflow-y-auto border rounded-lg p-3 mb-3 bg-gray-50">
        {messages.length > 0 ? (
          messages.map((m) => (
            <div key={m.id} className="border-b py-2">
              <p className="font-semibold text-gray-800">{m.name || "User"}:</p>
              <p className="text-gray-600">{m.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No messages yet...</p>
        )}
      </div>

      <div className="flex">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
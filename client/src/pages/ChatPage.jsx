import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const channels = ["general", "random", "study"];

function ChatPage() {
  const [room, setRoom] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    socket.emit("join_room", room);

    socket.on("connect", () => {
      console.log("CONNECTED:", socket.id);
    });

    // old messages
    socket.on("load_messages", (data) => {
      setMessages(data);
    });

    // realtime messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };

  }, [room]);

  // send message
  const sendMessage = () => {

    if (!message.trim()) return;

    socket.emit("send_message", {
      room,
      sender: "User",
      message,
    });

    setMessage("");
  };

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.logo}>Channels</h3>

        {channels.map((ch) => (
          <div
            key={ch}
            onClick={() => {
              setMessages([]);
              setRoom(ch);
            }}
            style={{
              ...styles.channel,
              background: room === ch ? "#22c55e" : "transparent",
            }}
          >
            # {ch}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>

        {/* Header */}
        <div style={styles.header}>
          <h3># {room}</h3>
        </div>

        {/* Messages */}
        <div style={styles.messagesBox}>
          {messages.map((msg, i) => (
            <div key={i} style={styles.message}>

              <span style={styles.user}>
                {msg.sender}
              </span>

              <span>
                : {msg.message}
              </span>

            </div>
          ))}
        </div>

        {/* Input */}
        <div style={styles.inputBar}>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
          />

          <button
            onClick={sendMessage}
            style={styles.button}
          >
            Send
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "220px",
    background: "#111827",
    padding: "15px",
  },

  logo: {
    marginBottom: "15px",
    color: "#22c55e",
  },

  channel: {
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "5px",
    color: "#d1d5db",
  },

  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "15px",
    borderBottom: "1px solid #1f2937",
    background: "#111827",
  },

  messagesBox: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  message: {
    background: "#1f2937",
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "60%",
    wordBreak: "break-word",
  },

  user: {
    color: "#22c55e",
    fontWeight: "bold",
    marginRight: "5px",
  },

  inputBar: {
    display: "flex",
    padding: "10px",
    background: "#111827",
    borderTop: "1px solid #1f2937",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  button: {
    padding: "10px 15px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ChatPage;
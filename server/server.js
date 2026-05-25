require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const Message = require("./models/Message");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room
  socket.on("join_room", async (room) => {
    socket.join(room);

    // load old messages
    const messages = await Message.find({ room }).sort({
      createdAt: 1,
    });

    socket.emit("load_messages", messages);
  });

  socket.on("send_message", async (data) => {
    console.log("MESSAGE RECEIVED:", data);

    try {
      const newMessage = new Message({
        room: data.room,
        sender: data.sender,
        message: data.message,
      });

      await newMessage.save();

      io.to(data.room).emit("receive_message", newMessage);

    } catch (error) {
      console.log("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/messages/:room", async (req, res) => {
  try {
    const messages = await Message.find({
      room: req.params.room,
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(5000, () => {
      console.log("Server running on 5000");
    });
  })
  .catch((err) => console.log(err));
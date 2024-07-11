const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

const SocketMap = {};

const getRecieverId = (reciverId) => {
  return SocketMap[reciverId];
};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    SocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(SocketMap));
  }

  socket.on("disconnect", () => {
    const disconnectedUserId = Object.keys(SocketMap).find(
      (key) => SocketMap[key] === socket.id
    );
    if (disconnectedUserId) {
      delete SocketMap[disconnectedUserId];
      io.emit("getOnlineUsers", Object.keys(SocketMap));
    }
  });
});

module.exports = { app, io, httpServer, getRecieverId };

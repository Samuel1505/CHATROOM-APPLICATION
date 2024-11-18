const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  // New user joins
  socket.on("newuser", (username) => {
    console.log(username + " joined the chat");
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  // User exits
  socket.on("exituser", (username) => {
    console.log(username + " left the chat");
    socket.broadcast.emit("update", username + " left the conversation");
  });

  // User sends a chat message
  socket.on("chat", (message) => {
    console.log("Message received:", message);
    socket.broadcast.emit("chat", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});

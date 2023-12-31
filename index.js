const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://astro-live-chat.netlify.app",
      "https://lhd4zd-3000.csb.app",
    ],
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room ${data}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello from  Backend Express!");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

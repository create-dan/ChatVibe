const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Api is running");
});
app.get("/api/chat", (req, res) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res) => {
  //   console.log(req.params.id);

  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server running on ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chat-vibe00.onrender.com/",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");


  
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("user dissconnected");
    socket.leave(userData._id);
  });
});

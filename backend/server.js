const express = require("express");
import cors from "cors";
const dotenv = require("dotenv");

const { chats } = require("./data/data");
const path = require('path')
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes= require("./routes/messageRoutes");
require('dotenv').config({path:path.resolve(__dirname,'./.env')})
const { notFound,errorHandler}= require('./middleware/errorMiddleware')

const connectDB = require("./config/db");
 
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res) => {
    res.send("API is running Successfully");
});





app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server= app.listen(5000,console.log(`Server Started on PORT ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: true,
      // credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
      //here frontend will send some data and will join our room and that room will be exclusive for each user which is logged in;
      socket.join(userData._id);
      console.log(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      //it helps to join with user we are going to chat
      socket.join(room);
      console.log("user joined room" + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    //for sending new messages
    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
      if (!chat.users) return console.log("chat.users not defined");
  
      //if in a room(group,chat),there are 5 people and we are sending message so except us it should be seen by everyone other
  
      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;
        console.log(newMessageReceived);
        socket.to(user._id).emit("message received", newMessageReceived);
      });
    });
    

          socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave(userData._id);
          });
});
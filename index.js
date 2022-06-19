const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const rootRoute = require("./src/routers/root.router");
const { addUser, getListUserByRoom, removeUser, getUserById, getIndexUser } = require("./src/models/user");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

const publicPathDirectory = path.join(__dirname, "./public");
app.use(express.static(publicPathDirectory));

io.on("connection", (socket) => {
  socket.on("join-room", ({ userName, room }) => {
    //handle join room 
    socket.join(room);

    // add user
    const data = {
      id: socket.id,
      userName,
      room,
    };
    addUser(data);
    let userById = getUserById(socket.id);
    // send list user from server to client
    io.to(room).emit("user-in-room",{listUser:getListUserByRoom(room)});

    // hello one usser (gui 1 user)
    socket.emit("hello-one-user",{user:data});

    // send message all user no 1 user (gui toan bo user tru user vua dang nhap)
    socket.broadcast.to(room).emit("hello-all-user",userById);

    socket.on("send-message", (message) => {
      // gui toan bo cho toan bo thanh vien trong phong
      io.to(room).emit("send-messaage",{user:userById,message});
    });

    socket.on("disconnect", () => {
      io.to(room).emit("out-room",{data})
      removeUser(socket.id);
      io.to(room).emit("user-in-room",{listUser:getListUserByRoom(room)});
    })


  });

  socket.on("increment", (count) => {
    count++;
    console.log("server", count);
    socket.emit("increment", count);
  });

 
  // ...
});

const port = process.env.PORT || 4400;
app.use("api/v1", rootRoute);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

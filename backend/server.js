const express = require("express");
const {createServer} = require("http")
const {Server} = require("socket.io")

const app = require("express");
const httpServer = createServer(app)
const io = new Server(httpServer, {cors:{origin:'*', methods:['GET', 'POST']}});

io.on("connection", socket => {
    
    let userConfig = {}
    let roomConfig = {}

    socket.on("set_username_roomname", data=>{
        userConfig = {
            username:data.username,
            room:data.selectedRoom
        }
        socket.data.username = data;
        socket.join(userConfig.room)
        io.to(userConfig.room).emit("join-chat", `${userConfig.username} entrou no chat!`)

         roomConfig.clientsInRoom = io.sockets.adapter.rooms.get(userConfig.room);
        
         roomConfig.isAloneInRoom = roomConfig.clientsInRoom && roomConfig.clientsInRoom.size > 1 ? false : true;
         
         roomConfig.clientsInRoom = roomConfig.clientsInRoom.size;

        io.to(userConfig.room).emit("clients-in-room", roomConfig)
        

    })

    socket.on("message-chat", data =>{
        data.userId = socket.id;
        io.to(userConfig.room).emit("receive-message",data)
        console.log(data)
    })

    socket.on("leaving-room", data =>{
        socket.leave(data.room);

        io.to(data.room).emit("join-chat", `${data.username} saiu do chat!`)

        roomConfig.isAloneInRoom = roomConfig.clientsInRoom && roomConfig.clientsInRoom.size > 1 ? false : true;

        io.to(userConfig.room).emit("clients-in-room", roomConfig.isAloneInRoom)
    })

   

})

httpServer.listen(8000);
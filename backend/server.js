const express = require("express");
const {createServer} = require("http")
const {Server} = require("socket.io")

const app = require("express");
const httpServer = createServer(app)
const io = new Server(httpServer, {cors:{origin:'*', methods:['GET', 'POST']}});

io.on("connection", socket => {
    
    let userConfig = {}

    socket.on("set_username_roomname", data=>{
        userConfig = {
            username:data.username,
            room:data.selectedRoom
        }
        socket.data.username = data;
        socket.join(userConfig.room)
        io.to(userConfig.room).emit("join-chat", `${userConfig.username} entrou no chat!`)
    })

    socket.on("message-chat", data =>{
        data.userId = socket.id;
        io.to(userConfig.room).emit("receive-message",data)
        console.log(data)
    })

    socket.on("leaving-room", data =>{
        socket.leave(data.room);
        io.to(data.room).emit("join-chat", `${data.username} saiu do chat!`)
    })

   

})

httpServer.listen(8000);
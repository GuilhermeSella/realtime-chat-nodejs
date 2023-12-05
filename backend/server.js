const express = require("express");
const {createServer} = require("http")
const {Server} = require("socket.io")

const app = require("express");
const httpServer = createServer(app)
const io = new Server(httpServer, {cors:{origin:'*', methods:['GET', 'POST']}});

io.on("connection", socket => {
    console.log(socket.id)

    socket.on("set_username", data=>{
        socket.data.username = data;
        console.log(data)
    })

    socket.on("message-chat", textMessage =>{
        io.emit("receive-message", {
            textMessage,
            author:socket.data.username,
            authorId:socket.id
        })
    })

})

httpServer.listen(8000);
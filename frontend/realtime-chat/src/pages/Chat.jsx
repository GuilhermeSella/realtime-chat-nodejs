import React from 'react';
import { useState,useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
function Chat({socket, username, room }) {

    const [mensagensChat, setMensagensChat] = useState([]);
    const mensagemRef = useRef()
    let mensagemConfig = {}

    const handleSubmitMessage = (e)=>{
        e.preventDefault();
        mensagemConfig = {
            username:username,
            mensagem: mensagemRef.current.value
        }
        socket.emit("message-chat", mensagemConfig)
        mensagemRef.current.value = "";
      }

      useEffect(()=>{

        socket.on("receive-message", async(data) => {
            
          await setMensagensChat((current) => [...current, data] )
          console.log(mensagensChat)
        })
    
        return () => socket.off("receive-message");
    
      }, [socket, mensagensChat])

    return (
        <div>

            <h1>Olá {username}!, você está na sala {room} </h1>
            <form onSubmit={handleSubmitMessage}>
                <input type="text" placeholder='Mensagem' ref={mensagemRef} />
                <input type="submit" value="Enviar" />
            </form>

            {mensagensChat.map(message => (
            <div key={message.key}>
                <h2>{message.username}</h2>
                <p>{message.mensagem}</p>
            </div>
            ))}

      </div>
    );
}

export default Chat;
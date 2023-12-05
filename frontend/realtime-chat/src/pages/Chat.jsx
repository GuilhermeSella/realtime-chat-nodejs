import React from 'react';
import { useState,useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
function Chat({socket, username}) {

    const [mensagensChat, setMensagensChat] = useState([]);
    const mensagemRef = useRef()

    const handleSubmitMessage = (e)=>{
        e.preventDefault();
        socket.emit("message-chat", mensagemRef.current.value)
        mensagemRef.current.value = "";
      }

    useEffect(()=>{

        socket.on("receive-message", data => {
            
          setMensagensChat((current) => [...current, data] )
          console.log(mensagensChat)
        })
    
        return () => socket.off("receive-message");
    
      }, [socket, mensagensChat])

    return (
        <div>

            <h1>Olá, {username}</h1>
            <form onSubmit={handleSubmitMessage}>
                <input type="text" placeholder='Mensagem' ref={mensagemRef} />
                <input type="submit" value="Enviar" />
            </form>

            {mensagensChat.map(message => (
            <div>
                <h2>{message.author}</h2>
                <p>{message.textMessage}</p>
            </div>
            ))}

      </div>
    );
}

export default Chat;
import React from 'react';
import { useState,useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
function Chat({socket, username, room, setChatIsOpen }) {

    const [mensagensChat, setMensagensChat] = useState([]);
    const [isAloneinRoom, setIsAloneInRoom] = useState(true);
    const [usersInRoom, setUsersInRoom] = useState(0);
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

      const exitRoom = ()=>{
        const userConfig ={
            username:username,
            room:room
        }
        socket.emit("leaving-room", userConfig)
        setChatIsOpen(false)
      }

      useEffect(()=>{

        socket.on("receive-message", async(data) => {
            
          await setMensagensChat((current) => [...current, data] )
        })
        
        socket.on("join-chat", async data =>{
            await setMensagensChat((current) => [...current, data] )
        })

        socket.on("clients-in-room", async data =>{
            
            setUsersInRoom(data.clientsInRoom)
            data.isAloneInRoom ? setIsAloneInRoom(true) : setIsAloneInRoom(false)
            console.log(data)
        })
    
        return () => {
            socket.off("receive-message");
            socket.off("join-chat");
            socket.off("clients-in-room");
        };
    
      }, [socket, mensagensChat])

    return (
        <div>

            <h1>Olá {username}!, você está na sala {room} </h1>
            <form onSubmit={handleSubmitMessage}>
                <input type="text" placeholder='Mensagem' ref={mensagemRef} />
                <input type="submit" value="Enviar" />
            </form>
                {!isAloneinRoom ? 
                    <div>
                        <h2>Você e mais {usersInRoom - 1 || 0} estão conectados nessa sala</h2>
                    </div>
                    :
                    <div>
                        <h2>Você está sozinho nesta sala! Convide seus amigos!</h2>
                    </div> 
                }
            <button onClick={exitRoom}>Sair</button>

            {mensagensChat.map(message => (
                message instanceof Object ? (
                    <div key={message.id}>
                        <h2>{message.username}</h2>
                        <h3>{message.mensagem}</h3>
                    </div>
                ) : (
                    <div key={message.id}>
                        <p>{message}</p>
                    </div>
                )
            ))}


      </div>
    );
}

export default Chat;
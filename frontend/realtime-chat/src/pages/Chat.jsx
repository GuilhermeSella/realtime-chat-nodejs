import React from 'react';
import { useState,useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
import copy from 'clipboard-copy'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SendHorizonal, Users, LogOut, Link2, Link} from 'lucide-react'

function Chat({socket, username, room, setChatIsOpen }) {

    const [mensagensChat, setMensagensChat] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState(0);
    const [linkRoom, setLinkRoom] = useState(`http://127.0.0.1:5173/roominvite/${room}`)
    const mensagemRef = useRef()
    let mensagemConfig = {}
    let userIdLogado = socket.id


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

      const CopyClick = ()=>{
        copy(linkRoom)
        toast("Link da sala copiado!")
      }

      useEffect(()=>{

        socket.on("receive-message", async(data) => {
            
          await setMensagensChat((current) => [...current, data] )
          const chatContainer = document.getElementById('chat-container');
          chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        
        socket.on("join-chat", async data =>{
            await setMensagensChat((current) => [...current, data] )
        })

        socket.on("clients-in-room", async data =>{
            
            setUsersInRoom(data.clientsInRoom)
            console.log(data.clientsInRoom)
        })
    
        return () => {
            socket.off("receive-message");
            socket.off("join-chat");
            socket.off("clients-in-room");
        };
    
      }, [socket, mensagensChat])

    return (
        <div className=' bg-slate-50/60 h-screen  w-screen flex flex-col items-center '>

            

            <nav className=' bg-purple-900 w-full  p-5  flex items-center justify-between'>

                <button onClick={exitRoom}>
                    <LogOut color='white'/>
                </button>

                <h1 className='text-white text-lg font-semibold'>Sala {room}</h1>

                <button onClick={CopyClick}>
                    <Link color='white' size={28} />
                </button>
            </nav>

            <ToastContainer />

           
                {usersInRoom > 1  ? 
                    
                        <h2 className='  bg-gray-600 rounded-xl p-1 lg:p-1.5 px-2 text-center m-2 text-lg font-semibold text-white' >Você e mais {usersInRoom - 1 } estão conectados nessa sala</h2>
                   
                    :
                   
                        <h2 className='  bg-gray-600 rounded-xl p-1 lg:p-1.5 text-center m-2 text-base font-semibold text-white'>Você está sozinho nesta sala! Convide seus amigos!</h2>
                    
                }
            

            <div id='chat-container' className=' max-w-7xl px-3 pb-16 w-screen h-full flex flex-col gap-1 items-center overflow-y-scroll'>
                {mensagensChat.map(message => (
                    message instanceof Object ? (

                        message.userId == userIdLogado ? (
                        <div className=' w-full p-2.5  flex flex-col items-end gap-1 ' key={message.key}>
                            <h2 className='font-semibold'>Você</h2>
                            <h3 className='bg-purple-800 text-sm max-w-xs sm:max-w-sm sm:text-base   py-1 px-3 rounded-lg text-white '>{message.mensagem}</h3>
                        </div>

                        ) : (

                        <div className='  w-full p-2.5  flex flex-col items-start gap-1 '  key={message.key}>
                            <h2  className='font-semibold'>{message.username}</h2>
                            <h3 className='bg-purple-800 text-sm max-w-xs sm:max-w-sm sm:text-base  py-1 px-3 rounded-lg text-white'>{message.mensagem}</h3>
                        </div>
                        )

                    ) : (
                        <div key={message.key}>
                            <p className=' bg-gray-600 p-1.5 text-xs px-4 my-1.5 font-semibold text-white rounded-xl'>{message} </p>
                        </div>
                    )
                ))}

            </div>

            <form className='w-screen bottom-4 py-5 px-3 flex itens-center justify-center gap-3' onSubmit={handleSubmitMessage}>

                <input
                className='w-full max-w-7xl rounded-3xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                type="text" 
                placeholder='Mensagem' 
                ref={mensagemRef} />

                <button type='submit' className='rounded-full p-3 bg-purple-800'>
                    <SendHorizonal color='white'/>
                </button>
            </form>

      </div>
    );
}

export default Chat;
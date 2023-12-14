import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { useNavigate, useParams } from 'react-router'
import Chat from './Chat';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RoomLink() {

    const { room } = useParams();
  console.log(room)
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [socketChat, setSocketChat] = useState(null)
  const username = useRef()
  const notify = ()=> toast("Preencha os campos!");
  

  const handleSubmit = (e)=>{

    if(username.current.value == "" || room == ""){
      toast("Preencha todos os campos!");
    }
    else{
      e.preventDefault();
      const socket = io.connect("http://localhost:8000")
      const userConfig = {
        username : username.current.value,
        selectedRoom : room
      }
      socket.emit("set_username_roomname",userConfig);
  
      setSocketChat(socket);
      setChatIsOpen(true);
    }

  }
  
  return (
    <>

      <ToastContainer />

      {chatIsOpen ? 
        <Chat  
          socket={socketChat} 
          setChatIsOpen={setChatIsOpen}
          room={room} 
          username={username.current.value}
        />
      :
      <div className='h-screen w-screen flex flex-col items-center justify-center gap-6 bg-slate-50/60'>
          <h1 className='text-5xl font-Sans font-semibold text-purple-800'>Realtime Chat</h1>
            <h3 className='text-3xl font-semibold font-Sans text-purple-800 '>
                Sala {room}
            </h3>
          <main className='w-screen flex flex-col items-center gap-8 p-5  '>

            <input 
            className='w-full max-w-xl rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 ' 
            type="text" 
            placeholder='Digite seu usuário' 
            ref={username} />

          <button onClick={handleSubmit} className='w-full max-w-xl bg-purple-800 cursor-pointer transition hover:bg-purple-800/80 text-white font-semibold text-base rounded-md border-0 py-3 px-4' >Entrar</button>

          </main>
      </div>
      }

    </>
  )
}

export default RoomLink


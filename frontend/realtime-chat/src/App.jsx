import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import io from 'socket.io-client'
import { useNavigate } from 'react-router'
import Chat from './pages/Chat'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [socketChat, setSocketChat] = useState(null)
  const username = useRef()
  const room_name = useRef()
  const notify = ()=> toast("Preencha os campos!");
  

  const handleSubmit = (e)=>{

    if(username.current.value == "" || room_name.current.value == ""){
      toast("Preencha todos os campos!");
    }
    else{
      e.preventDefault();
      const socket = io.connect("http://localhost:8000")
      const userConfig = {
        username : username.current.value,
        selectedRoom : room_name.current.value
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
          room={room_name.current.value} 
          username={username.current.value}
        />
      :
      <div className='h-screen w-screen flex flex-col items-center justify-center gap-6 bg-slate-50/60'>
          <h1 className='text-5xl font-Sans font-semibold text-purple-800'>Realtime Chat</h1>
          <main className='w-screen flex flex-col items-center gap-8 p-5  '>

            <input 
            className='w-full max-w-xl rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 ' 
            type="text" 
            placeholder='Digite uma sala' 
            ref={room_name} />

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

export default App


import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import io from 'socket.io-client'
import { useNavigate } from 'react-router'
import Chat from './pages/Chat'

function App() {


  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [socketChat, setSocketChat] = useState(null)
  const username = useRef()
  const room_name = useRef()
  
  

  const handleSubmit = (e)=>{
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
  
  return (
    <>
      {chatIsOpen ? 
        <Chat  socket={socketChat} room={room_name.current.value} username={username.current.value}/>
      :
      <div>
          <h1>Realtime Chat</h1>
          <form  onSubmit={handleSubmit}>
            <input type="text" placeholder='Digite uma sala' ref={room_name} />
            <input type="text" placeholder='Digite seu usuário' ref={username} />
            <input type="submit" value="Entrar" />
          </form>
      </div>
      }

    </>
  )
}

export default App


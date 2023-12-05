import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import io from 'socket.io-client'


function App() {

  const username = useRef()

  
  

  const handleSubmit = (e)=>{
    e.preventDefault();
    const socket = io.connect("http://localhost:8000")
    socket.emit("set_username",username.current.value)
    
  }
  
  

  return (
    <>
      <h1>Realtime Chat</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Digite seu usuário' ref={username} />
        <input type="submit" value="Entrar" />
      </form>

    </>
  )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Chat from './pages/Chat.jsx'
import RoomLink from './pages/RoomLink.jsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/roominvite/:room",
    element: <RoomLink/>
  }
 
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={ router } />   
  </React.StrictMode>,
)

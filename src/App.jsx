import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import AddPost from './Pages/AddPost'
import Navbar from './Pages/Navbar'
import Registration from './Pages/Registration'
import Login from './Pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
  <>
  <Navbar/>
  <Routes>
    <Route path='/'  element={<Home/>}/>
    <Route path='addPosts'  element={<AddPost/>}/>
    <Route path='login'  element={<Login/>}/>
    <Route path='singup'  element={<Registration/>}/>
  </Routes>
  </>
  )
}

export default App

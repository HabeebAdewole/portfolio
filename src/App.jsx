import { useState } from 'react'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Landing from './components/pages/Landing'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
    {/* <Route path= "/" element={<Footer/>}/> */}
    <Route path= "/about" element={<Navbar/>}/>
    <Route path="/" element={<Landing/>}/>
    </Routes>
   
    </>
  )
}

export default App

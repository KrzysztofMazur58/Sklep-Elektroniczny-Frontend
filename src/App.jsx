import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Products from './compontents/Products'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './compontents/home/Home'
import Navbar from './compontents/Navbar'
import { Toaster } from 'react-hot-toast'
import Cart from './compontents/cart/Cart'
import LogIn from './compontents/auth/LogIn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <React.Fragment>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={ <Home />}/>
        <Route path='/products' element={ <Products />}/>
        <Route path='/cart' element={ <Cart />}/>
        <Route path='/login' element={ <LogIn />}/>
      </Routes>
    </Router>

    <Toaster position='bottom-center' />
    </React.Fragment>
  )
}

export default App

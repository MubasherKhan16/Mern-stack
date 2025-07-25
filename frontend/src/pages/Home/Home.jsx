import React from 'react'
import Navbar from '../../components/Home/Navbar'
import Mainpage from '../../components/Home/Mainpage'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Home/Footer'

const Home = () => {
  return (
    <div>
  <Navbar/>
  <Outlet />
  <Footer/> 
    </div>
  )
}

export default Home

import React from 'react'
import Navbar from '../../components/Home/Navbar'
import Mainpage from '../../components/Home/Mainpage'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div>
  <Navbar/>
  <Mainpage/>
  <Outlet /> 
    </div>
  )
}

export default Home

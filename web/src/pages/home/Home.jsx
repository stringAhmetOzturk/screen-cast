import React from 'react'
import "./home.css"
import MyTable from '../../components/Table'
import Navbar from '../../components/Navbar'
const Home = () => {
  return (
    <div>
      <Navbar/>
      <MyTable />
    </div>
  )
}

export default Home

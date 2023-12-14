import React from 'react'
import "./navbar.css"
import { ExitToApp, AccountCircle } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { loginStart } from '../redux/authReducer';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = ()=>{
    dispatch(loginStart())
  }
  
  return (
    <nav>
        <span className='menuIcon'><MenuIcon style={{color:"white"}}></MenuIcon></span>
        <ul>
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/add">ADD STUDENT</Link></li>
            <li><Link to="/assign">ASSIGN TIME</Link></li>
        </ul>
        <div className='icons'>
          <span><AccountCircle onClick={()=>navigate("/profile")} color="secondary" style={{cursor:"pointer",color: "white" }} /></span>
          <span><ExitToApp onClick={handleLogout} style={{cursor:"pointer",color: "white" }}/></span>
        </div>
    </nav>
  )
}

export default Navbar

import React, { useState } from 'react'
import "./login.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/authReducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notify = (error) => toast(error);
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const login = async(e) =>{
    e.preventDefault() 
    if(username && password){
      try {
        const res = await axios.post(process.env.REACT_APP_API_URL+"login", { username: username, password: password }, {
          method: 'POST',
          credentials: 'include', // Include cookies
          
          headers: {
            'Content-Type': 'application/json',
         
              "x-api-key":process.env.REACT_APP_API_TOKEN
            
          }
        });
        
        if(res.status === 200){
          dispatch(loginSuccess({user: res.data }))
          navigate("/")
        }else{
          notify(res.data);
        }
      } catch (error) {
        notify(error.response.data["message"]);
      }
      
    }else{
      notify("Please fill all the fields!");
    }
  }
  return (
    <div className='loginPage'>
      <span>Screen Cast Admin</span>
        <form onSubmit={login}>
            <input className='loginInput' type="text" onChange={(e)=>setUsername(e.target.value)} placeholder="Username"/>
            <input className='loginInput' type="password" onChange={(e)=>setPassword(e.target.value)}  placeholder="Password"/>
            <button className='loginButton' type="submit">Login</button>
        </form>
        <ToastContainer /> 
    </div>
  )
}

export default Login

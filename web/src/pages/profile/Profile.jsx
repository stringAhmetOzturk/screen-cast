import React, { useState } from 'react'
import "./profile.css"
import axios from 'axios'
import Navbar from '../../components/Navbar'
const Profile = () => {
  const [password,setPassword] = useState("")
  const [passwordAgain,setPasswordAgain] = useState("")
  const [isVisible,setIsVisible] = useState(false)
  const setNewPassword = async()=>{
    if (password === passwordAgain) {
      const res = await axios.put(process.env.REACT_APP_API_URL+"update-password",{username:"admin",password:password},{headers: {
        "x-api-key":process.env.REACT_APP_API_TOKEN
      }})
      if(res.status === 200){
        window.location.reload()
      }
    }
  }
  return (
    <div>
            <Navbar/>
        <div className='profilePage'>
          <form onSubmit={setNewPassword}>
              <span>Change Password</span>
              <input className='profileInput' type={isVisible ? `text` : `password`} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
              <input className='profileInput' type={isVisible ? `text` : `password`}  onChange={(e)=>setPasswordAgain(e.target.value)} placeholder="Password Again"/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"start", marginBottom:"10px",width:"100%"}}><input type='checkbox' className='checkbox' onChange={(e)=>setIsVisible(!isVisible)}/><h5>Show the password</h5> </div>
              <button type="submit">Change</button>
          </form>
        </div>
   
    </div>
      

  )
}

export default Profile

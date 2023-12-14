import React, { useState } from 'react'
import "./add.css"
import axios from 'axios'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Add = () => {
  const navigate = useNavigate()
  const [name,setName] = useState("")
  const [surname,setSurname] = useState("")
  const [studentId,setStudentId] = useState("")
  const [secretKey,setSecretKey] = useState("")
  const notify = (error) => toast(error);
  const generateRandomKey = () => {
    // Generate a random string for the key (you can use a more complex logic if needed)
    const key = Math.random().toString(36).substring(6).concat(name ? name.substring(0,2) : "sc").concat(surname ? surname.substring(0,1) : "23")
    .concat(studentId ? studentId.substring(0,2) : "F!").concat(Math.random().toString(36).substring(6))
    setSecretKey(key);
  };
  const addStudent = async(e)=>{
    e.preventDefault()
    if(name && surname && studentId && secretKey){
      try {
        const res = await axios.post(process.env.REACT_APP_API_URL+"add-student",{name:name,surname:surname,
        studentId:studentId,secretKey:secretKey},{headers: {
          "x-api-key":process.env.REACT_APP_API_TOKEN
        }})
        if (res.status === 200) {
          navigate("/")
        }else{
          notify(res.data)
        }
      } catch (error) {
        notify(error.response.data["message"])
      }
  }else{
    notify("Fill all credentials!");
  }
  }
  return (
    <div>
            <Navbar/>
        <div className='addPage'>
          <form onSubmit={addStudent}>
              <span>Add Student</span>
              <input className='addInput' type="text" onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
              <input className='addInput' type="text" onChange={(e)=>setSurname(e.target.value)} placeholder="Surname"/>
              <input className='addInput' type="number" onChange={(e)=>setStudentId(e.target.value)} placeholder="Student ID"/>
              <input className='addInput' type="text" value={secretKey} onChange={(e)=>setSecretKey(e.target.value)} placeholder="Secret Key"/>
              <h5 type="button" style={{marginBottom:"10px",cursor:"pointer"}} onClick={generateRandomKey}>Generate Random Key</h5>
              <button className='addButton' type="submit">Add</button>
          </form>
        </div>
        <ToastContainer /> 
    </div>
      

  )
}

export default Add

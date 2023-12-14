import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios"
import { useEffect, useState } from "react";
import "./table.css"

const MyTable = () => {
  const [students,setStudents] = useState([])
  useEffect(()=>{
    const fetchStudents = async()=>{
      const res = await axios.get(process.env.REACT_APP_API_URL+"get-students",{headers: {
        "x-api-key":process.env.REACT_APP_API_TOKEN
      }}
      )
      setStudents(res.data)
    }
    fetchStudents()

  },[])
  
  const deleteStudent = async(id)=>{
    try {
      const res = await axios.delete(process.env.REACT_APP_API_URL+`delete-student/${id}`,{headers: {
        "x-api-key":process.env.REACT_APP_API_TOKEN
      }})
      if (res.status === 200) {
        window.location.reload()
      }else{
        console.log("Error occured")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student ID*</TableCell>
            <TableCell>Secret Key*</TableCell>
            <TableCell>Name and Surname*</TableCell>
            <TableCell>Date*</TableCell>
            <TableCell>Minute*</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           {students.length > 0 && students.map((row) => (
            <TableRow key={row?.id}>
              <TableCell>{row?.studentId}</TableCell>
              <TableCell>{row?.secretKey}</TableCell>
              <TableCell>
                <div>
                  {row?.name} {row?.surname}
                </div>
              </TableCell>
              <TableCell>{row?.date ?? "-"}</TableCell>
              <TableCell>{row?.minute ?? "-"}</TableCell>
              <TableCell><button className="homeButton" onClick={()=>deleteStudent(row?.id)}>Delete</button></TableCell>
            </TableRow>
          ))} 
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;

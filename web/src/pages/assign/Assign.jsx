import React, { useEffect, useState } from "react";
import "./assign.css";
import { Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Assign = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [minute, setMinute] = useState("");
  const notify = (error) => toast(error);
  const [students, setStudents] = useState([]);
  const [studentOption, setStudentOption] = useState(""); // Initialize with an empty string

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_URL + "get-students",{headers: {
            "x-api-key":process.env.REACT_APP_API_TOKEN
          }}
        );
        setStudents(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchStudents();
  }, []);

  const assignTime = async (e) => {
    e.preventDefault();
    if (date && minute && studentOption.studentId) {
      try {
        const res = await axios.post(
          process.env.REACT_APP_API_URL + "assign-time",
          {
            studentId: studentOption.studentId,
            date: date,
            minute: minute,
          },{headers: {
            "x-api-key":process.env.REACT_APP_API_TOKEN
          }}
        );
        if (res.status === 200) {
          navigate("/");
        } else {
          notify(res.data.message);
        }
      } catch (error) {
        notify(error.response.data.message);
      }
    } else {
      notify("Fill all credentials!");
    }
  };
  const handleStudentSelect = (event) => {
    setStudentOption(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="assignPage">
        <form onSubmit={assignTime}>
          <span>Assign Time</span>
          <FormControl className="assignFormControl">
            <InputLabel>Select a student</InputLabel>
            <Select
              className="assignSelect"
              value={studentOption}
              onChange={handleStudentSelect}
            >
              {students.map((student) => (
                <MenuItem
                className="assignMenuItem"
                  key={student.id}
                  value={student}
                >
                  {student.name} {student.surname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            className="assignInput"
            type="datetime-local"
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
          <input
            className="assignInput"
            type="time"
            onChange={(e) => setMinute(e.target.value)}
            placeholder="Minutes"
          />
          <button className="assignButton" type="submit">
            Assign
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Assign;

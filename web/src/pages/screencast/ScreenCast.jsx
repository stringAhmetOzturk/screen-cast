import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import CircularProgress from "@mui/material/CircularProgress";

function ScreenCast() {
  const [room, setRoom] = useState("d269aed0-5755-4f7a-920e-7cda4dd3c4a7");
  const [remainingMinutes, setRemainingMinutes] = useState();
  const [imageSrc, setImageSrc] = useState(null);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  const connectSocket = () => {
    const newSocket = io.connect(process.env.REACT_APP_SOCKET_URL, {
      path: "",
      transports: ["websocket"],
      
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join-message", room);
    });

    newSocket.on("screen-data-listener", (message) => {
      setImageSrc(`data:image/png;base64,${message}`);
    });

    newSocket.on("screen-stopped", () => {
      setImageSrc(null);
    });
  };

  const startInterval = (
    serverDateMilliseconds,
    minuteInMinutes,
    currentDateMilliseconds
  ) => {
    const remainingMilliseconds =
      serverDateMilliseconds +
      minuteInMinutes * 60000 -
      currentDateMilliseconds;
    setRemainingMinutes(Math.floor(remainingMilliseconds / 60000));

    const intervalId = setInterval(() => {
      setRemainingMinutes((prevRemainingMinutes) => {
        if (prevRemainingMinutes > 0) {
          return prevRemainingMinutes - 1;
        } else {
          clearInterval(intervalId);
          window.location.reload();
          return 0;
        }
      });
    }, 60000);
  };

  const handleImageClick = (event) => {
    const myImage = document.getElementById("screencast-image");

    myImage.addEventListener("mousedown", function (event) {
      const X = event.clientX - myImage.getBoundingClientRect().left;
      const Y = event.clientY - myImage.getBoundingClientRect().top;

      const adjustedX = X;
      const adjustedY = Y;

      const clickData = {
        room,
        adjustedX,
        adjustedY,
      };

      if (event.button === 2) {
        console.log("Sockete sağ click gönderildi")
        socket.emit("screen-right-click", JSON.stringify(clickData));
      } else {
        console.log("Sockete sol click gönderildi")
        socket.emit("screen-click", JSON.stringify(clickData));
      }
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const obj = {
      room,
      text,
    };
    console.log(obj)
    socket.emit("code-message", JSON.stringify(obj));
    console.log("Sockete text gönderildi!")
    setText("");
  };

  const extractAndParseTime = (data) => {
    const { date, minute } = data[0];

    const serverDate = new Date(date)

    const currentDate = new Date()
    
    currentDate.setHours(currentDate.getHours() + 1);

    const minuteParts = minute.split(":");
    const minuteInMinutes =
      parseInt(minuteParts[0], 10) * 60 + parseInt(minuteParts[1], 10);

    const serverDateMilliseconds = serverDate.getTime();

    const currentDateMilliseconds = currentDate.getTime();


    return { serverDateMilliseconds, minuteInMinutes, currentDateMilliseconds };
  };

  const checkKeyData = async (keyCode) => {
 

    try {
      const headers = {
        "x-api-key": process.env.REACT_APP_API_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}check-keyCode`,
        { keyCode: keyCode },
        { headers: headers }
      );

      if (res.data.length > 0) {

        return res.data;
      } else {

        window.location.reload();
      }
    } catch (error) {
      console.error("Request error:", error.message);
    }
  };

  const validateKeyCode = (keyCode) => {
    if (!keyCode || keyCode.trim().length === 0) {
      alert("Keycode is mandatory to join.");
      window.location.reload();
      return false;
    }else{
      return true;
    }
  };

  const fetchData = async () => {
    var keyCode = prompt("Please enter your keycode: ");
    var data;

    const validation = validateKeyCode(keyCode);
    if (validation === true) {

      data = await checkKeyData(keyCode);

      if (data) {

        const {
          serverDateMilliseconds,
          minuteInMinutes,
          currentDateMilliseconds,
        } = extractAndParseTime(data);

        const allowedStartTime = serverDateMilliseconds;
        const allowedEndTime = serverDateMilliseconds + minuteInMinutes * 60000;
    
        const currentTimeIsWithinAllowedRange =
          currentDateMilliseconds >= allowedStartTime &&
          currentDateMilliseconds <= allowedEndTime;
    
        if (currentTimeIsWithinAllowedRange) {
       
          // Socket connection is established only once
          if (!socket) {
            connectSocket();
            startInterval(
              serverDateMilliseconds,
              minuteInMinutes,
              currentDateMilliseconds
            );
          } else {
            startInterval(
              serverDateMilliseconds,
              minuteInMinutes,
              currentDateMilliseconds
            );
          }
        } else {

          window.location.reload();
        }
      }
    }else{

      window.location.reload();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {imageSrc === null ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "900px",
            height: "600px",
            marginTop: "2%",
            marginLeft: "5%",
          }}
        >
          <p>
            Waiting for server to share screen.
            <br />
            You can contact with the teacher!
          </p>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <img
          id="screencast-image"
          style={{
            width: "900px",
            height: "600px",
            marginTop: "2%",
            marginLeft: "5%",
          }}
          src={imageSrc}
          onClick={(e) => handleImageClick(e)}
        />
      )}

      <div>
        <span style={{ fontSize: "16px", margin: "0px" }}>
          {remainingMinutes} minutes remaining
        </span>
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
            height: "600px",
            padding: 0,
            marginLeft: "2%",
            marginTop: "2%",
          }}
        >
          <textarea
            style={{ height: "100%" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button className="homeButton">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ScreenCast;

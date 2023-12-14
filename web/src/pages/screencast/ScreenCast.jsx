import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
function ScreenCast() {
  const [room, setRoom] = useState("d269aed0-5755-4f7a-920e-7cda4dd3c4a7");
  const [remainingMinutes, setRemainingMinutes] = useState();
  const [imageSrc, setImageSrc] = useState(null);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const keyCode = prompt("Please enter your keycode: ");
      if (keyCode === null) {
        window.location.reload();
      } else if (keyCode.trim().length === 0) {
        alert('Keycode is mandatory to join.');
        window.location.reload();
      } else {
        const data = await checkKeyData(keyCode);
        if (data) {
          const serverDate = new Date(data[0]["date"]);
          const currentDate = new Date();

          const minuteValue = data[0]["minute"];
          const minuteParts = minuteValue.split(":");
          const minuteInMinutes = parseInt(minuteParts[0], 10) * 60 + parseInt(minuteParts[1], 10);

          const serverDateMilliseconds = serverDate.getTime();
          const currentDateMilliseconds = currentDate.getTime();

          if (
            serverDateMilliseconds <= currentDateMilliseconds &&
            currentDateMilliseconds <= serverDateMilliseconds + minuteInMinutes * 60000
          ) {
            // Socket bağlantısını yalnızca bir kez başlat
            if (!socket) {
              // const newSocket = io.connect('sc-web.ina-codes.eu', {
              const newSocket = io.connect(process.env.REACT_APP_SOCKET_URL, {
                path:'',	  
                transports: ['websocket'],
            
              });

              setSocket(newSocket);
              newSocket.on('connect', () => {
           
                newSocket.emit('join-message', room);
              });

              newSocket.on('screen-data-listener', (message) => {
                setImageSrc(`data:image/png;base64,${message}`);
              });
              newSocket.on('screen-stopped', (message) => {
                
                setImageSrc(null)
              });
            }

            const remainingMilliseconds = serverDateMilliseconds + minuteInMinutes * 60000 - currentDateMilliseconds;
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
          } else {
            window.location.reload();
          }
        }
      }
    };

    fetchData();
  }, []);

  const checkKeyData = async (keyCode) => {
    try {
      const headers = {
  
        'x-api-key':process.env.REACT_APP_API_TOKEN,
        'Content-Type': 'application/json', // İçerik türü JSON
        'Accept': 'application/json', // Kabul edilen yanıt türü JSON
      };
      const res = await axios.post(process.env.REACT_APP_API_URL + "check-keyCode", { keyCode: keyCode }, {headers:headers });
      if (res.data.length > 0) {
        return res.data;
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Istek hatasi: ", error.message);
      console.error("Durum: ", error);
      // Hata ile ilgili uygun işlemleri burada yapabilirsiniz.
    }
  }
  

  const handleImageClick = (event) => {
  const myImage = document.getElementById('screencast-image');
  
  myImage.addEventListener('mousedown', function (event) {
    
    const X = event.clientX - myImage.getBoundingClientRect().left; // Tıklamanın x koordinatı
    const Y = event.clientY - myImage.getBoundingClientRect().top; // Tıklamanın y koordinatı
    // const scaleFactorX = 1.70
    // const scaleFactorY = 1.4500000
    // var adjustedX = X * scaleFactorX
    // var adjustedY = Y * scaleFactorY
    var adjustedX = X
    var adjustedY = Y 
    const clickData = {
    room,
    adjustedX,
    adjustedY,
  };
  console.log(event)
    if(event.button === 2) {
      socket.emit('screen-right-click', JSON.stringify(clickData));
    }else{
      socket.emit('screen-click', JSON.stringify(clickData));
    }
  });

//   myImage.addEventListener('dblclick', function (event) {
//     const X = event.clientX - myImage.getBoundingClientRect().left; // Tıklamanın x koordinatı
//     const Y = event.clientY - myImage.getBoundingClientRect().top; // Tıklamanın y koordinatı
//     const scaleFactorX = 1.70
//     const scaleFactorY = 1.4500000
//     var adjustedX = X * scaleFactorX
//     var adjustedY = Y * scaleFactorY
//     const clickData = {
//     room,
//     adjustedX,
//     adjustedY,
//   };
//   socket.emit('screen-dblclick', JSON.stringify(clickData));
// });

}



  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    const obj = {
      room,
      text,
    };
    socket.emit('code-message', JSON.stringify(obj));
    setText('')
  };

  // const copyEvent = (event)=>{

  //   event.preventDefault()
  //   socket.emit('copy-event')
  // }

  // const pasteEvent = (event)=>{

  //   event.preventDefault()
  //   socket.emit('paste-event')
  // }

  // const selectAllEvent = (event)=>{

  //   event.preventDefault()
  //   socket.emit('selectall-event')
  // }

  // const deleteEvent = (event)=>{

  //   event.preventDefault()
  //   socket.emit('delete-event')
  // }

  return (
    <div style={{ display: "flex" ,alignItems:"center"}}>
      {imageSrc === null ? <div style={{ display: "flex" ,alignItems:"center", justifyContent:"center",width: '900px', height: '600px', marginTop: '2%', marginLeft: '5%' }}><CircularProgress color="secondary" /> </div>:   <img
        id="screencast-image"
        style={{ width: '900px', height: '600px', marginTop: '2%', marginLeft: '5%' }}
        src={imageSrc}
        onClick={(e)=>handleImageClick(e)}
      />}
   
      <div>
        <span style={{fontSize:"16px" ,margin:"0px"}}>{remainingMinutes} minutes remaining</span>
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
            height: '600px',
            padding: 0,
            marginLeft: '2%',
            marginTop: '2%',
          }}
        >
          <textarea
            style={{ height: '100%' }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button className='homeButton'>Send</button>
          {/* <div style={{display:"flex",marginTop:"10px"}}>  */}
        {/* <button style={{margin:"5px"}} onClick={(e)=>selectAllEvent(e)}>Select All</button>
        <button style={{margin:"5px"}} onClick={(e)=>copyEvent(e)}>Copy</button>
        <button style={{margin:"5px"}} onClick={(e)=>pasteEvent(e)}>Paste</button>
        <button style={{margin:"5px"}} onClick={(e)=>deleteEvent(e)}>Delete</button> */}
        {/* </div> */}
        </form>
    
   
      </div>
    </div>
  );
}

export default ScreenCast;

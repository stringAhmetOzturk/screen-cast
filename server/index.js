import express from "express"; // Add this line to import express
import db from "./config/connection.js";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server as socketIO } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
/////// validate api token
const validateToken = (req, res, next) => {
  const token = req.headers["x-api-key"];
  if (!token || token !== process.env.API_TOKEN) {
    return res.sendStatus(403);
  }
  next();
};

dotenv.config();
const app = express();
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app); // Rename http to server
const ioServer = new socketIO(server);

const io = ioServer;

const saltRounds = 10;

// app.get("/",(req,res)=>{
//   res.send("Welcome to roboticapp api!")
// })

//api token validation
app.use(validateToken);

app.post("/api/register", async (req, res) => {
  const q = "INSERT INTO admin (username,password) VALUES (?)";
  const password = req.body.password;
  const queryValues = [req.body.username];

  if (password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    queryValues.push(hashedPassword);
  }
  db.query(q, [queryValues], (error, data) => {
    if (error) {
      return res.status(400).json(error);
    } else {
      res.json(data);
    }
  });
});
// Route to login
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    try {
      const q = "SELECT * FROM admin WHERE username = ?";
      db.query(q, username, (error, data) => {
        if (error || data.length === 0) {
          res.status(400).json({ message: "Username not found!", error });
        } else {
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) {
              res
                .status(500)
                .json({ message: "An error occurred during login" });
            } else if (result) {
              const userData = {
                id: data[0].id,
                username: data[0].username,
              };

              res.status(200).json(userData);
            } else {
              res.status(400).json({ message: "Incorrect password!" });
            }
          });
        }
      });
    } catch (error) {
      res.status(400).json({ message: "Please fill the credentials!" });
    }
  } else {
    res.status(400).json({ message: "Please fill the credentials!" });
  }
});

//route to post screen-data
// let desktop = ""
let activeImgStr = "";
app.post("/api/screen-data", (req, res) => {
  activeImgStr = req.body.image;
  if (activeImgStr) {
    try {
      io.emit("screen-data-listener", activeImgStr);
      res.send("Success");
    } catch (error) {
      throw error;
    }
  }
});

// Route to get students
app.get("/api/get-students", (req, res) => {
  try {
    const q =
      "SELECT students.id,students.name,students.surname,students.studentId,students.secretKey,connectiontime.date,connectiontime.minute FROM students LEFT JOIN connectiontime ON connectiontime.studentId = students.studentId";
    db.query(q, (error, data) => {
      if (error) {

        res.status(400).json({ message: "Error" });
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Route to get students
app.delete("/api/delete-student/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM students WHERE id = ?";
  try {
    db.query(q, id, (error, data) => {
      if (error) {
        res.status(400).json({ message: "Error" });
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Route to get students
app.post("/api/check-keyCode", (req, res) => {
  const keyCode = req.body.keyCode;
  const q =
    "SELECT * FROM students INNER JOIN connectiontime ON connectiontime.studentId = students.studentId WHERE secretKey = ?";
  try {
    db.query(q, keyCode, (error, data) => {
      if (error) {
        res.status(400).json({ message: error });
      } else {
        res.send(data);
      }
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Route to update admin password
app.put("/api/update-password", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    try {
      const q = "UPDATE admin SET password = ? WHERE username = ?";
      db.query(q, [password, username], (error, data) => {
        if (error) {
          res.status(400).json({ message: "Error" });
        } else {
          res.send(data);
        }
      });
    } catch {
      console.log(error);
    }
  }
});

// Route to add student
app.post("/api/add-student", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const studentId = req.body.studentId;
  const secretKey = req.body.secretKey;
  const values = [name, surname, studentId, secretKey];

  if (name && surname && studentId && secretKey) {
    try {
      const q =
        "INSERT INTO students (name,surname,studentId,secretKey) VALUES (?)";
      db.query(q, [values], (error, data) => {
        if (error) {
          res
            .status(400)
            .json({ message: "Error occured while adding a student!" });
        } else {
          res.status(200).send(data);
        }
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error occured while adding a student!" });
    }
  } else {
    res.status(400).json({ message: "Please fill the credentials!" });
  }
});

app.post("/api/assign-time", (req, res) => {
  const studentId = req.body.studentId;
  const date = req.body.date;
  const minute = req.body.minute;
  if (studentId && date && minute) {
    // First, check if the studentId exists in the table
    const checkQuery = "SELECT * FROM connectiontime WHERE studentId = ?";
    try {
      db.query(checkQuery, [studentId], (checkError, checkResult) => {
        if (checkError) {
          res
            .status(400)
            .json({ message: "Error checking studentId existence" });
        } else {
          if (checkResult.length === 0) {
            // If the studentId does not exist, insert a new record
            const insertQuery =
              "INSERT INTO connectiontime (studentId, date, minute) VALUES (?, ?, ?)";
            const values = [studentId, date, minute];
            db.query(insertQuery, values, (insertError, insertResult) => {
              if (insertError) {
                res.status(400).json({ message: "Error inserting record" });
              } else {
                res.send(insertResult);
              }
            });
          } else {
            // If the studentId exists, update the existing record
            const updateQuery =
              "UPDATE connectiontime SET date = ?, minute = ? WHERE studentId = ?";
            const updateValues = [date, minute, studentId];
            db.query(updateQuery, updateValues, (updateError, updateResult) => {
              if (updateError) {
                res.status(400).json({ message: "Error updating record" });
              } else {
                res.send(updateResult);
              }
            });
          }
        }
      });
    } catch (error) {
      throw error;
    }
  } else {
    res.status(400).json({ message: "Please fill the credentials!" });
  }
});

io.on("connection", (socket) => {
  socket.on("join-message", (roomId) => {
    socket.join(roomId);
  });
  socket.on("screen-click", (data) => {
    console.log("Screen click geldi!")
    var clickData = JSON.parse(data);

    // Extract the x and y coordinates from the parsed data
    var x = clickData.adjustedX;
    var y = clickData.adjustedY;
    var position = {
      positionX: x,
      positionY: y,
    };
    try {

      if (y < 550) {
        console.log("Masaüstüne screen click gönderildi!")
        io.emit("screen-click-received", position);
      }
    } catch (error) {
      console.log("catch");

      throw "Couldnt click!";
    }
  });

  socket.on("screen-stop-share", () => {
    try {
      io.emit("screen-stopped");
    } catch (error) {
      throw "Couldnt stopped!";
    }
  });

  socket.on("screen-right-click", (data) => {
    console.log("Screen right click geldi!")
    var clickData = JSON.parse(data);

    // Extract the x and y coordinates from the parsed data
    var x = clickData.adjustedX;
    var y = clickData.adjustedY;
    var position = {
      positionX: x,
      positionY: y,
    };
    try {
      if (y < 550) {
        console.log("Masaüstüne screen right click gönderildi!")
        io.emit("screen-right-click-received", position);
      }
    } catch (error) {
      console.log("catch right click");

      throw "Couldnt click!";
    }
  });

  socket.on("code-message", function (data) {
    console.log("Text geldi!")
    data = JSON.parse(data);
    var text = data.text;
    try {
      console.log("Masaüstüne text yollandı!")
      io.emit("textReceived", text);
    } catch (error) {
      throw "Error on text.";
    }
  });
});

var server_port = process.env.SERVER_PORT || 4000;
server.listen(server_port, () => {
  console.log("Server started at " + server_port);
});

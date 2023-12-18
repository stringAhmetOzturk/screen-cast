const { app, BrowserWindow, ipcMain } = require("electron");
const screenshot = require("screenshot-desktop");
const axios = require("axios");
const io = require("socket.io-client");
const robot = require("@jitsi/robotjs");
const fs = require("fs");
const os = require("os");
const dotenv = require("dotenv");

dotenv.config();

var requestLoop = false;
const socket = io("https://e-sets.ina-codes.eu");

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 120,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  //win.webContents.openDevTools(), win.removeMenu();
  win.loadFile("index.html");
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.whenReady().then(createWindow);

// })
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("start-share", function (event, arg) {
  requestLoop = true;
  function sendImage() {
    screenshot().then((img) => {
      const imgStr = Buffer.from(img).toString("base64");

      const obj = {
        image: imgStr,
      };
      axios

        .post("https://e-sets.ina-codes.eu/api/screen-data", JSON.stringify(obj), {
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "7f61848f8d0fae2e4fa0f0cb49e705dedb7187ca18cc63c2d9c067ad946b5cf0",
          },
        })
        .then((response) => {
          if (requestLoop && response.data === "Success") {
            setTimeout(sendImage, 100);
          }
        })
        .catch((error) => {
          console.log("Error sending image:", error);
        });
    });
  }
  if (requestLoop) {
    sendImage();
  }

  // Sunucudan gelen yanıtı dinlemek
  socket.on("textReceived", (response) => {
    console.log("textReceived")
    if (requestLoop) {
      try {
        
        const desktopPath = os.homedir() + "/Desktop";
        const outputFolderPath = desktopPath + "/output";
        const outputFilePath = outputFolderPath + "/output.ino";
        console.log(outputFilePath)
        // Eğer "output" klasörü yoksa oluştur
        if (!fs.existsSync(outputFolderPath)) {
          fs.mkdirSync(outputFolderPath);
        }

        // Dosyayı yaz
        fs.writeFileSync(outputFilePath, response, (err) => {
          if (err) {
            console.log("Error writing to file:", err);
          } else {
            console.log("Message written to output.ino");
          }
        });
      } catch (error) {
        console.error("Error on text:", error);
      }
    }
  });

  socket.on("screen-click-received", (response) => {
    console.log("screen-click-received")
    if (requestLoop) {
      try {
        // Bu, gelen pozisyonu ekranın boyutlarına göre dönüştürür
        const screenWidth = 1920; // Ekran genişliği
        const screenHeight = 1080; // Ekran yüksekliği

        const clickX = (response["positionX"] / 900) * screenWidth;
        const clickY = (response["positionY"] / 600) * screenHeight;
      
        robot.moveMouse(clickX, clickY);
        robot.mouseClick("left", false); // Bu, sol tıklamayı gerçekleştirir
        robot.mouseClick("left", false); // Bu, sol tıklamayı gerçekleştirir
        console.log("Clicked")
      } catch (error) {
        throw "Hata oluştu.";
      }
    }
  });

  socket.on("screen-right-click-received", (response) => {
    console.log("screen-right-click-received")
    if (requestLoop) {
      try {
        // Bu, gelen pozisyonu ekranın boyutlarına göre dönüştürür
        const screenWidth = 1920; // Ekran genişliği
        const screenHeight = 1080; // Ekran yüksekliği

        const clickX = (response["positionX"] / 900) * screenWidth;
        const clickY = (response["positionY"] / 600) * screenHeight;
        robot.moveMouse(clickX, clickY);
        robot.mouseClick("left", false); // Bu, sol tıklamayı gerçekleştirir
        robot.mouseClick("right", false); // This will perform a left double click
        console.log("Clicked")
      } catch (error) {
        throw "Error on text.";
      }
    }
  });
});

ipcMain.on("stop-share", function (event, arg) {
  requestLoop = false;
  socket.emit("screen-stop-share");
});

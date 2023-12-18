// preload.js (Renderer süreç için)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  startSharePreload: () => {
    ipcRenderer.send('start-share', {});
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'block';
    document.getElementById('code').innerHTML = 'Server is now broadcasting.';
  },
  stopSharePreload: () => {
    ipcRenderer.send('stop-share', {});
    document.getElementById('stop').style.display = 'none';
    document.getElementById('start').style.display = 'block';
    document.getElementById('code').innerHTML = 'Server has now stopped!';
  },
});

window.onload = function () {
  ipcRenderer.on('uuid', (event, data) => {
    document.getElementById('code').innerHTML = 'Server is now broadcasting.';
  });
};

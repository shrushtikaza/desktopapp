const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('get-songs', () => {
  const folder = path.join(__dirname, 'songs');
  const files = fs.readdirSync(folder).filter(file => file.endsWith('.mp3'));
  return files;
});

app.whenReady().then(createWindow);
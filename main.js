const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = 240;
  const winHeight = 328;

  const win = new BrowserWindow({
    title: "happy one year love <3",
    width: winWidth,
    height: winHeight,
    x: screenWidth - winWidth - 20,
    y: 50,                           
    frame: true,
    transparent: false,
    resizable: false,
    hasShadow: true,
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
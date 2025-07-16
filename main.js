const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
 
  const winWidth = 265;
  const winHeight = 380;
 
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
    icon: path.join(__dirname, 'resources', 'icon.ico'), 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
 
  win.loadFile('index.html');
}

const isDev = !app.isPackaged;
const basePath = isDev ? path.join(__dirname, 'songs') : path.join(process.resourcesPath, 'songs');

ipcMain.handle('get-songs', async () => {
  try {
    const files = fs.readdirSync(basePath).filter(file => file.endsWith('.mp3'));
    return files;
  } catch (err) {
    console.error('Error reading songs:', err);
    return [];
  }
});

ipcMain.handle('get-song-path', async (event, filename) => {
  return path.join(basePath, filename);
});

ipcMain.handle('get-image-path', async (event, filename) => {
  const imageBase = isDev ? path.join(__dirname, 'images') : path.join(process.resourcesPath, 'images');
  return path.join(imageBase, filename);
});


app.whenReady().then(() => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
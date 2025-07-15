const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
 
  const winWidth = 280;
  const winHeight = 350;
 
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

// Helper function to get resource path
function getResourcePath(relativePath) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, relativePath);
  } else {
    return path.join(__dirname, relativePath);
  }
}

ipcMain.handle('get-songs', () => {
  try {
    const folder = getResourcePath('songs');
    
    if (!fs.existsSync(folder)) {
      console.error('Songs folder not found:', folder);
      return [];
    }
    
    const files = fs.readdirSync(folder).filter(file => file.endsWith('.mp3'));
    return files;
  } catch (error) {
    console.error('Error reading songs folder:', error);
    return [];
  }
});

ipcMain.handle('get-image-path', (event, filename) => {
  try {
    const imagePath = getResourcePath(path.join('images', filename));
    
    if (fs.existsSync(imagePath)) {
      // Use file:// protocol with proper path formatting for Windows
      const fileUrl = `file://${imagePath.replace(/\\/g, '/')}`;
      return fileUrl;
    } else {
      console.error('Image not found:', imagePath);
      return null;
    }
  } catch (error) {
    console.error('Error getting image path:', error);
    return null;
  }
});

// Add handler for getting song path
ipcMain.handle('get-song-path', (event, filename) => {
  try {
    const songPath = getResourcePath(path.join('songs', filename));
    
    if (fs.existsSync(songPath)) {
      const fileUrl = `file://${songPath.replace(/\\/g, '/')}`;
      return fileUrl;
    } else {
      console.error('Song not found:', songPath);
      return null;
    }
  } catch (error) {
    console.error('Error getting song path:', error);
    return null;
  }
});

app.whenReady().then(createWindow);
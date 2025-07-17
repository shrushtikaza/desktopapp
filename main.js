const { app, BrowserWindow, ipcMain, screen, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const mime = require('mime'); 

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
    resizable: true,
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

app.whenReady().then(() => {
  protocol.handle('app-image', async (request) => {
    const imageName = decodeURIComponent(request.url.replace('app-image://', ''));
    const isDev = !app.isPackaged;
    const imageBase = isDev
      ? path.join(__dirname, 'images')
      : path.join(process.resourcesPath, 'images');
    const imagePath = path.join(imageBase, imageName);

    try {
      const data = await fs.promises.readFile(imagePath);
      return new Response(data, {
        headers: {
          'Content-Type': mime.getType(imagePath) || 'application/octet-stream'
        }
      });
    } catch (err) {
      console.error('Image fetch error:', err);
      return new Response(null, { status: 404 });
    }
  });

  createWindow();
});

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
  const imageBase = isDev
    ? path.join(__dirname, 'images')
    : path.join(process.resourcesPath, 'images');
  const requestedPath = path.join(imageBase, filename);

  if (fs.existsSync(requestedPath)) {
    return filename;
  }

  const defaultPath = path.join(imageBase, 'default.jpg');
  if (fs.existsSync(defaultPath)) {
    console.log('Using default image');
    return 'default.jpg';
  }

  console.log('No images found');
  return null;
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
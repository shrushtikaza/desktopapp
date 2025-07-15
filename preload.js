const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSongs: () => ipcRenderer.invoke('get-songs'),
  getImagePath: (filename) => ipcRenderer.invoke('get-image-path', filename),
  getSongPath: (filename) => ipcRenderer.invoke('get-song-path', filename)
});
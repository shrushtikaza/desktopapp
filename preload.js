const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSongs: () => ipcRenderer.invoke('get-songs')
});

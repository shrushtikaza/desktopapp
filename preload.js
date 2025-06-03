const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loginToSpotify: () => ipcRenderer.send("spotify-login"),
  playPlaylist: (playlistUri) => ipcRenderer.send("play-playlist", playlistUri),
  loadPage: (page) => ipcRenderer.send("load-page", page),
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loginToSpotify: () => ipcRenderer.send("spotify-login"),
  playPlaylist: (uri) => ipcRenderer.send("play-playlist", uri),
  onSpotifyAuthSuccess: (callback) => ipcRenderer.on("spotify-auth-success", callback),
  onPlaybackFailed: (callback) => ipcRenderer.on("playback-failed", callback)
});

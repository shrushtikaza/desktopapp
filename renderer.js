document.getElementById("loginBtn").addEventListener("click", () => {
    window.electronAPI.loginToSpotify();
  });
  
  document.getElementById("playBtn").addEventListener("click", () => {
    const playlistUri = "spotify:playlist:37i9dQZF1EP6YuccBxUcC1";
    window.electronAPI.playPlaylist(playlistUri);
  });
  
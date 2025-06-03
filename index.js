document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").addEventListener("click", () => {
    window.electronAPI.loginToSpotify();
  });

  document.getElementById("playBtn").addEventListener("click", () => {
    const playlistUri = "spotify:playlist:37i9dQZF1EP6YuccBxUcC1"; // change to your playlist
    window.electronAPI.playPlaylist("spotify:playlist:37i9dQZF1EJsTd4HaudjCg");
  });
});

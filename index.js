document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").addEventListener("click", () => {
    window.electronAPI.loginToSpotify();
  });

  document.getElementById("playBtn").addEventListener("click", () => {
    const playlistUri = "spotify:playlist:37i9dQZF1EJsTd4HaudjCg"; 
    window.electronAPI.playPlaylist("spotify:playlist:37i9dQZF1EJsTd4HaudjCg");
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const playBtn = document.getElementById("playBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.electronAPI.loginToSpotify();
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      const playlistUri = "spotify:playlist:37i9dQZF1EJsTd4HaudjCg";
      window.electronAPI.playPlaylist(playlistUri);
    });
  }
});

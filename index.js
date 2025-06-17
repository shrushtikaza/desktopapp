const songs = [
  { title: "Iris - The Goo Goo Dolls", file: "songs/iris - the goo goo dolls.mp3" },
  { title: "Time in a Bottle - Jim Croce", file: "songs/Time in a Bottle.mp3" }
];

let currentSongIndex = 0;

const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const volumeSlider = document.getElementById('volume');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');

function loadSong(index) {
  if (index < 0) index = 0;
  if (index >= songs.length) index = 0;
  currentSongIndex = index;
  audio.src = songs[currentSongIndex].file;
  playPauseBtn.textContent = '▶️';
  audio.load();
}

function playSong() {
  audio.play();
  playPauseBtn.textContent = '⏸️';
}

function pauseSong() {
  audio.pause();
  playPauseBtn.textContent = '▶️';
}

// Skip Forward
document.getElementById('forwardBtn').addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

// Skip Back
document.getElementById('backBtn').addEventListener('click', () => {
  if (audio.currentTime < 5 && currentSongIndex > 0) {
    currentSongIndex--;
  }
  loadSong(currentSongIndex);
  playSong();
});

// Play/Pause
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Load duration
audio.addEventListener('loadedmetadata', () => {
  totalTimeLabel.textContent = formatTime(audio.duration);
});

// Update seekbar
audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  seekBar.value = percent;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
});

// Change position
seekBar.addEventListener('input', () => {
  const time = (seekBar.value / 100) * audio.duration;
  audio.currentTime = time;
});

// Volume
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// Auto-play next song
audio.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// Initialize
loadSong(currentSongIndex);
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const volumeSlider = document.getElementById('volume');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');

document.getElementById('forwardBtn').addEventListener('click', () => {
  audio.currentTime += 10;
});

document.getElementById('backBtn').addEventListener('click', () => {
  audio.currentTime -= 10;
});

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸️';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶️';
  }
});

audio.addEventListener('loadedmetadata', () => {
  totalTimeLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  seekBar.value = percent;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
  const time = (seekBar.value / 100) * audio.duration;
  audio.currentTime = time;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener('ended', () => {
  playPauseBtn.textContent = '▶️';
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
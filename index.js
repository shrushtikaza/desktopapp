const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const volumeSlider = document.getElementById('volume');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');

let songs = [];
let currentSongIndex = 0;

window.electronAPI.getSongs().then(files => {
  if (files.length === 0) {
    alert("No songs found in the /songs folder.");
    return;
  }
  songs = files.map(f => {
    const baseName = f.replace(/\.[^/.]+$/, ""); 
    return {
      title: baseName,
      file: `songs/${f}`,
      image: `images/${baseName}.jpg` 
    };
  });  
  loadSong(currentSongIndex);
}).catch(err => {
  console.error("Error getting songs:", err);
});

function loadSong(index) {
  return new Promise(resolve => {
    if (!songs.length) return;
    audio.src = songs[index].file;
    playPauseBtn.textContent = '▶️';
    seekBar.disabled = true;
    seekBar.value = 0;
    seekBar.setAttribute('value', 0);

    const albumArt = document.getElementById('albumArt');
    albumArt.src = songs[index].image;
    albumArt.onerror = () => {
      albumArt.src = 'default.jpg'; // fallback image if not found
    };

    const onCanPlay = () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      resolve();
    };

    audio.addEventListener('canplaythrough', onCanPlay);
    audio.load();
  });
}

function playSong() {
  audio.play();
  playPauseBtn.textContent = '⏸️';
}

function pauseSong() {
  audio.pause();
  playPauseBtn.textContent = '▶️';
}

document.getElementById('forwardBtn').addEventListener('click', async () => {
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  await loadSong(currentSongIndex);
  playSong();
});

document.getElementById('backBtn').addEventListener('click', async () => {
  if (!songs.length) return;
  if (audio.currentTime < 5 && currentSongIndex > 0) {
    currentSongIndex--;
  }
  await loadSong(currentSongIndex);
  playSong();
});


playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

audio.addEventListener('loadedmetadata', () => {
  seekBar.disabled = false;
  seekBar.value = 0; 
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
  if (!songs.length) return;
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
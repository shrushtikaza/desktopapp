const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const volumeSlider = document.getElementById('volume');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');
const locationDot = document.querySelector('.location');

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
      file: f, // Just store the filename
      image: `${baseName}.jpg` // Just store the filename
    };
  });  
  loadSong(currentSongIndex);
}).catch(err => {
  console.error("Error getting songs:", err);
});

function loadSong(index) {
  return new Promise(resolve => {
    if (!songs.length) return;
    
    // Get the actual file path for the song from main process
    window.electronAPI.getSongPath(songs[index].file).then(songPath => {
      if (songPath) {
        audio.src = songPath;
      } else {
        console.error('Could not get song path for:', songs[index].file);
        return;
      }

      document.querySelector('.playicon').style.display = 'inline';
      document.querySelector('.pauseicon').style.display = 'none';

      seekBar.disabled = true;
      seekBar.value = 0;
      locationDot.style.left = `calc(0% - 6px)`; // Reset dot
      seekBar.setAttribute('value', 0);

      const albumArt = document.getElementById('albumArt');
      
      // Get the actual file path for the image
      window.electronAPI.getImagePath(songs[index].image).then(imagePath => {
        if (imagePath) {
          albumArt.src = imagePath;
          albumArt.onerror = () => {
            albumArt.src = 'default.jpg'; // fallback image if not found
          };
        } else {
          albumArt.src = 'default.jpg'; // fallback if image path not found
        }
      }).catch(() => {
        albumArt.src = 'default.jpg';
      });

      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        resolve();
      };

      audio.addEventListener('canplaythrough', onCanPlay);
      audio.load();
    }).catch(err => {
      console.error('Error loading song:', err);
    });
  });
}

function playSong() {
  audio.play();
  document.querySelector('.playicon').style.display = 'none';
  document.querySelector('.pauseicon').style.display = 'flex';
}

function pauseSong() {
  audio.pause();
  document.querySelector('.playicon').style.display = 'inline';
  document.querySelector('.pauseicon').style.display = 'none';
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

  if (!isNaN(percent)) {
    seekBar.value = percent;
    locationDot.style.left = `calc(${seekBar.value}% - 6px)`;
  }
  
  currentTimeLabel.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
  const time = (seekBar.value / 100) * audio.duration;
  audio.currentTime = time;
  locationDot.style.left = `calc(${seekBar.value}% - 6px)`;
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
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

    document.querySelector('.playicon').style.display = 'inline';
    document.querySelector('.pauseicon').style.display = 'none';

    seekBar.disabled = true;
    seekBar.value = 0;
    locationDot.style.left = `calc(0% - 6px)`; // Reset dot
    seekBar.setAttribute('value', 0);

    const albumArt = document.getElementById('albumArt');
    albumArt.src = songs[index].image;
    albumArt.onerror = () => {
      albumArt.src = 'default.jpg'; // fallback image if not found
    };
    
    window.electronAPI.getImagePath(`${songs[index].title}.jpg`).then(src => {
      albumArt.src = src;
    }).catch(() => {
      albumArt.src = 'default.jpg';
    });


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
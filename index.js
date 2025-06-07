let isConnected = false;

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const playBtn = document.getElementById('playBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  loginBtn.addEventListener('click', () => {
    loginBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      loginBtn.style.transform = '';
    }, 150);

    statusText.textContent = 'Connecting...';

    setTimeout(() => {
      window.electronAPI?.loginToSpotify?.();
      isConnected = true;
      statusDot.classList.add('connected');
      statusText.textContent = 'Connected to Spotify';
      loginBtn.innerHTML = '<span>✅</span>Connected';
      loginBtn.classList.add('btn-secondary');
      loginBtn.classList.remove('btn-primary');
    }, 1000);
  });

  playBtn.addEventListener('click', () => {
    playBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      playBtn.style.transform = '';
    }, 150);

    if (isConnected) {
      window.electronAPI?.playPlaylist?.('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M');
      playBtn.innerHTML = '<span>🎵</span>Now Playing';
      statusText.textContent = 'Playing music...';
    } else {
      statusText.textContent = 'Please connect to Spotify first';
      setTimeout(() => {
        statusText.textContent = 'Ready to connect';
      }, 2000);
    }
  });

  document.addEventListener('mousemove', (e) => {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    container.style.transform = `perspective(1000px) rotateY(${x / 50}deg) rotateX(${-y / 50}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    document.querySelector('.container').style.transform = '';
  });
});
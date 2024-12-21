// DOM Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.querySelector(".progress-container");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const playlistEl = document.getElementById("playlist");
const fileInput = document.getElementById("file-input");
const addToPlaylistBtn = document.getElementById("add-to-playlist-btn");

// Variables
let tracks = [];
let currentTrackIndex = 0;
let isPlaying = false;

// Load track into audio player
function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;

  // Highlight the active track
  document.querySelectorAll(".playlist li").forEach((item, idx) => {
    item.classList.toggle("active", idx === index);
  });
}

// Play or pause music
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

// Skip to the previous track
function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}

// Skip to the next track
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}

// Update progress bar
function updateProgress() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Update time display
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalDurationEl.textContent = formatTime(audio.duration);
}

// Seek audio
function setProgress(e) {
  const width = progressContainer.offsetWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Format time (MM:SS)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

// Handle file selection
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    tracks.push({ name: file.name, src: url });
  });
});

// Add selected files to the playlist
addToPlaylistBtn.addEventListener("click", () => {
  const startIndex = playlistEl.children.length;
  const newTracks = tracks.slice(startIndex);

  newTracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.addEventListener("click", () => {
      currentTrackIndex = startIndex + index;
      loadTrack(currentTrackIndex);
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = "⏸️";
    });
    playlistEl.appendChild(li);
  });

  // Load the first track if the playlist is empty
  if (tracks.length > 0 && audio.src === "") {
    loadTrack(0);
  }
});

// Event listeners
playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", nextTrack);

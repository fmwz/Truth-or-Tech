let currentDifficulty = null;
let allVideos = {
  easy: [
    { id: 'ai1', url: 'Videos/ai/ai1.mp4', label: 'ai', reason: 'Blurry eyes and unnatural hand motion.' },
    { id: 'ai2', url: 'Videos/ai/ai2.mp4', label: 'ai', reason: 'Strange facial flickering and inconsistent lighting.' },
    { id: 'real1', url: 'Videos/real/real1.mp4', label: 'real' },
    { id: 'real2', url: 'Videos/real/real2.mp4', label: 'real' },
    { id: 'ai3', url: 'Videos/ai/ai3.mp4', label: 'ai', reason: 'Unnatural smile and robotic movements.' },
    { id: 'real3', url: 'Videos/real/real3.mp4', label: 'real' },
    { id: 'ai4', url: 'Videos/ai/ai4.mp4', label: 'ai', reason: 'Inconsistent eye blinking and odd gestures.' },
    { id: 'real4', url: 'Videos/real/real4.mp4', label: 'real' },
    { id: 'ai5', url: 'Videos/ai/ai5.mp4', label: 'ai', reason: 'Unnatural skin texture and lighting.' },
    { id: 'real5', url: 'Videos/real/real5.mp4', label: 'real' }
  ],
  hard: [
    { id: 'ai6', url: 'Videos/ai/ai6.mp4', label: 'ai', reason: 'Subtle glitching in the background and off-sync audio.' },
    { id: 'ai7', url: 'Videos/ai/ai7.mp4', label: 'ai', reason: 'Over-smooth skin and irregular motion blur.' },
    { id: 'real6', url: 'Videos/real/real6.mp4', label: 'real' },
    { id: 'real7', url: 'Videos/real/real7.mp4', label: 'real' },
    { id: 'ai8', url: 'Videos/ai/ai8.mp4', label: 'ai', reason: 'Glassy eyes and frame blending artifacts.' },
    { id: 'real8', url: 'Videos/real/real8.mp4', label: 'real' },
    { id: 'ai9', url: 'Videos/ai/ai9.mp4', label: 'ai', reason: 'Too-perfect symmetry and robotic head movements.' },
    { id: 'real9', url: 'Videos/real/real9.mp4', label: 'real' },
    { id: 'ai10', url: 'Videos/ai/ai10.mp4', label: 'ai', reason: 'Low eyelid activity and unusual motion transitions.' },
    { id: 'real10', url: 'Videos/real/real10.mp4', label: 'real' }
  ]
};

let videos = []; // dynamic list, assigned per difficulty
let currentIndex = 0;
let score = 0;
let autoAdvanceTimer = null;
let shownAI = [];

function showDifficulty() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("difficultyScreen").style.display = "block";
}

function startGame(difficulty) {
  currentDifficulty = difficulty;
  videos = [...allVideos[difficulty]];
  currentIndex = 0;
  score = 0;
  shownAI = [];
  document.getElementById("difficultyScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  loadVideo();
  updateScore();
}

function loadVideo() {
  // clear any pending timer
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

  const video = videos[currentIndex];
  document.getElementById("videoPlayer").src = video.url;

  // reset UI
  document.getElementById("result").textContent = "";
  const toggle = document.getElementById("explanationToggle");
  const overlay = document.getElementById("explanationOverlay");
  const nextBtn = document.getElementById("nextButton");

  toggle.style.display = "none";
  overlay.style.display = "none";
  nextBtn.style.display = "none";
  nextBtn.textContent = "Next Video";
}

function makeGuess(guess) {
  const video = videos[currentIndex];
  const correct = video.label;
  const reason  = video.reason;
  const resultEl = document.getElementById("result");
  const toggle   = document.getElementById("explanationToggle");
  const overlayTxt = document.getElementById("overlayReason");
  const nextBtn  = document.getElementById("nextButton");

  if (guess === correct) {
    resultEl.textContent = "✅ Correct!";
    resultEl.style.color = "lime";
    score++;
  } else {
    resultEl.textContent = "❌ Wrong!";
    resultEl.style.color = "crimson";
  }

  if (reason) {
    overlayTxt.textContent = reason;
    toggle.style.display = "inline-block";
  }

  if (video.label === "ai" && !shownAI.find(v => v.id === video.id)) {
    shownAI.push(video);
  }

  nextBtn.style.display = "inline-block";
  autoAdvanceTimer = setTimeout(() => {
    nextVideo();
  }, 3000);

  updateScore();
}

function showOverlay() {
  // cancel auto-advance
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

  // update button to "Move On"
  const nextBtn = document.getElementById("nextButton");
  nextBtn.textContent = "Move On";

  // show overlay
  document.getElementById("explanationOverlay").style.display = "flex";
}

function hideOverlay() {
  document.getElementById("explanationOverlay").style.display = "none";
}

function updateScore() {
  document.getElementById("scoreDisplay").textContent =
    `Score: ${score}/${videos.length}`;
}

function nextVideo() {
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  currentIndex++;
  if (currentIndex >= videos.length) {
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("endScreen").style.display = "block";
  } else {
    loadVideo();
  }
}

function returnToMenu() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
}

function showGallery() {
  const list = document.getElementById("thumbnailList");
  list.innerHTML = "";
  shownAI.forEach(video => {
    const vid = document.createElement("video");
    vid.src = video.url;
    vid.setAttribute("muted", true);
    vid.setAttribute("playsinline", true);
    vid.setAttribute("preload", "metadata");
    vid.addEventListener("click", () => {
      showPlayback(video);
    });
    list.appendChild(vid);
  });
  document.getElementById("galleryOverlay").style.display = "flex";
}

function hideGallery() {
  document.getElementById("galleryOverlay").style.display = "none";
}

function hideLearn(){
  document.getElementById("learnOverlay").style.display = "none";
}

function showPlayback(video) {
  const player = document.getElementById("playbackVideo");
  const reason = document.getElementById("playbackReason");
  player.src = video.url;
  reason.textContent = video.reason || "No explanation provided.";
  document.getElementById("playbackOverlay").style.display = "flex";
}

function hidePlayback() {
  document.getElementById("playbackOverlay").style.display = "none";
  const player = document.getElementById("playbackVideo");
  player.pause();
  player.currentTime = 0;
}

// initialize
window.onload = () => {
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("difficultyScreen").style.display = "none";
};

const videos = [
  { id: 'ai1', url: 'videos/ai/ai1.mp4', label: 'ai', reason: 'Blurry eyes and unnatural hand motion.' },
  { id: 'ai2', url: 'videos/ai/ai2.mp4', label: 'ai', reason: 'Strange facial flickering and inconsistent lighting.' },
  { id: 'real1', url: 'videos/real/real1.mp4', label: 'real' },
  { id: 'real2', url: 'videos/real/real2.mp4', label: 'real' },
  { id: 'ai3', url: 'videos/ai/ai3.mp4', label: 'ai', reason: 'Unnatural smile and robotic movements.' },
  { id: 'real3', url: 'videos/real/real3.mp4', label: 'real' },
  { id: 'ai4', url: 'videos/ai/ai4.mp4', label: 'ai', reason: 'Inconsistent eye blinking and odd gestures.' },
  { id: 'real4', url: 'videos/real/real4.mp4', label: 'real' },
  { id: 'ai5', url: 'videos/ai/ai5.mp4', label: 'ai', reason: 'Unnatural skin texture and lighting.' },
  { id: 'real5', url: 'videos/real/real5.mp4', label: 'real' }
];

let currentIndex = 0;
let score = 0;
let autoAdvanceTimer = null;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  currentIndex = 0;
  score = 0;
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
  const correct = videos[currentIndex].label;
  const reason  = videos[currentIndex].reason;
  const resultEl = document.getElementById("result");
  const toggle   = document.getElementById("explanationToggle");
  const overlayTxt = document.getElementById("overlayReason");
  const nextBtn  = document.getElementById("nextButton");

  // show correct/wrong
  if (guess === correct) {
    resultEl.textContent = "✅ Correct!";
    resultEl.style.color = "lime";
    score++;
  } else {
    resultEl.textContent = "❌ Wrong!";
    resultEl.style.color = "crimson";
  }

  // if there's an explanation, show the toggle
  if (reason) {
    overlayTxt.textContent = reason;
    toggle.style.display = "inline-block";
  }

  // show Next Video button and schedule auto-advance
  nextBtn.style.display = "inline-block";
  autoAdvanceTimer = setTimeout(() => {
    nextVideo();
  }, 3000);

  updateScore();
}

function showOverlay() {
  // cancel auto-advance
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

  // update button to “Move On”
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
  // clear any timer just in case
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

  currentIndex++;
  if (currentIndex >= videos.length) {
    alert(`Game Over! Final score: ${score}/${videos.length}`);
    startGame();
  } else {
    loadVideo();
  }
}

let shownAI = [];

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

// Modify makeGuess to track shown AI videos
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

// initialize
window.onload = () => {
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("gameContainer").style.display = "none";
};

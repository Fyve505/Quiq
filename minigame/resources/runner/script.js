// resources/runner/script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

let gameInterval, scoreInterval;
let player, obstacles, powerUps, score, highScore;
let keys = {};
let grounded = true;
let activePowerUps = {};
let paused = false;
let gameRunning = false;

// Load sounds
const sndJump = document.getElementById("sound-jump");
const sndPickup = document.getElementById("sound-pickup");
const sndGameover = document.getElementById("sound-gameover");

function resetGame() {
  player = { x: 50, y: 300, w: 40, h: 40, vy: 0, crouching: false };
  obstacles = [];
  powerUps = [];
  score = 0;
  grounded = true;
  activePowerUps = {};
  paused = false;
  gameRunning = true;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("lost-screen").style.display = "none";
  gameInterval = setInterval(updateGame, 1000 / 60);
  scoreInterval = setInterval(() => score++, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(scoreInterval);
  sndGameover.play();
  document.getElementById("final-score").innerText = score;
  highScore = Math.max(score, getHighScore());
  setHighScore(highScore);
  document.getElementById("high-score").innerText = highScore;
  document.getElementById("lost-screen").style.display = "flex";
}

function getHighScore() {
  return parseInt(localStorage.getItem("quiq-high-score")) || 0;
}

function setHighScore(score) {
  localStorage.setItem("quiq-high-score", score);
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  if (paused) {
    clearInterval(gameInterval);
    clearInterval(scoreInterval);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px sans-serif";
    ctx.fillText("Paused", canvas.width / 2 - 50, canvas.height / 2);
  } else {
    gameInterval = setInterval(updateGame, 1000 / 60);
    scoreInterval = setInterval(() => score++, 1000);
  }
}

function isActive(type) {
  return activePowerUps[type] && Date.now() < activePowerUps[type];
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = isActive("shield") ? "#0ff" : "#fff";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Gravity and jumping
  player.vy += 1.0; // Reduced gravity for more air time
  player.y += player.vy;
  if (player.y >= 300) {
    player.y = 300;
    player.vy = 0;
    grounded = true;
    if (!isActive("doubleJump")) doubleJumpUsed = false;
  }

  // Crouch
  if (keys["ArrowDown"] || keys["s"]) {
    player.h = 20;
    player.crouching = true;
  } else {
    player.h = 40;
    player.crouching = false;
  }

  // Obstacles (reduced spawn rate)
  if (Math.random() < 0.01) {
    const type = Math.floor(Math.random() * 3);
    let obstacle = { x: 800, w: 30, h: 30, y: 300 };
    if (type === 1) obstacle.y = 250;
    else if (type === 2) obstacle.y = 340;
    obstacles.push(obstacle);
  }

  ctx.fillStyle = "red";
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= isActive("slowMo") ? 2 : 4;
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    if (
      obs.x < player.x + player.w &&
      obs.x + obs.w > player.x &&
      obs.y < player.y + player.h &&
      obs.y + obs.h > player.y
    ) {
      if (isActive("shield")) obstacles.splice(i, 1);
      else endGame();
    }
    if (obs.x + obs.w < 0) obstacles.splice(i, 1);
  }

  // Power-ups (reduced spawn rate)
  if (Math.random() < 0.005) {
    const types = ["doubleJump", "shield", "slowMo"];
    const type = types[Math.floor(Math.random() * types.length)];
    powerUps.push({ x: 800, y: 250, w: 30, h: 30, type });
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    p.x -= 3;
    const img = new Image();
    img.src = `resources/runner/image/${p.type}.webp`;
    ctx.drawImage(img, p.x, p.y, p.w, p.h);
    if (
      p.x < player.x + player.w &&
      p.x + p.w > player.x &&
      p.y < player.y + player.h &&
      p.y + p.h > player.y
    ) {
      sndPickup.play();
      activePowerUps[p.type] = Date.now() + 10000;
      powerUps.splice(i, 1);
    }
    if (p.x + p.w < 0) powerUps.splice(i, 1);
  }

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "16px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);

  // Show active power-ups
  let y = 40;
  for (const [key, endTime] of Object.entries(activePowerUps)) {
    if (Date.now() < endTime) {
      const timeLeft = Math.ceil((endTime - Date.now()) / 1000);
      ctx.fillText(`${key} (${timeLeft}s)`, 10, y);
      y += 20;
    }
  }
}

// Controls
let doubleJumpUsed = false;
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    togglePause();
    return;
  }
  keys[e.key] = true;
  if ((e.key === "w" || e.key === "ArrowUp" || e.key === "space") && (grounded || (isActive("doubleJump") && !doubleJumpUsed))) {
    player.vy = -22; // Increased jump strength
    sndJump.play();
    if (!grounded && isActive("doubleJump")) doubleJumpUsed = true;
    grounded = false;
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.getElementById("start-btn").onclick = resetGame;
document.getElementById("restart-btn").onclick = resetGame;

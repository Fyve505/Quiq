const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const startScreen = document.getElementById('start-screen');
const lostScreen = document.getElementById('lost-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreEl = document.getElementById('final-score');
const highScoreEl = document.getElementById('high-score');

const jumpSound = document.getElementById('sound-jump');
const pickupSound = document.getElementById('sound-pickup');
const gameoverSound = document.getElementById('sound-gameover');

let player, obstacles, powerUps, score, highScore, isGameOver, gameSpeed, keys, timer;

function resetGame() {
  player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    vy: 0,
    grounded: true,
    crouching: false,
    doubleJump: false,
    shield: false,
    slowMo: false,
    powerTimers: {}
  };
  obstacles = [];
  powerUps = [];
  score = 0;
  gameSpeed = 3;
  keys = {};
  isGameOver = false;
  timer = 0;
}

function applyPowerUp(type) {
  switch(type) {
    case 'doubleJump':
      player.doubleJump = true;
      setTimeout(() => player.doubleJump = false, 8000);
      break;
    case 'shield':
      player.shield = true;
      setTimeout(() => player.shield = false, 8000);
      break;
    case 'slowMo':
      gameSpeed = 1.5;
      setTimeout(() => gameSpeed = 3, 8000);
      break;
  }
  pickupSound.play();
}

function spawnObstacle() {
  const types = ['ground', 'air', 'underground'];
  const type = types[Math.floor(Math.random() * types.length)];
  let y;
  switch(type) {
    case 'ground': y = 320; break;
    case 'air': y = 200; break;
    case 'underground': y = 350; break;
  }
  obstacles.push({ x: 850, y, width: 30, height: 30 });
}

function spawnPowerUp() {
  const types = ['doubleJump', 'shield', 'slowMo'];
  const type = types[Math.floor(Math.random() * types.length)];
  const y = Math.random() < 0.5 ? 200 : 320;
  powerUps.push({ x: 850, y, width: 30, height: 30, type });
}

function gameLoop() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update score
  score += 1 / 60;
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30);

  // Player controls
  if ((keys['ArrowUp'] || keys['w']) && player.grounded) {
    player.vy = -10;
    player.grounded = false;
    jumpSound.play();
  } else if ((keys['ArrowUp'] || keys['w']) && player.doubleJump && !player.grounded) {
    player.vy = -10;
    player.doubleJump = false;
    jumpSound.play();
  }
  if (keys['ArrowDown'] || keys['s']) {
    player.crouching = true;
    player.height = 20;
  } else {
    player.crouching = false;
    player.height = 40;
  }

  // Gravity
  player.vy += 0.5;
  player.y += player.vy;
  if (player.y >= 300) {
    player.y = 300;
    player.vy = 0;
    player.grounded = true;
  }

  // Draw player
  ctx.fillStyle = player.shield ? '#0ff' : '#0f0';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Move and draw obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;
    ctx.fillStyle = '#f00';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    // Collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      if (player.shield) {
        obstacles.splice(i, 1);
        player.shield = false;
      } else {
        endGame();
      }
    }
    if (obs.x < -50) obstacles.splice(i, 1);
  }

  // Move and draw powerUps
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    p.x -= gameSpeed;
    const img = new Image();
    img.src = `resources/runner/image/${p.type}.webp`;
    ctx.drawImage(img, p.x, p.y, p.width, p.height);
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y
    ) {
      applyPowerUp(p.type);
      powerUps.splice(i, 1);
    }
    if (p.x < -50) powerUps.splice(i, 1);
  }

  // Timed events
  if (timer % 90 === 0) spawnObstacle();
  if (timer % 300 === 0) spawnPowerUp();
  timer++;

  requestAnimationFrame(gameLoop);
}

function endGame() {
  isGameOver = true;
  gameoverSound.play();
  finalScoreEl.textContent = Math.floor(score);
  highScore = Math.max(score, localStorage.getItem('runner-quiq-highscore') || 0);
  localStorage.setItem('runner-quiq-highscore', highScore);
  highScoreEl.textContent = Math.floor(highScore);
  lostScreen.classList.add('show');
}

startBtn.onclick = () => {
  startScreen.classList.remove('show');
  resetGame();
  requestAnimationFrame(gameLoop);
};

restartBtn.onclick = () => {
  lostScreen.classList.remove('show');
  resetGame();
  requestAnimationFrame(gameLoop);
};

document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

// Show start screen on load
window.onload = () => {
  startScreen.classList.add('show');
};

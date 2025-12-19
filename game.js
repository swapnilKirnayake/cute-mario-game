const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================= PLAYER =================
const player = {
  x: 40,
  y: 200,
  width: 40,
  height: 40,
  speed: 4,
  dy: 0,
  gravity: 0.6,
  jumpPower: -11,
  grounded: false,
  facing: "right",
  image: new Image()
};

player.image.src = "assets/girl.png";

// ================= PLATFORMS =================
const platforms = [
  { x: 0, y: 270, width: 600, height: 30 },     // ground
  { x: 120, y: 220, width: 100, height: 12 },
  { x: 260, y: 180, width: 100, height: 12 },
  { x: 400, y: 140, width: 100, height: 12 }
];

// ================= HEARTS =================
const hearts = [
  { x: 150, y: 190, size: 14, collected: false },
  { x: 290, y: 150, size: 14, collected: false },
  { x: 430, y: 110, size: 14, collected: false }
];

let score = 0;
let gameWon = false;

// ================= FINISH FLAG =================
const flag = {
  x: 560,
  y: 80,
  width: 10,
  height: 190
};

// ================= CONTROLS =================
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

//================TOuch Controls=================
// Touch controls
document.getElementById("left").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
document.getElementById("left").addEventListener("touchend", () => keys["ArrowLeft"] = false);

document.getElementById("right").addEventListener("touchstart", () => keys["ArrowRight"] = true);
document.getElementById("right").addEventListener("touchend", () => keys["ArrowRight"] = false);

document.getElementById("jump").addEventListener("touchstart", () => {
  if (player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

// ================= UPDATE =================
function update() {
  if (gameWon) return;

  if (keys["ArrowRight"]) {
    player.x += player.speed;
    player.facing = "right";
  }
  if (keys["ArrowLeft"]) {
    player.x -= player.speed;
    player.facing = "left";
  }

  if (keys["Space"] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }

  player.dy += player.gravity;
  player.y += player.dy;
  player.grounded = false;

  // Platform collision
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height <= p.y + 10 &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  });

  // Collect hearts
  hearts.forEach(h => {
    if (!h.collected &&
      player.x < h.x + h.size &&
      player.x + player.width > h.x &&
      player.y < h.y + h.size &&
      player.y + player.height > h.y
    ) {
      h.collected = true;
      score++;
    }
  });

  // Win condition
  if (
    player.x < flag.x + flag.width &&
    player.x + player.width > flag.x &&
    player.y < flag.y + flag.height &&
    player.y + player.height > flag.y
  ) {
    gameWon = true;
  }

  // Screen limits
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

// ================= DRAW HEART =================
function drawHeart(x, y, size) {
  ctx.fillStyle = "#e91e63";
  ctx.beginPath();
  ctx.moveTo(x, y + size / 2);
  ctx.arc(x + size / 4, y + size / 4, size / 4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.75, y + size / 4, size / 4, 0, Math.PI * 2);
  ctx.lineTo(x + size / 2, y + size);
  ctx.fill();
}

// ================= DRAW =================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Score
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText("Hearts: " + score, 10, 20);

  // Platforms
  ctx.fillStyle = "#8d6e63";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Hearts
  hearts.forEach(h => {
    if (!h.collected) drawHeart(h.x, h.y, h.size);
  });

  // Flag
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(flag.x, flag.y, flag.width, flag.height);
  ctx.fillRect(flag.x - 10, flag.y, 20, 10);

  // Player
  ctx.save();
  if (player.facing === "left") {
    ctx.translate(player.x + player.width, player.y);
    ctx.scale(-1, 1);
    ctx.drawImage(player.image, 0, 0, player.width, player.height);
  } else {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
  }
  ctx.restore();

  // Win screen
  if (gameWon) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "26px Arial";
    ctx.fillText("Gabudi Jinkli 💖", 190, 140);

    ctx.font = "18px Arial";
    ctx.fillText("Hearts collected: " + score, 210, 175);
  }
}

// ================= LOOP =================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

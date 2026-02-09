const BOARD_SIZE = 12;
const HEARTS = 20;

const loveMessages = [
  "You make my world softer ❤️",
  "I love doing life with you 💕",
  "You’re my favorite human 🥰",
  "Every day is better with you",
  "You are my safe place 💖"
];

const game = document.getElementById("game");
const message = document.getElementById("message");


let board = [];
let revealedCount = 0;
let gameOver = false;
let cascadeTriggered = false;
let showHearts = false;

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "h") {
    showHearts = !showHearts;

    board.forEach((cell, index) => {
      const div = game.children[index];
      if (cell.heart && !cell.revealed) {
        div.textContent = showHearts ? "❤️" : "";
        div.style.opacity = showHearts ? "0.25" : "1";
      }
    });
  }
});

function openGift() {
  window.location.href = "gift.html";
}

function init() {
  cascadeTriggered = false;
  board = [];
  revealedCount = 0;
  gameOver = false;
  game.innerHTML = "";
  message.classList.add("hidden");

  createBoard();
  placeHearts();
  calculateNumbers();
  render();
}

function createBoard() {
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    board.push({
      heart: false,
      count: 0,
      revealed: false,
    });
  }
}

function placeHearts() {
  let placed = 0;
  while (placed < HEARTS) {
    const idx = Math.floor(Math.random() * board.length);
    if (!board[idx].heart) {
      board[idx].heart = true;
      placed++;
    }
  }
}

function calculateNumbers() {
  board.forEach((cell, index) => {
    if (cell.heart) return;

    const neighbors = getNeighbors(index);
    cell.count = neighbors.filter(i => board[i].heart).length;
  });
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const newRow = row + r;
      const newCol = col + c;

      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE
      ) {
        neighbors.push(newRow * BOARD_SIZE + newCol);
      }
    }
  }

  return neighbors;
}

function render() {
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.onclick = () => reveal(index);
    game.appendChild(div);
  });
}

function reveal(index) {
  const isRootClick = !board[index].revealed && !cascadeTriggered;
  if (gameOver) return;

  const cell = board[index];
  if (cell.revealed) return;

  cell.revealed = true;
  revealedCount++;

  const div = game.children[index];
  div.classList.add("revealed");

  if (cell.heart) {
    div.textContent = "💔";
    div.classList.add("heart");
    endGame(false);
    return;
  }

  if (cell.count > 0) {
    div.textContent = cell.count;
  } else {
    // Trigger love message once per cascade
    if (!cascadeTriggered) {
      cascadeTriggered = true;
      showLoveBubble();
    }

    // ✅ Add image to blank cell (once)
    if (!div.querySelector("img")) {
      const img = document.createElement("img");
      img.src = 'assets/aloo_cute.JPG';
      img.className = "blank-image";
      div.appendChild(img);
    }

    const neighbors = getNeighbors(index);
    neighbors.forEach(n => reveal(n));
  }

  if (revealedCount === BOARD_SIZE * BOARD_SIZE - HEARTS) {
    endGame(true);
  }
}

function showLoveBubble() {
  if (loveMessages.length === 0) return;

  const bubble = document.createElement("div");
  bubble.className = "love-bubble";
  bubble.textContent = loveMessages.shift();

  document.body.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 3000);
}



function endGame(won) {
  gameOver = true;

  if (won) {
    game.classList.add("hidden");
    alert("Congratulations!  Scroll down! You found all the love without hitting a broken heart! ❤️");
    const winScreen = document.getElementById("win-screen");
    winScreen.classList.remove("hidden");
  } else {
    message.classList.remove("hidden");
    message.innerHTML = "💔 Oops! You found a broken heart. Try again ❤️";
  }
}

function restartGame() {
  const winScreen = document.getElementById("win-screen");
  winScreen.classList.add("hidden");

  game.classList.remove("hidden");

  init();
}

document.getElementById("win-screen").classList.add("hidden");
game.classList.remove("hidden");


init();

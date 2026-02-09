const envelope = document.getElementById("envelope");
const card = document.getElementById("card");
const giftBtn = document.getElementById("gift-btn");
const container = document.querySelector(".container");

const letterText = `
My bebe,

You are my favorite part of every day. Everything is better when you are with me.
I love the way you laugh, care, and make life so bright.

Thank you for choosing me.
I choose you — always.

Happy Valentine’s Day ❤️
`;

let opened = false;

envelope.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  // Remove previous text/hints
  const hints = document.querySelectorAll(".hint, h1");
  hints.forEach(el => el.remove());

  // Hide envelope
  envelope.style.display = "none";

  // Show card with letter
  card.style.display = "block";
  card.classList.add("show");
  card.querySelector("p").textContent = letterText;

  // Show gift button with pulse
  giftBtn.classList.remove("hidden");
  giftBtn.classList.add("pulse");

  // Start floating hearts filling the screen
  startFloatingHearts();
});

// Redirect to gift page
giftBtn.addEventListener("click", () => {
  window.location.href = "gift_page.html"; // new page with photo + text
});

// Floating hearts continuously across entire screen
function startFloatingHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = Math.random() * 100 + "vh";
    heart.style.animationDuration = (5 + Math.random() * 3) + "s";
    heart.textContent = "💖";
    container.appendChild(heart);

    // Remove after animation finishes
    setTimeout(() => {
      if (heart.parentNode) container.removeChild(heart);
    }, 8000);
  }, 300);
}

const $ = id => document.getElementById(id);

// ----- Fill in text from config.js -----
document.title = CONFIG.title;
$("gateName").textContent = CONFIG.name;
$("wishHeadline").textContent = CONFIG.wishHeadline;
$("wishText").textContent = CONFIG.wishText;
$("signature").textContent = "From, " + CONFIG.from;
CONFIG.messages.forEach(m => { const li = document.createElement("li"); li.textContent = m; $("messages").appendChild(li); });
CONFIG.photos.forEach(src => { const img = document.createElement("img"); img.src = src; img.alt = ""; $("photos").appendChild(img); });

// ----- Confetti -----
const canvas = $("confetti"), c = canvas.getContext("2d");
let bits = [];
const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
addEventListener("resize", resize); resize();

function burst(x, y, count = 120) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
    bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, w: 6 + Math.random() * 6, h: 4 + Math.random() * 5,
      r: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 140 + Math.random() * 60,
      color: CONFIG.confettiColors[Math.floor(Math.random() * CONFIG.confettiColors.length)] });
  }
}
(function tick() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  bits = bits.filter(b => b.life > 0 && b.y < canvas.height + 20);
  bits.forEach(b => {
    b.vy += .25; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life--;
    c.save(); c.translate(b.x, b.y); c.rotate(b.r); c.fillStyle = b.color; c.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); c.restore();
  });
  requestAnimationFrame(tick);
})();

// ----- Balloons -----
function launchBalloons(n = 14) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const b = document.createElement("div");
      b.className = "balloon";
      b.style.left = Math.random() * 95 + "%";
      b.style.background = CONFIG.confettiColors[i % CONFIG.confettiColors.length];
      b.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
      b.style.animationDuration = 7 + Math.random() * 5 + "s";
      $("balloons").appendChild(b);
      setTimeout(() => b.remove(), 13000);
    }, i * 350);
  }
}

// ----- Typewriter -----
function type(el, text, speed = 70) {
  let i = 0;
  const id = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(id); }, speed);
}

// ----- Flow -----
$("openBtn").addEventListener("click", () => {
  Music.start();
  $("gate").classList.add("hidden");
  $("scene").classList.remove("hidden");
  $("muteBtn").classList.remove("hidden");
  type($("title"), CONFIG.title);
  launchBalloons();
  burst(innerWidth / 2, innerHeight / 3, 80);
});

function blowOut() {
  if ($("cake").classList.contains("out")) return;
  $("cake").classList.add("out");
  $("hint").classList.add("hidden");
  $("blowBtn").classList.add("hidden");
  $("wish").classList.remove("hidden");
  burst(innerWidth * .25, innerHeight * .6);
  burst(innerWidth * .75, innerHeight * .6);
  setTimeout(() => burst(innerWidth / 2, innerHeight * .4, 160), 400);
  launchBalloons(10);
  setTimeout(() => $("wish").scrollIntoView({ behavior: "smooth", block: "center" }), 500);
}
$("blowBtn").addEventListener("click", blowOut);
$("cake").addEventListener("click", blowOut);

$("muteBtn").addEventListener("click", e => e.currentTarget.classList.toggle("off", !Music.toggle()));

// Saves her wish to Firebase Realtime Database.
(() => {
  const form = document.getElementById("wishForm");
  const input = document.getElementById("wishInput");
  const count = document.getElementById("count");
  const btn = document.getElementById("sendBtn");
  const status = document.getElementById("wishStatus");

  let db = null;
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
  } catch (err) { console.error("Firebase init failed:", err); }

  function showEnd() {
    document.getElementById("endTitle").textContent = CONFIG.endTitle;
    document.getElementById("endText").textContent = CONFIG.endText;
    document.getElementById("endSig").textContent = "From, " + CONFIG.from;
    document.getElementById("endPage").classList.remove("hidden");
    burst(innerWidth / 2, innerHeight / 3, 160);
    launchBalloons(8);
  }
  document.getElementById("replayBtn").addEventListener("click", () => location.reload());

  const say = (msg, cls) => { status.textContent = msg; status.className = cls || ""; };
  input.addEventListener("input", () => { count.textContent = input.value.length + "/500"; });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = input.value.trim().slice(0, 500);
    if (!text) return;
    if (!db) return say("Firebase isn't set up correctly. Check js/firebase-config.js", "err");

    btn.disabled = true; say("Sending your wish to the stars...");
    try {
      await db.ref(WISHES_PATH).push({
        text,
        from: CONFIG.name,
        createdAt: firebase.database.ServerValue.TIMESTAMP   // saved as a number (ms), matches your rules
      });
      say("Your wish is on its way. ✨ Happy birthday!", "ok");
      input.value = ""; count.textContent = "0/500";
      burst(innerWidth / 2, innerHeight * .6, 140);
      setTimeout(showEnd, 1600);
    } catch (err) {
      console.error(err);
      say("Couldn't send it. Please try again.", "err");
    }
    btn.disabled = false;
  });
})();

// Happy Birthday background music.
// Uses an mp3 if CONFIG.musicFile is set, otherwise plays the tune with the Web Audio API.
const Music = (() => {
  const FREQ = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
  const TUNE = [
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
    ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2]
  ];
  const BEAT = 0.5;            // seconds per beat: lower = faster
  const LOOP_BEATS = 24;
  let ctx, master, audio, muted = false;

  function note(freq, t, dur) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle"; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.8, t + .03);
    g.gain.exponentialRampToValueAtTime(.001, t + dur * .95);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur);
  }

  function playLoop() {
    let t = ctx.currentTime + .1;
    TUNE.forEach(([n, beats]) => { note(FREQ[n], t, beats * BEAT); t += beats * BEAT; });
    setTimeout(playLoop, (LOOP_BEATS * BEAT + 1.5) * 1000);
  }

  return {
    start() {
      if (CONFIG.musicFile) {
        audio = new Audio(CONFIG.musicFile);
        audio.loop = true; audio.volume = CONFIG.volume;
        audio.play().catch(() => {});
        return;
      }
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = CONFIG.volume * .5;
      master.connect(ctx.destination);
      playLoop();
    },
    toggle() {
      muted = !muted;
      if (audio) audio.muted = muted;
      if (master) master.gain.value = muted ? 0 : CONFIG.volume * .5;
      return !muted;
    }
  };
})();

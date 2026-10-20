/* Music button + soft chime on Open.
   To use your own song: put the file at assets/audio/song.mp3 (or change SONG below).
   If no file is found, a gentle built-in music-box melody plays instead. */
(function () {
  var SONG = 'assets/audio/song.mp3';
  var VOLUME = 0.5;       // song volume, 0 to 1
  var CHIME_VOLUME = 0.07;

  var AC = window.AudioContext || window.webkitAudioContext, ctx, audio, mode = null, playing = false, timer;

  var btn = document.createElement('button');
  btn.id = 'music-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Play or pause music');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3v11.6A3.5 3.5 0 1 0 11 18V7.8l7-1.4v6.2A3.5 3.5 0 1 0 20 16V3.4z"/></svg><span class="eq"><i></i><i></i><i></i></span>';
  document.body.appendChild(btn);

  function ac() { if (!ctx && AC) ctx = new AC(); if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; }

  function tone(freq, t, dur, vol, type) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function chime() {                       // short sparkle when Open is pressed
    if (!ac()) return;
    var t = ctx.currentTime + 0.02;
    [880, 1174.7, 1568].forEach(function (f, i) { tone(f, t + i * 0.11, 0.9, CHIME_VOLUME, 'sine'); });
  }

  var MELODY = [523.3, 659.3, 784, 659.3, 698.5, 587.3, 523.3, 392, 440, 523.3, 659.3, 523.3, 587.3, 494, 523.3, 0];
  function synthLoop() {                   // fallback music-box melody
    if (!playing || mode !== 'synth') return;
    var t = ctx.currentTime + 0.05, step = 0.55;
    MELODY.forEach(function (f, i) { if (f) { tone(f, t + i * step, 1.4, 0.05, 'triangle'); tone(f * 2, t + i * step, 0.5, 0.012, 'sine'); } });
    timer = setTimeout(synthLoop, MELODY.length * step * 1000 - 100);
  }

  function setUI(on) { playing = on; btn.classList.toggle('playing', on); }

  function startSynth() { if (!ac()) return; mode = 'synth'; setUI(true); synthLoop(); }

  function start() {
    audio = new Audio(SONG); audio.loop = true; audio.volume = VOLUME;
    var p = audio.play();
    if (p && p.then) p.then(function () { mode = 'file'; setUI(true); }).catch(startSynth); else startSynth();
  }

  function toggle() {
    if (playing) {
      setUI(false);
      if (mode === 'file') audio.pause(); else { clearTimeout(timer); if (ctx) ctx.suspend(); }
    } else if (mode === 'file') { audio.play(); setUI(true); }
    else if (mode === 'synth') { ac(); setUI(true); synthLoop(); }
    else start();
  }

  btn.addEventListener('click', toggle);
  var open = document.getElementById('open');
  if (open) open.addEventListener('click', function () { chime(); setTimeout(start, 350); btn.classList.add('show'); });
  else btn.classList.add('show');
})();

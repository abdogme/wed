/* Falling flowers background. Tweak the CONFIG block to change the look. */
(function () {
  var CONFIG = {
    count: 40,          // number of flowers on desktop (phones use ~60%)
    minSize: 12,        // px
    maxSize: 26,        // px
    minSpeed: 22,       // px per second
    maxSpeed: 52,
    sway: 26,           // horizontal drift in px
    opacity: 0.3, 
    colors: [['#ffd3e0', '#f08fb0'], ['#ffe4ec', '#e873a0'], ['#ffc2d4', '#d9648f'], ['#fff0f4', '#f3a5bf']]
  };

  // If the device asks for reduced motion, keep the flowers but make them calmer.
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    CONFIG.count = Math.round(CONFIG.count * 0.7);
    CONFIG.minSpeed *= 0.6; CONFIG.maxSpeed *= 0.6; CONFIG.sway *= 0.6;
  }

  var cv = document.createElement('canvas');
  cv.id = 'petals';
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10000';
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), items = [];

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(CONFIG.count * (W < 600 ? 0.75 : 1));
    while (items.length < n) items.push(make(true));
    items.length = n;
  }

  function make(anywhere) {
    var size = rnd(CONFIG.minSize, CONFIG.maxSize);
    return {
      x: rnd(0, W), y: anywhere ? rnd(-20, H) : rnd(-60, -10),
      size: size, speed: rnd(CONFIG.minSpeed, CONFIG.maxSpeed) * (0.6 + size / CONFIG.maxSize * 0.7),
      phase: rnd(0, 6.28), freq: rnd(0.4, 1.0), rot: rnd(0, 6.28), spin: rnd(-0.9, 0.9),
      kind: Math.random() < 0.7 ? 'blossom' : 'petal',
      color: CONFIG.colors[(Math.random() * CONFIG.colors.length) | 0]
    };
  }

  function petalPath(r) {           // one rounded petal pointing up from the origin
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(r * 0.75, -r * 0.35, r * 0.6, -r * 1.05, 0, -r);
    ctx.bezierCurveTo(-r * 0.6, -r * 1.05, -r * 0.75, -r * 0.35, 0, 0);
    ctx.closePath();
  }

  function draw(p) {
    var r = p.size / 2;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.1);
    g.addColorStop(0, p.color[1]); g.addColorStop(1, p.color[0]);
    ctx.fillStyle = g;
    ctx.strokeStyle = 'rgba(190,70,115,.35)';
    ctx.lineWidth = 0.6;
    if (p.kind === 'blossom') {
      for (var i = 0; i < 5; i++) { ctx.save(); ctx.rotate(i * 1.2566); petalPath(r); ctx.fill(); ctx.stroke(); ctx.restore(); }
      ctx.fillStyle = '#f7c948';
      ctx.beginPath(); ctx.arc(0, 0, r * 0.16, 0, 6.28); ctx.fill();
    } else {
      ctx.scale(0.8, 1); petalPath(r * 1.1); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  var last = 0;
  function frame(t) {
    var dt = Math.min((t - last) / 1000 || 0, 0.05); last = t;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = CONFIG.opacity;
    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      p.y += p.speed * dt;
      p.phase += p.freq * dt;
      p.rot += p.spin * dt;
      p.x += Math.sin(p.phase) * CONFIG.sway * dt;
      if (p.y > H + 30 || p.x < -40 || p.x > W + 40) { items[i] = make(false); items[i].x = rnd(0, W); continue; }
      draw(p);
    }
    requestAnimationFrame(frame);
  }

  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
})();

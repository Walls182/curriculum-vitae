/**
 * cat.js — Pixel Art Cat Engine
 *
 * El gato se dibuja como una cuadrícula de píxeles (tile-map).
 * Cada frame es un array de strings donde:
 *   '.' = transparente
 *   Cualquier otro carácter = un color de paleta
 *
 * imageSmoothingEnabled = false garantiza píxeles nítidos (sin anti-aliasing).
 */

'use strict';

/* ══════════════════════════════════════════════════
   PALETA PIXEL ART – Cyberpunk / AI Theme
   ══════════════════════════════════════════════════ */
const PIX = {
  B: '#0d0d0d',   // negro contorno
  W: '#f0f0f8',   // blanco pelaje
  G: '#9090a8',   // gris pelaje
  D: '#484860',   // gris sombra
  Y: '#f5c87a',   // crema/cuerpo
  O: '#c8883a',   // sombra cuerpo
  P: '#ff6eb4',   // rosa nariz
  E: '#00ffcc',   // cyan neón ojos
  R: '#ff4466',   // rojo detalles
  C: '#80faff',   // cyan claro reflejos
  N: '#9b5de5',   // violeta collar
  T: '#facc15',   // amarillo tech (ZZZ)
  S: '#7c3aed',   // violeta neón speed lines
};

/* ══════════════════════════════════════════════════
   SPRITES — cada estado tiene sus frames
   Resolución: 16×16 píxeles lógicos
   ══════════════════════════════════════════════════ */

// ── IDLE: 4 frames (cola oscila, parpadeo) ──────────
const IDLE = [
  ['.....BB..BB.....', // 0
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '...BYYYYYYYYY...',
   '...BYYYYYYYYY...',
   '...BWYYYYYYYYY..',
   '...BBBB.BBBBB...',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
  ['.....BB..BB.....', // 1 – ojos cerrados
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYBBBBYBB..',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '...BYYYYYYYYY...',
   '...BYYYYYYYYY...',
   '...BWYYYYYYYYY..',
   '...BBBB.BBBBB...',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
  ['.....BB..BB.....', // 2 – cola derecha
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '...BYYYYYYYYYY..',
   '...BYYYYYYYYYYBB',
   '...BWYYYYYYYBOB.',
   '...BBBB.BBBBB...',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
  ['.....BB..BB.....', // 3 – cola izquierda
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '..BBYYYYYYYYYY..',
   'BBBYYYYYYYYYY...',
   'BOB.BWYYYYYYYYY.',
   '....BBBB.BBBBB..',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
];

// ── WALK: 4 frames ───────────────────────────────────
const WALK = [
  ['....BB..BB......', // 0
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '..BYYYYYYYYY....',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '...BYYB.BYYB....',
   '...BOB...BOB....',
   '...B......B.....'],
  ['....BB..BB......', // 1
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '..BYYYYYYYYY....',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '..B.....B.......',
   '..BOB...BOB.....',
   '...B....BOB.....'],
  ['....BB..BB......', // 2
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYYBBBBYB...',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '..BYYYYYYYYY....',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '...BYYB.BYYB....',
   '....B....BOB....',
   '....BOB..B......'],
  ['....BB..BB......', // 3
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '..BYYYYYYYYY....',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '..B.....B.......',
   '..B.....BOB.....',
   '..BOB....B......'],
];

// ── RUN: 4 frames ────────────────────────────────────
const RUN = [
  ['.....BB..BB.....', // 0
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '...BYYYYYYYYY...',
   '..BYYYYYYYYYY...',
   'BBBYYYYYYYYYY...',
   'BOB.BWYYYYYYYYY.',
   '....BBBB.BBBBB..',
   '.......BOB.BOB..',
   '.......BOB.BOB..',
   '........B...B...'],
  ['.....BB..BB.....', // 1
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYYBBBBYB..',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '...BYYYYYYYYYY..',
   '..BYYYYYYYYYYBB.',
   'BB.BYYYYYYYYYOB.',
   'BOB.BWYYYYYYYYY.',
   '....BBBB.BBBBB..',
   '........B...B...',
   '........B...B...',
   '......BOB.BOB...'],
  ['.....BB..BB.....', // 2
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '...BYYYYYYYYY...',
   '..BYYYYYYYYYYY..',
   'BB.BYYYYYYYYYY..',
   'BOB.BWYYYYYYYYY.',
   '....BBBB.BBBBB..',
   '.........BOB....',
   '..BOB....BOB....',
   '..BOB.....B.....'],
  ['.....BB..BB.....', // 3
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '...BYYYYYYYYYY..',
   '..BYYYYYYYYYYBB.',
   'BB.BYYYYYYYYYOB.',
   'BOB.BWYYYYYYYYY.',
   '....BBBB.BBBBB..',
   '.........B..B...',
   '.....BOB.B..B...',
   '.....BOB.BOB....'],
];

// ── SIT: 2 frames ────────────────────────────────────
const SIT = [
  ['....BB..BB......', // 0
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '.BYYYYYYYYYYB...',
   '.BYWYYYYYYWYB...',
   '.BYY.BYYB.YYB...',
   '.BBB.BYYB.BBB...',
   '.....BYYB.......',
   '.....BWWB.......'],
  ['....BB..BB......', // 1 – parpadeo
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYYBBBBYB...',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '.BYYYYYYYYYYB...',
   '.BYWYYYYYYWYB...',
   '.BYY.BYYB.YYB...',
   '.BBB.BYYB.BBB...',
   '.....BYYB.......',
   '.....BWWB.......'],
];

// ── SLEEP: 4 frames (respira + ZZZ flotan) ───────────
const SLEEP = [
  ['................', // 0
   '................',
   '.NNNBBBBBBBBB...',
   '..NYYY.YYYYYYY..',
   '.NYYYYY.YYYYYYYY',
   'NYYYYYYY.YYYYYYY',
   'BYYYYYYYY.YYYYYY',
   'BWYYYYY.YYYYYYY.',
   '.BYYYYYYYYYYYYB.',
   '..BBBBB.BBBBB...',
   '................',
   '..T.............',
   '..T.............',
   '.TTT............',
   '................',
   '................'],
  ['................', // 1
   '................',
   '.NNNBBBBBBBBB...',
   '..NYYY.YYYYYYY..',
   '.NYYYYY.YYYYYYYY',
   'NYYYYYYY.YYYYYYY',
   'BYYYYYYYY.YYYYYY',
   'BWYYYYY.YYYYYYY.',
   '.BYYYYYYYYYYYYB.',
   '..BBBBB.BBBBB...',
   '................',
   '......T.........',
   '......T.........',
   '.....TTT........',
   '................',
   '................'],
  ['................', // 2
   '................',
   '.NNNBBBBBBBBB...',
   '..NYYY.YYYYYYY..',
   '.NYYYYY.YYYYYYYB',
   'NYYYYYYY.YYYYYYY',
   'BYYYYYYYYY.YYYYY',
   'BWYYYYY.YYYYYYY.',
   '.BYYYYYYYYYYYYB.',
   '..BBBBB.BBBBB...',
   '...........T....',
   '...........T....',
   '..........TTT...',
   '..........T.T...',
   '................',
   '................'],
  ['................', // 3
   '................',
   '.NNNBBBBBBBBB...',
   '..NYYY.YYYYYYY..',
   '.NYYYYY.YYYYYYYY',
   'NYYYYYYY.YYYYYYY',
   'BYYYYYYYY.YYYYYY',
   'BWYYYYY.YYYYYYY.',
   '.BYYYYYYYYYYYYB.',
   '..BBBBB.BBBBB...',
   '................',
   '....T...........',
   '....T...........',
   '...TTT..........',
   '...T.T..........',
   '................'],
];

// ── WAVE: 4 frames ────────────────────────────────────
const WAVE = [
  ['....BB..BB...P..', // 0
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '..BYYYYYYYYY.BB.',
   '..BWYYYYYYYBOB..',
   '..BBBB.BBBBB....',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
  ['....BB..BB......', // 1
   '...BYYB.BYYBBB.P',
   '..BYYY...YYY.BB.',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY.B..',
   '..BYYYYYYYYY.BOB',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
  ['....BB..BB.P....', // 2
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BB.',
   '..BYYYYBBBBYB...',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY....',
   '..BYYYYYYYYYY...',
   '..BWYYYYYYYBOBB.',
   '..BBBB.BBBBB....',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
  ['....BB..BB......', // 3
   '...BYYB.BYYBBB..',
   '..BYYY...YYY.BBP',
   '..BYYYEYYYE..B..',
   '..BYYYY.YYYYB...',
   '...BYYYYYYYY....',
   '...BBYPBYYBB....',
   '....BYYYYB......',
   '...BYYYYYYBB....',
   '..BYYYYYYYYY.BB.',
   '..BYYYYYYYYY.BOB',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '.....BYYB.......',
   '.....BYYB.......',
   '.....BB.BB......'],
];

// ── JUMP: 4 frames ────────────────────────────────────
const JUMP = [
  ['.....BB..BB.....', // 0 – impulso inicial
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '...BYYYYYYYYY...',
   '..BYYYYYYYYYY...',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '...BOB.BYYB.....',
   '...BOB.BOB......',
   '....B...B.......'],
  ['.BOB.BB..BB.....',  // 1 – en el aire
   '..BB.BYYB.BYYBBB',
   '....BYYY...YYY.B',
   '....BYYYEYYYE..B',
   '....BYYYY.YYYYB.',
   '.....BYYYYYYYY..',
   '.....BBYPBYYBB..',
   '......BYYYYB....',
   '.....BYYYYYYBB..',
   '....BYYYYYYYYY..',
   '...BYYYYYYYYYY..',
   '...BWYYYYYYYYY..',
   '...BBBB.BBBBB...',
   '........BOB.....',
   '.........BOB....',
   '..........B.....'],
  ['................', // 2 – punto más alto
   '.....BB..BB.....',
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '...BYYYYYYYYY...',
   '..BYYYYYYYYYY...',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '................',
   '................'],
  ['.....BB..BB.....', // 3 – aterrizando
   '....BYYB.BYYBBB.',
   '...BYYY...YYY.BB',
   '...BYYYEYYYE..B.',
   '...BYYYY.YYYYB..',
   '....BYYYYYYYY...',
   '....BBYPBYYBB...',
   '.....BYYYYB.....',
   '....BYYYYYYBB...',
   '...BYYYYYYYYY...',
   '..BYYYYYYYYYY...',
   '..BWYYYYYYYYY...',
   '..BBBB.BBBBB....',
   '...BOB.BYYB.....',
   '....BB.BOB......',
   '......BOB.......'],
];

/* ══════════════════════════════════════════════════
   CLASE CAT PIXEL ART
   ══════════════════════════════════════════════════ */
class Cat {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} options
   *   px     – tamaño de 1 píxel lógico en px reales (default 3)
   *   state  – 'idle'|'walk'|'run'|'sit'|'sleep'|'jump'|'wave'
   *   speed  – multiplicador velocidad de animación
   *   flip   – espejo horizontal
   *   glow   – efecto neón (default true)
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.w      = canvas.width;
    this.h      = canvas.height;
    this.px     = options.px    || 3;
    this.state  = options.state || 'idle';
    this.frame  = 0;
    this.tick   = 0;
    this.speed  = options.speed || 1;
    this.flip   = options.flip  || false;
    this.glow   = options.glow  !== false;
    this.raf    = null;

    // ¡Fundamental para pixel art nítido!
    this.ctx.imageSmoothingEnabled = false;
    this._loop = this._loop.bind(this);
  }

  start() { if (!this.raf) this._loop(); }
  stop()  { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } }
  setState(s) { this.state = s; }

  /* ── Loop ─────────────────────────────────────── */
  _loop() {
    this.raf = requestAnimationFrame(this._loop);
    this.tick++;
    const interval = { run: 4, walk: 7, jump: 6, wave: 8, sleep: 22, sit: 14 }[this.state] ?? 12;
    if (this.tick % Math.max(1, Math.round(interval / this.speed)) === 0) this.frame++;
    this._render();
  }

  /* ── Render ───────────────────────────────────── */
  _render() {
    const { ctx, w, h, px } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;

    const frames = this._getFrames();
    const grid   = frames[this.frame % frames.length];
    const rows   = grid.length;
    const cols   = grid[0].length;
    const ox     = Math.floor((w - cols * px) / 2);
    const oy     = Math.floor((h - rows * px) / 2);

    ctx.save();
    if (this.flip) { ctx.translate(w, 0); ctx.scale(-1, 1); }
    const drawX = this.flip ? w - ox - cols * px : ox;

    // Glow layer (ojos E y collar N)
    if (this.glow) this._renderGlow(grid, rows, cols, px, drawX, oy);

    // Sprite principal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = grid[r][c];
        if (ch === '.') continue;
        const color = PIX[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(drawX + c * px, oy + r * px, px, px);
      }
    }

    // Scanlines CRT sutiles
    this._renderScanlines(drawX, oy, cols * px, rows * px);

    ctx.restore();
  }

  _renderGlow(grid, rows, cols, px, ox, oy) {
    const { ctx } = this;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = grid[r][c];
        if (ch !== 'E' && ch !== 'N') continue;
        const gx = ox + c * px + px / 2;
        const gy = oy + r * px + px / 2;
        const radius = px * (ch === 'E' ? 5 : 3);
        const color  = ch === 'E' ? 'rgba(0,255,200,' : 'rgba(155,93,229,';
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius);
        grad.addColorStop(0, color + '0.8)');
        grad.addColorStop(1, color + '0)');
        ctx.fillStyle = grad;
        ctx.fillRect(gx - radius, gy - radius, radius * 2, radius * 2);
      }
    }
  }

  _renderScanlines(x, y, w, h) {
    this.ctx.fillStyle = 'rgba(0,0,0,0.07)';
    for (let sy = y; sy < y + h; sy += 2) this.ctx.fillRect(x, sy, w, 1);
  }

  _getFrames() {
    return { walk: WALK, run: RUN, sit: SIT, sleep: SLEEP, jump: JUMP, wave: WAVE }[this.state] ?? IDLE;
  }
}

/* ══════════════════════════════════════════════════
   INSTANCIAS
   ══════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {

  // 1. Gato Hero
  const heroCanvas = document.getElementById('cat-canvas');
  if (heroCanvas) {
    const heroCat = new Cat(heroCanvas, { px: 6, state: 'idle', glow: true });
    heroCat.start();
    const seq = ['idle', 'sit', 'wave', 'idle', 'jump', 'idle', 'wave', 'sit', 'idle'];
    let si = 0;
    setInterval(() => { si = (si + 1) % seq.length; heroCat.setState(seq[si]); }, 2800);
    window._heroCat = heroCat;
  }

  // 2. Mini gato about
  const miniCanvas = document.getElementById('cat-mini');
  if (miniCanvas) {
    const miniCat = new Cat(miniCanvas, { px: 4, state: 'sit', glow: true });
    miniCat.start();
    const ms = ['sit', 'idle', 'wave'];
    setInterval(() => miniCat.setState(ms[Math.floor(Math.random() * ms.length)]), 3500);
  }

  // 3. Footer gato durmiendo
  const footerCanvas = document.getElementById('cat-footer');
  if (footerCanvas) {
    const footerCat = new Cat(footerCanvas, { px: 2, state: 'sleep', glow: false });
    footerCat.start();
  }

  // 4. Gato caminante overlay
  const walkCanvas = document.getElementById('cat-walk');
  const walkDiv    = document.getElementById('walking-cat');
  if (walkCanvas && walkDiv) {
    const walkCat = new Cat(walkCanvas, { px: 3, state: 'walk', glow: true });
    walkCat.start();

    let posX   = -120;
    let moving = true;

    const tick = () => {
      if (moving) {
        posX += 1.4;
        walkDiv.style.left = posX + 'px';
        if (posX > window.innerWidth + 30) {
          posX = -120;
          moving = false;
          walkCat.setState('sit');
          setTimeout(() => { walkCat.setState('walk'); moving = true; }, 11000);
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    walkDiv.style.pointerEvents = 'auto';
    walkDiv.style.cursor = 'pointer';
    walkDiv.addEventListener('mouseenter', () => { walkCat.setState('wave'); moving = false; });
    walkDiv.addEventListener('mouseleave', () => { walkCat.setState('walk'); moving = true; });

    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      if (delta > 8) {
        walkCat.setState('run');
        walkCat.speed = 1 + delta / 20;
        clearTimeout(walkCat._st);
        walkCat._st = setTimeout(() => { walkCat.setState('walk'); walkCat.speed = 1; }, 700);
      }
    }, { passive: true });
  }
});

/**
 * cat.js – Motor de animación del gato
 * Dibuja un gato pixel-art en Canvas con múltiples estados:
 *   idle, walk, run, sit, sleep, jump, wave
 */

'use strict';

/* ──────────────────────────────────────────────────
   PALETA DE COLORES
   ────────────────────────────────────────────────── */
const PALETTE = {
  body:    '#e8c99a',   // cuerpo anaranjado/crema
  dark:    '#c49a6c',   // sombras
  light:   '#f5e6cb',   // zonas claras
  black:   '#1a1a1a',   // contornos, pupilas
  eyes:    '#4ade80',   // iris verdes
  nose:    '#f472b6',   // nariz rosada
  inner:   '#f8b4bc',   // interior orejas
  belly:   '#fdf0e0',   // barriga
  stripes: '#b8814a',   // rayas
  glow:    'rgba(124,58,237,0.25)',
};

/* ──────────────────────────────────────────────────
   CLASE CAT
   ────────────────────────────────────────────────── */
class Cat {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} options
   */
  constructor(canvas, options = {}) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.w       = canvas.width;
    this.h       = canvas.height;
    this.scale   = options.scale  || 1;
    this.state   = options.state  || 'idle';   // idle | walk | run | sit | sleep | jump | wave
    this.frame   = 0;
    this.tick    = 0;
    this.speed   = options.speed  || 1;
    this.flip    = options.flip   || false;
    this.glowing = options.glow   !== false;
    this.raf     = null;
    this._loop   = this._loop.bind(this);
  }

  /* ── ciclo de renderizado ─────────────────────── */
  start() {
    if (this.raf) return;
    this._loop();
  }
  stop() {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
  }
  setState(s) { this.state = s; }

  _loop() {
    this.raf = requestAnimationFrame(this._loop);
    this.tick++;
    // Velocidad de frame según estado
    const fps = this.state === 'run' ? 4
              : this.state === 'walk' ? 6
              : this.state === 'sleep' ? 20
              : 8;
    if (this.tick % Math.round(fps / this.speed) === 0) this.frame++;
    this._render();
  }

  _render() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // Centrar y escalar
    const cx = w / 2;
    const cy = h / 2;
    ctx.translate(cx, cy);
    if (this.flip) ctx.scale(-1, 1);
    ctx.scale(this.scale, this.scale);

    if (this.state === 'idle')  this._drawIdle();
    if (this.state === 'walk')  this._drawWalk();
    if (this.state === 'run')   this._drawRun();
    if (this.state === 'sit')   this._drawSit();
    if (this.state === 'sleep') this._drawSleep();
    if (this.state === 'jump')  this._drawJump();
    if (this.state === 'wave')  this._drawWave();

    ctx.restore();
  }

  /* ── primitivas de dibujo ─────────────────────── */
  _ellipse(x, y, rx, ry, color) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  _circle(x, y, r, color) { this._ellipse(x, y, r, r, color); }
  _rect(x, y, w, h, color, r = 0) {
    const { ctx } = this;
    ctx.fillStyle = color;
    if (r) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    } else { ctx.fillRect(x, y, w, h); }
  }

  /* ── partes del cuerpo comunes ─────────────────── */
  _drawEar(x, y, flip = false) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    // oreja externa
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, -26);
    ctx.lineTo(18, -8);
    ctx.closePath();
    ctx.fillStyle = PALETTE.body;
    ctx.fill();
    // oreja interna
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(-7, -20);
    ctx.lineTo(10, -10);
    ctx.closePath();
    ctx.fillStyle = PALETTE.inner;
    ctx.fill();
    ctx.restore();
  }

  _drawHead(x, y) {
    const { ctx } = this;
    // halo glow
    if (this.glowing) {
      const g = ctx.createRadialGradient(x, y, 5, x, y, 40);
      g.addColorStop(0, 'rgba(124,58,237,0.2)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(x, y, 42, 40, 0, 0, Math.PI*2); ctx.fill();
    }
    // cabeza
    this._ellipse(x, y, 30, 28, PALETTE.body);
    // marcas
    this._stripes(x, y);
    // orejas
    this._drawEar(x - 18, y - 18);
    this._drawEar(x + 18, y - 18, true);
    // ojos (parpadeo cada ~80 frames)
    const blink = (this.frame % 80) < 3;
    this._drawEyes(x, y, blink);
    // nariz
    this._circle(x, y + 8, 4, PALETTE.nose);
    // boca
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 13);
    ctx.quadraticCurveTo(x, y + 16, x + 6, y + 13);
    ctx.strokeStyle = PALETTE.black;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // bigotes
    this._whiskers(x, y);
  }

  _drawEyes(x, y, blink) {
    const { ctx } = this;
    if (blink) {
      // ojo cerrado
      for (const dx of [-12, 12]) {
        ctx.beginPath();
        ctx.moveTo(x + dx - 7, y);
        ctx.quadraticCurveTo(x + dx, y + 5, x + dx + 7, y);
        ctx.strokeStyle = PALETTE.black; ctx.lineWidth = 2; ctx.stroke();
      }
      return;
    }
    for (const dx of [-12, 12]) {
      this._circle(x + dx, y - 2, 7, '#fff');
      this._circle(x + dx, y - 2, 5, PALETTE.eyes);
      this._circle(x + dx + 1, y - 1, 3, PALETTE.black);
      // destello
      this._circle(x + dx + 3, y - 4, 1.5, 'rgba(255,255,255,0.9)');
    }
  }

  _whiskers(x, y) {
    const { ctx } = this;
    const wy = y + 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    for (const [x1,y1,x2,y2] of [
      [x-10,wy, x-38,wy-5], [x-10,wy+3, x-38,wy+8],
      [x+10,wy, x+38,wy-5], [x+10,wy+3, x+38,wy+8],
    ]) {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
  }

  _stripes(x, y) {
    const { ctx } = this;
    ctx.strokeStyle = PALETTE.stripes;
    ctx.lineWidth = 1.5;
    for (const [dx,dy,len] of [[-8,-10,12],[-2,-14,12],[6,-10,10]]) {
      ctx.beginPath();
      ctx.moveTo(x+dx, y+dy);
      ctx.lineTo(x+dx+len, y+dy-2);
      ctx.stroke();
    }
  }

  _drawTail(x, y, angle) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    const a = angle * (Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      Math.cos(a) * 20 - 10, Math.sin(a) * 20,
      Math.cos(a) * 40 - 5,  Math.sin(a) * 40 - 20,
      Math.cos(a) * 50,      Math.sin(a) * 50 - 35,
    );
    ctx.strokeStyle = PALETTE.body;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.strokeStyle = PALETTE.dark;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  _drawPaw(x, y, angle = 0) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    this._ellipse(0, 0, 9, 6, PALETTE.body);
    this._circle(-4, 3, 3, PALETTE.dark);
    this._circle(0,  4, 3, PALETTE.dark);
    this._circle(4,  3, 3, PALETTE.dark);
    ctx.restore();
  }

  /* ══════════════════════════════════════════════
     ESTADOS DE ANIMACIÓN
     ══════════════════════════════════════════════ */

  /* ── IDLE (sentado con cola moviendose) ─────── */
  _drawIdle() {
    const bob = Math.sin(this.frame * 0.15) * 3;
    const tailAngle = Math.sin(this.frame * 0.08) * 30;
    const y = bob;
    // cuerpo
    this._ellipse(0, 20 + y, 26, 20, PALETTE.body);
    this._ellipse(0, 26 + y, 22, 14, PALETTE.belly);
    // patas delanteras
    this._ellipse(-16, 38 + y, 8, 12, PALETTE.body);
    this._ellipse(16,  38 + y, 8, 12, PALETTE.body);
    this._drawPaw(-16, 52 + y);
    this._drawPaw(16,  52 + y);
    // cola
    this._drawTail(20, 30 + y, tailAngle - 60);
    // cabeza
    this._drawHead(0, -10 + y);
  }

  /* ── WALK (camina) ───────────────────────────── */
  _drawWalk() {
    const t = this.frame * 0.3;
    const swing = Math.sin(t) * 10;
    const bob = Math.abs(Math.sin(t)) * -3;
    const tailAngle = Math.sin(t * 0.5) * 25;
    const y = bob;
    // cuerpo alargado
    this._ellipse(0, 18 + y, 30, 16, PALETTE.body);
    this._ellipse(0, 22 + y, 26, 10, PALETTE.belly);
    // patas (4 patas)
    const legF1 =  Math.sin(t) * 18;
    const legF2 = -Math.sin(t) * 18;
    const legB1 =  Math.sin(t + Math.PI) * 18;
    const legB2 = -Math.sin(t + Math.PI) * 18;
    // traseras
    this._drawLeg(-18, 28 + y, legB1, true);
    this._drawLeg( 18, 28 + y, legB2, true);
    // delanteras
    this._drawLeg(-14, 20 + y, legF1, false);
    this._drawLeg( 14, 20 + y, legF2, false);
    // cola
    this._drawTail(24, 18 + y, tailAngle - 40);
    // cabeza
    this._drawHead(0, -12 + y);
  }

  _drawLeg(x, y, angle, back) {
    const { ctx } = this;
    const len = back ? 22 : 20;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const rad = angle * (Math.PI / 180);
    const lx = Math.sin(rad) * len;
    const ly = Math.cos(rad) * len;
    ctx.lineTo(lx * 0.5, ly * 0.5 + 5);
    ctx.lineTo(lx, ly + 10);
    ctx.strokeStyle = PALETTE.body;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    this._drawPaw(lx, ly + 10);
    ctx.restore();
  }

  /* ── RUN (corre rápido) ──────────────────────── */
  _drawRun() {
    const t = this.frame * 0.5;
    const bob = Math.abs(Math.sin(t * 2)) * -5;
    const stretch = Math.abs(Math.sin(t)) * 8;
    const y = bob;
    // cuerpo estirado
    this._ellipse(0, 15 + y, 32 + stretch * 0.5, 14, PALETTE.body);
    this._ellipse(0, 20 + y, 28 + stretch * 0.5, 9, PALETTE.belly);
    // patas extendidas alternadas
    const leg = Math.sin(t);
    for (const [dx, base, sign] of [[-22, 0, 1],[22, 0, -1],[-18, -5, -1],[18, -5, 1]]) {
      this._drawLeg(dx, 20 + y, leg * 30 * sign, dx < 0);
    }
    // cola extendida atrás
    this._drawTail(28, 14 + y, -20);
    // cabeza inclinada
    this._drawHead(2, -14 + y);
    // líneas de velocidad
    const { ctx } = this;
    ctx.strokeStyle = 'rgba(124,58,237,0.4)';
    ctx.lineWidth = 1.5;
    for (const [lx, ly, ll] of [[-45, -5, 15],[-50, 5, 12],[-42, 14, 10]]) {
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - ll, ly); ctx.stroke();
    }
  }

  /* ── SIT (sentado tranquilo) ─────────────────── */
  _drawSit() {
    const bob = Math.sin(this.frame * 0.06) * 2;
    const tailAngle = Math.sin(this.frame * 0.05) * 20;
    const y = bob;
    // base cuerpo
    this._ellipse(0, 30 + y, 22, 28, PALETTE.body);
    this._ellipse(0, 34 + y, 18, 20, PALETTE.belly);
    // cola
    this._drawTail(18, 38 + y, tailAngle - 80);
    // patas dobladas
    this._rect(-28, 42 + y, 14, 10, PALETTE.body, 5);
    this._rect( 14, 42 + y, 14, 10, PALETTE.body, 5);
    this._drawPaw(-22, 54 + y);
    this._drawPaw( 22, 54 + y);
    // cabeza
    this._drawHead(0, -5 + y);
    // ojos semi-cerrados de satisfacción
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(-18, -8 + y); ctx.lineTo(-6, -8 + y);
    ctx.moveTo(6, -8 + y);   ctx.lineTo(18, -8 + y);
    ctx.strokeStyle = PALETTE.black; ctx.lineWidth = 2.5; ctx.stroke();
  }

  /* ── SLEEP (durmiendo con ZZZ) ───────────────── */
  _drawSleep() {
    const breathe = Math.sin(this.frame * 0.04) * 2;
    const y = breathe;
    // cuerpo acostado
    this._ellipse(0, 30 + y, 40, 16 + breathe * 0.5, PALETTE.body);
    this._ellipse(0, 30 + y, 34, 11, PALETTE.belly);
    // cola encima
    const tailAngle = Math.sin(this.frame * 0.04) * 10 - 10;
    this._drawTail(30, 28 + y, tailAngle + 10);
    // cabeza inclinada
    const { ctx } = this;
    ctx.save();
    ctx.translate(0, 0 + y);
    ctx.rotate(-0.2);
    this._drawHead(0, 0);
    // ojos cerrados
    ctx.beginPath();
    ctx.moveTo(-19, 0); ctx.lineTo(-7, 0);
    ctx.moveTo(7, 0);   ctx.lineTo(19, 0);
    ctx.strokeStyle = PALETTE.black; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    // ZZZ flotantes
    const zAlpha = (Math.sin(this.frame * 0.05) + 1) * 0.5;
    for (const [zx, zy, sz, alpha] of [
      [35, -30, 14, zAlpha],
      [48, -48, 18, zAlpha * 0.7],
      [58, -70, 22, zAlpha * 0.4],
    ]) {
      ctx.font = `bold ${sz}px 'Fira Code', monospace`;
      ctx.fillStyle = `rgba(124,58,237,${alpha})`;
      ctx.fillText('z', zx, zy + breathe * 2);
    }
  }

  /* ── JUMP (saltando) ─────────────────────────── */
  _drawJump() {
    const t = (this.frame % 40) / 40;
    const jumpY = -Math.sin(t * Math.PI) * 40;
    const stretch = Math.sin(t * Math.PI) * 5;
    const y = jumpY;
    // sombra en el suelo
    const shadowAlpha = 1 - Math.abs(jumpY) / 45;
    this._ellipse(0, 70, 30 + stretch, 6, `rgba(0,0,0,${shadowAlpha * 0.4})`);
    // cuerpo
    this._ellipse(0, 20 + y, 26, 18 - stretch * 0.3, PALETTE.body);
    this._ellipse(0, 24 + y, 22, 12, PALETTE.belly);
    // patas extendidas en el salto
    for (const [dx, dy] of [[-20, 30],[-10, 42],[10, 42],[20, 30]]) {
      this._ellipse(dx, dy + y, 7, 5, PALETTE.body);
    }
    this._drawPaw(-22, 38 + y, -0.3);
    this._drawPaw(-10, 50 + y);
    this._drawPaw(10,  50 + y);
    this._drawPaw(22,  38 + y, 0.3);
    // cola hacia arriba
    this._drawTail(20, 18 + y, -100);
    // cabeza
    this._drawHead(0, -12 + y);
    // estrellas al aterrizar
    if (t > 0.85) {
      const { ctx } = this;
      ctx.font = '18px serif';
      for (const [sx, sy, se] of [[-30, 60, '✨'],[30, 58, '⭐'],[0, 65, '💫']]) {
        ctx.globalAlpha = (1 - t) * 10;
        ctx.fillText(se, sx, sy);
      }
      ctx.globalAlpha = 1;
    }
  }

  /* ── WAVE (saludar) ──────────────────────────── */
  _drawWave() {
    const bob = Math.sin(this.frame * 0.1) * 3;
    const waveAngle = Math.sin(this.frame * 0.2) * 25;
    const y = bob;
    // cuerpo
    this._ellipse(0, 20 + y, 26, 20, PALETTE.body);
    this._ellipse(0, 26 + y, 22, 14, PALETTE.belly);
    // cola
    this._drawTail(20, 28 + y, Math.sin(this.frame * 0.15) * 30 - 60);
    // pata izquierda normal
    this._ellipse(-16, 38 + y, 8, 12, PALETTE.body);
    this._drawPaw(-16, 52 + y);
    // pata derecha levantada saludando
    const { ctx } = this;
    ctx.save();
    ctx.translate(18, 10 + y);
    ctx.rotate(waveAngle * Math.PI / 180 - 0.8);
    this._ellipse(0, 0, 7, 20, PALETTE.body);
    this._drawPaw(0, 22, 0.2);
    ctx.restore();
    // cabeza con expresión feliz
    this._drawHead(0, -12 + y);
    // corazones flotantes
    const { ctx: c } = this;
    c.font = '14px serif';
    c.globalAlpha = 0.5 + Math.sin(this.frame * 0.15) * 0.5;
    c.fillText('♥', 30, -25 + bob);
    c.fillText('♥', 42, -38 + bob * 1.5);
    c.globalAlpha = 1;
  }
}

/* ──────────────────────────────────────────────────
   INSTANCIAS DE GATOS
   ────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {

  /* 1) Gato principal en el hero */
  const heroCanvas = document.getElementById('cat-canvas');
  if (heroCanvas) {
    const heroCat = new Cat(heroCanvas, { scale: 1.5, state: 'idle', glow: true });
    heroCat.start();

    // Cambia estado según tiempo
    let heroStates = ['idle','sit','wave','idle','idle','jump','idle','sit'];
    let heroIdx = 0;
    setInterval(() => {
      heroIdx = (heroIdx + 1) % heroStates.length;
      heroCat.setState(heroStates[heroIdx]);
    }, 3000);

    window._heroCat = heroCat;
  }

  /* 2) Mini gato en tarjeta de about */
  const miniCanvas = document.getElementById('cat-mini');
  if (miniCanvas) {
    const miniCat = new Cat(miniCanvas, { scale: 0.9, state: 'sit', glow: false });
    miniCat.start();
    setInterval(() => {
      const states = ['sit','idle','wave'];
      miniCat.setState(states[Math.floor(Math.random() * states.length)]);
    }, 4000);
  }

  /* 3) Gato del footer */
  const footerCanvas = document.getElementById('cat-footer');
  if (footerCanvas) {
    const footerCat = new Cat(footerCanvas, { scale: 0.55, state: 'sleep', glow: false });
    footerCat.start();
  }

  /* 4) Gato caminante (overlay en pantalla) */
  const walkCanvas = document.getElementById('cat-walk');
  const walkingDiv = document.getElementById('walking-cat');
  if (walkCanvas && walkingDiv) {
    const walkCat = new Cat(walkCanvas, { scale: 0.7, state: 'walk', glow: true });
    walkCat.start();

    let posX = -120;
    let goingRight = true;
    let isWalking = true;
    let pauseTimeout = null;

    function moveWalkingCat() {
      if (!isWalking) return;
      const vw = window.innerWidth;
      const speed = goingRight ? 1.5 : -1.5;
      posX += speed;
      walkingDiv.style.left = posX + 'px';
      walkCat.flip = !goingRight;

      if (goingRight && posX > vw + 20) {
        // salió por la derecha → pausa y luego vuelve por la izquierda
        isWalking = false;
        posX = -120;
        walkCat.setState('sit');
        clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => {
          goingRight = true;
          walkCat.setState('walk');
          isWalking = true;
        }, 12000);
      }
      requestAnimationFrame(moveWalkingCat);
    }
    requestAnimationFrame(moveWalkingCat);

    // Al hacer hover el usuario, el gato saluda
    walkingDiv.style.pointerEvents = 'auto';
    walkingDiv.addEventListener('mouseenter', () => {
      walkCat.setState('wave');
      isWalking = false;
    });
    walkingDiv.addEventListener('mouseleave', () => {
      walkCat.setState('walk');
      isWalking = true;
      requestAnimationFrame(moveWalkingCat);
    });

    // El gato reacciona al scroll: camina más rápido
    let scrollVel = 0;
    let lastScroll = window.scrollY;
    window.addEventListener('scroll', () => {
      const diff = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      scrollVel = diff;
      if (diff > 5) {
        walkCat.setState(diff > 20 ? 'run' : 'walk');
        walkCat.speed = 1 + diff / 20;
        clearTimeout(walkCat._scrollTimer);
        walkCat._scrollTimer = setTimeout(() => {
          walkCat.setState('walk');
          walkCat.speed = 1;
        }, 600);
      }
    }, { passive: true });
  }
});

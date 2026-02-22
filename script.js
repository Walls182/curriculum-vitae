/**
 * script.js – Interactividad principal de la hoja de vida
 * • Cursor personalizado
 * • Navbar sticky
 * • Typing effect
 * • Reveal on scroll (IntersectionObserver)
 * • Skill bars animados
 * • Contadores animados
 * • Partículas flotantes
 * • Menú hamburguesa
 * • Formulario de contacto
 */

'use strict';

/* ════════════════════════════════════════════════
   1. CURSOR PERSONALIZADO
   ════════════════════════════════════════════════ */
const cursor       = document.querySelector('.cursor');
const cursorFollow = document.querySelector('.cursor-follower');

if (cursor && cursorFollow) {
  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    cursorFollow.style.left = fx + 'px';
    cursorFollow.style.top  = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, input, textarea, .tool-badge, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
  });
}

/* ════════════════════════════════════════════════
   2. NAVBAR STICKY
   ════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ════════════════════════════════════════════════
   3. MENÚ HAMBURGUESA
   ════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ════════════════════════════════════════════════
   4. TYPING EFFECT
   ════════════════════════════════════════════════ */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Ingeniero de Sistemas 💻',
  'Backend Developer ⚙️',
  'Machine Learning Engineer 🤖',
  'ETL & Data Pipelines 📊',
  'Automatización con Sensores �',
  'Cat Supervisor Employee 🐱',
];

let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      typingDelay = 2000; // pausa al final
    } else {
      typingDelay = 90 + Math.random() * 40;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      typingDelay = 400;
    } else {
      typingDelay = 45;
    }
  }
  setTimeout(typeEffect, typingDelay);
}
setTimeout(typeEffect, 1200);

/* ════════════════════════════════════════════════
   5. REVEAL ON SCROLL
   ════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      // Contadores
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el);
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// También activar skill bars dentro de elementos ya visibles
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 300);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ════════════════════════════════════════════════
   6. CONTADOR ANIMADO
   ════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// Detectar los stat-numbers con IntersectionObserver
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

/* ════════════════════════════════════════════════
   7. PARTÍCULAS FLOTANTES (HERO)
   ════════════════════════════════════════════════ */
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  const colors = ['#7c3aed','#a855f7','#06b6d4','#10b981','#f59e0b'];
  const totalParticles = 25;

  for (let i = 0; i < totalParticles; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = 2 + Math.random() * 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left  = Math.random() * 100;
    const delay = Math.random() * 15;
    const dur   = 8 + Math.random() * 12;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    particlesContainer.appendChild(p);
  }
}

/* ════════════════════════════════════════════════
   8. FORMULARIO DE CONTACTO (Formspree)
   El form tiene action/method nativos → Formspree
   maneja el envío. Solo validamos antes de submitir.
   ════════════════════════════════════════════════ */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      e.preventDefault();
      showToast('⚠️ Por favor completa todos los campos', 'warn');
      return;
    }
    // Si los campos están OK, el form se envía nativamente a Formspree
    showToast('🐱 Enviando mensaje…', 'success');
  });
}

/* ════════════════════════════════════════════════
   9. TOAST NOTIFICATIONS
   ════════════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? '#10b981' : type === 'warn' ? '#f59e0b' : '#7c3aed'};
    color: #fff;
    padding: 0.9rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    z-index: 9999;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 320px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 10);
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ════════════════════════════════════════════════
   10. SMOOTH SCROLL EN LINKS
   ════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════
   11. ACTIVE NAV LINK según sección visible
   ════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navA     = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navA.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ════════════════════════════════════════════════
   12. PARALLAX LIGERO EN HERO
   ════════════════════════════════════════════════ */
const heroSection = document.getElementById('hero');
window.addEventListener('scroll', () => {
  if (!heroSection) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroSection.style.backgroundPositionY = `${scrollY * 0.3}px`;
  }
}, { passive: true });

/* ════════════════════════════════════════════════
   13. EASTER EGG: KONAMI CODE → el gato baila
   ════════════════════════════════════════════════ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      if (window._heroCat) {
        window._heroCat.setState('jump');
        showToast('🎉 ¡Konami Code! El gato está muy emocionado 🐱✨', 'success');
        setTimeout(() => window._heroCat.setState('wave'), 2000);
        setTimeout(() => window._heroCat.setState('idle'), 5000);
      }
    }
  } else {
    konamiIdx = 0;
  }
});

/* ════════════════════════════════════════════════
   14. TOOL BADGES – hover con clase active
   ════════════════════════════════════════════════ */
document.querySelectorAll('.tool-badge').forEach(badge => {
  badge.addEventListener('click', () => {
    badge.classList.toggle('active');
  });
});

/* ════════════════════════════════════════════════
   15. NAV LINK – estilo activo CSS
   ════════════════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--accent2) !important; }
.nav-links a.active::after { transform: scaleX(1) !important; }`;
document.head.appendChild(style);

/* ════════════════════════════════════════════════
   LOG DE BIENVENIDA EN CONSOLA
   ════════════════════════════════════════════════ */
console.log(`%c
 /\\_____/\\
(  o   o  )   ¡Hola! 🐾
 =( Y )=      Bienvenido al código fuente.
  )   (       Si estás leyendo esto, 
 (_)-(_)      ¡me encanta tu curiosidad!
`, 'color: #a855f7; font-family: monospace; font-size: 12px;');
console.log('%c🐱 Portfolio de Tu Nombre – %c¡Hecho con amor y JavaScript!',
  'color: #7c3aed; font-weight: bold;',
  'color: #06b6d4;');

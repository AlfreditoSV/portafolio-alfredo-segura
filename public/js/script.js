/* ═══════════════════════════════════════════
   PORTAFOLIO — ALFREDO SEGURA VARA
   JavaScript | Interactions & Animations
   ═══════════════════════════════════════════ */

'use strict';

/* ── CURSOR GLOW ─────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');

if (window.matchMedia('(min-width: 769px)').matches && cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
}

/* ── PARTICLE CANVAS ─────────────────────────────────────── */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 30 : 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 10;
      this.size  = Math.random() * 1.8 + 0.5;
      this.speedY = Math.random() * 0.4 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      const hues = [260, 195, 320];
      this.hue   = hues[Math.floor(Math.random() * hues.length)];
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();

/* ── NAVBAR ──────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const sections  = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll effects
window.addEventListener('scroll', () => {
  // Glassmorphism on scroll
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Back to top
  const btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

/* ── TYPEWRITER EFFECT ───────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const texts = [
    'Desarrollador Full Stack',
    'Especialista en Laravel',
    'Arquitecto de APIs REST',
    'Entusiasta de Livewire',
    'Builder de Soluciones',
  ];

  let textIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTime = 0;

  function type() {
    const current = texts[textIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        pauseTime = 1800;
        setTimeout(type, pauseTime);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
        pauseTime = 300;
        setTimeout(type, pauseTime);
        return;
      }
    }

    setTimeout(type, deleting ? 45 : 80);
  }

  setTimeout(type, 800);
})();

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 35);
  });
}

/* ── SKILL BARS ──────────────────────────────────────────── */
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.classList.add('animated');
  });
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  let countersAnimated = false;
  let skillsAnimated   = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Trigger counters when hero comes into view
  const heroSection = document.getElementById('hero');
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
      countersAnimated = true;
      setTimeout(animateCounters, 600);
    }
  }, { threshold: 0.3 });
  if (heroSection) counterObserver.observe(heroSection);

  // Skills bars when section comes into view
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      setTimeout(animateSkillBars, 400);
    }
  }, { threshold: 0.2 });
  if (skillsSection) skillsObserver.observe(skillsSection);
})();

/* ── BACK TO TOP ─────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth',
      });
    }
  });
});

/* ── FOOTER YEAR ─────────────────────────────────────────── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── FORM SUBMIT FEEDBACK ────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = document.getElementById('submit-contact-btn');

  contactForm.addEventListener('submit', () => {
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';
      submitBtn.disabled = true;
    }
  });
}

/* ── TECH CARD HOVER RIPPLE ──────────────────────────────── */
document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ── SCROLL PROGRESS BAR ─────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #7C3AED, #06B6D4);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();

/* ── PROJECT CARD TILT ───────────────────────────────────── */
if (window.matchMedia('(min-width: 769px)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotY   = ((e.clientX - centerX) / rect.width)  * 5;
      const rotX   = ((e.clientY - centerY) / rect.height) * -5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

/* ── PAGE LOAD ANIMATION ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

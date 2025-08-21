/* ===============================
   script.js — Formspree + Dark Mode
   =============================== */
(function () {
  'use strict';

  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const debounce = (fn, wait = 100) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; };

  // Theme (Dark/Light)
  function initTheme() {
    const btn = qs('#theme-toggle');
    const root = document.documentElement;

    // Preferred theme: localStorage > system
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    updateThemeIcon();
    btn?.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
      updateThemeIcon();
    });

    function updateThemeIcon(){
      const isDark = root.getAttribute('data-theme') === 'dark';
      const icon = qs('#theme-toggle i');
      if (!icon) return;
      icon.classList.remove('fa-moon','fa-sun');
      icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
      qs('#theme-toggle')?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      qs('#theme-toggle')?.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Navigation / Smooth scroll / Active link / Hide-on-scroll
  function initNavigation() {
    const hamburger = qs('#hamburger') || qs('.hamburger');
    const navMenu   = qs('#nav-menu') || qs('.nav-menu');
    const navbar    = qs('.navbar');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isActive);
        document.body.classList.toggle('menu-open', isActive);
        hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });

      qsa('.nav-link', navMenu).forEach(link => link.addEventListener('click', closeMenu));
      document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('active')) return;
        if (e.target.closest('.nav-container')) return;
        closeMenu();
      });
      function closeMenu(){
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }

    // Smooth scroll
    qsa('a.nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        const target = qs(id);
        if (!target) return;
        e.preventDefault();
        const offsetTop = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - 80);
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      });
    });

    // Navbar hide/show
    if (navbar) {
      let last = window.pageYOffset || 0;
      const onScroll = () => {
        const y = window.pageYOffset || 0;
        navbar.classList.toggle('scrolled', y > 100);
        navbar.style.transform = (y > last && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
        last = y;
      };
      window.addEventListener('scroll', debounce(onScroll, 16));
      onScroll();
    }

    // Active link by section
    const sections = qsa('section[id]');
    const links    = qsa('.nav-link');
    if (sections.length && links.length) {
      const onScroll = () => {
        const pos = window.scrollY + 100;
        sections.forEach(section => {
          const top = section.offsetTop, h = section.offsetHeight, id = section.getAttribute('id');
          if (pos >= top && pos < top + h) {
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
          }
        });
      };
      window.addEventListener('scroll', debounce(onScroll, 50));
      onScroll();
    }
  }

  // Reveal animations
  function initRevealAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timelineItems = qsa('.timeline-item');
    timelineItems.forEach((item, i) => item.classList.add(i % 2 === 0 ? 'slide-in-left' : 'slide-in-right'));
    qsa('.skill-category, .education-item').forEach(el => el.classList.add('fade-in'));
    qs('.about-text')?.classList.add('slide-in-left');
    qs('.about-contact')?.classList.add('slide-in-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    qsa('.fade-in, .slide-in-left, .slide-in-right').forEach(el => observer.observe(el));
  }

  // Hero typing effect
  function initTypewriter() {
    const el = qs('.hero-title');
    if (!el) return;
    const originalHTML = el.innerHTML;
    const textOnly     = el.textContent;
    el.innerHTML = '';
    let i = 0; const speed = 50;

    const type = () => {
      if (i < textOnly.length) {
        el.innerHTML += textOnly.charAt(i++);
        setTimeout(type, speed);
      } else {
        el.innerHTML = originalHTML; // restore gradient span
      }
    };
    setTimeout(type, 600);
  }

  // Contact form (Formspree AJAX)
  function initContactForm() {
    const form = qs('#contactForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const txt = btn.textContent; btn.textContent = 'Sending…'; btn.disabled = true;

      try {
        const data = new FormData(form);
        const resp = await fetch(form.getAttribute('action'), {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });

        if (resp.ok) {
          showNotification("Message sent successfully! I'll get back to you soon.", 'success');
          form.reset();
        } else {
          const err = await resp.json().catch(()=>({}));
          const msg = err?.errors?.[0]?.message || 'There was a problem sending your message. Please try again.';
          showNotification(msg, 'error');
        }
      } catch (error) {
        showNotification('Network error. Please check your connection and try again.', 'error');
      } finally {
        btn.textContent = txt; btn.disabled = false;
      }
    });
  }

  // Toast notifications
  function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close">&times;</button>
      </div>`;
    Object.assign(n.style, {
      position:'fixed', top:'20px', right:'20px', padding:'1rem 1.25rem',
      background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
      color:'#fff', borderRadius:'12px', boxShadow:'0 10px 20px rgba(0,0,0,.12)',
      zIndex:1001, transform:'translateX(100%)', transition:'transform .3s ease', maxWidth:'420px'
    });
    document.body.appendChild(n);
    requestAnimationFrame(() => n.style.transform = 'translateX(0)');
    n.querySelector('.notification-close').addEventListener('click', () => removeNotification(n));
    setTimeout(() => removeNotification(n), 5000);
  }
  function removeNotification(n){ n.style.transform='translateX(100%)'; setTimeout(()=> n.remove(), 300); }

  // Counters (single system with bounce)
  function initCounters() {
    const counters = qsa('.stat-number');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el   = entry.target;
        const raw  = el.getAttribute('data-value') || el.textContent;
        const num  = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
        const suffix = raw.replace(/[0-9.]/g,'');
        animateCounter(el, num, suffix);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
  }
  function animateCounter(el, target, suffix){
    let current = 0, steps = 50, inc = target / steps;
    const tick = () => {
      if (current < target) {
        current += inc;
        el.textContent = `${Math.floor(current)}${suffix}`;
        el.style.transform = 'scale(1.2)'; setTimeout(()=> el.style.transform='scale(1)', 100);
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${target}${suffix}`;
        el.style.transform = 'scale(1.05)'; setTimeout(()=> el.style.transform='scale(1)', 150);
      }
    };
    tick();
  }

  // Visual flair
  function initParallaxMouse(){
    const hero = qs('.hero'); const g = qs('.hero-graphic', hero);
    if (!hero || !g) return;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const mx = ((e.clientX - r.left) - r.width/2) / 50;
      const my = ((e.clientY - r.top)  - r.height/2) / 50;
      g.style.transform = `translate(${mx}px, ${my}px)`;
    });
  }
  function init3DTilt(){
    qsa('.timeline-content, .skill-category, .education-item, .about-contact, .contact-form').forEach(el => {
      el.addEventListener('mousemove', (e)=> handleTilt(e, el));
      el.addEventListener('mouseleave', ()=> resetTilt(el));
    });
  }
  function handleTilt(e, el){
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width/2, cy = r.height/2;
    const rx = (y - cy)/10, ry = (cx - x)/10;
    el.style.transform = `translateY(-10px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }
  function resetTilt(el){ el.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)'; }

  function initMagneticButtons(){
    qsa('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top  - r.height/2;
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0) scale(1)');
    });
  }

  function initSkillWave(){
    qsa('.skill-item').forEach((item, idx) => {
      item.addEventListener('mouseenter', () => { item.style.animation = `skillWave .6s ease ${idx * 50}ms`; });
      item.addEventListener('animationend', () => item.style.animation = ''; });
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initRevealAnimations();
    initTypewriter();
    initContactForm();
    initCounters();
    initParallaxMouse();
    init3DTilt();
    initMagneticButtons();
    initSkillWave();
  });
})();

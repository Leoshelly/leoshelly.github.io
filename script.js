/* ==========================================
   script.js — (fix3) Remove tilt/parallax/magnetic, faster mobile toggle
   ========================================== */
(function () {
  'use strict';

  // Ensure content shows even if JS loads late
  try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
     document.documentElement.classList.remove('no-js'); } catch(_) {}

  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const debounce = (fn, wait = 100) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; };

  /* ---------- Dark Mode ---------- */
  function initDarkMode(){
    const root = document.documentElement;
    // Work with either id; auto-inject if missing
    let toggle = document.querySelector('#darkModeToggle') || document.querySelector('#theme-toggle');

    if (!toggle) {
      const container = document.querySelector('.nav-actions') || document.querySelector('.nav-container') || document.body;
      const btnHtml = '<button id="darkModeToggle" class="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode"><i class="fa-solid fa-moon"></i></button>';
      container.insertAdjacentHTML('afterbegin', btnHtml);
      toggle = document.querySelector('#darkModeToggle');
    }

    // Initial theme: saved > system
    let saved = null;
    try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
     saved = localStorage.getItem('theme'); } catch(_) {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = (saved === 'dark' || saved === 'light') ? saved : (prefersDark ? 'dark' : 'light');

    applyTheme(initial);
    updateIcon(initial);

    // Use fast 'click' only; CSS 'touch-action:manipulation' removes delay
    toggle.addEventListener('click', () => {
      const next = (root.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark')) ? 'light' : 'dark';
      applyTheme(next);
      updateIcon(next);
      try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
     localStorage.setItem('theme', next); } catch(_) {}
    });

    function applyTheme(mode){
      // Support BOTH strategies so your existing CSS works
      root.setAttribute('data-theme', mode);
      document.body.classList.toggle('dark', mode === 'dark');
    }
    function updateIcon(mode){
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-moon','fa-sun');
        icon.classList.add(mode === 'dark' ? 'fa-sun' : 'fa-moon');
      } else {
        toggle.textContent = mode === 'dark' ? '☀️' : '🌙';
      }
      toggle.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
      toggle.setAttribute('title', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* ---------- Navigation / Smooth scroll / Active link / Hide-on-scroll ---------- */
  function initNavigation() {
    const hamburger = qs('#hamburger') || qs('.hamburger');
    const navMenu   = qs('#nav-menu') || qs('.nav-menu');
    const navbar    = qs('.navbar');

    if (hamburger && navMenu) {
      const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
      };

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

  /* ---------- Reveal animations ---------- */
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

  /* ---------- Typing effect ---------- */
  function initTypewriter()() {
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
      } else { el.innerHTML = originalHTML; }
    };
    setTimeout(type, 600);
  }

  /* ---------- Contact form (Formspree) — robust handling ---------- */
  function initContactForm() {
    const form = qs('#contactForm');
    if (!form) return;

    const submitHandler = async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const txt = btn ? btn.textContent : null;
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

      const data = new FormData(form);
      const action = form.getAttribute('action') || 'https://formspree.io/f/xeozbvjv';

      try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
    
        const resp = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' }, // ask for JSON (avoids HTML redirect)
          body: data,
          mode: 'cors',
          redirect: 'follow'
        });

        const ct = resp.headers.get('content-type') || '';
        let payload = null;
        if (ct.includes('application/json')) {
          try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
     payload = await resp.json(); } catch (_) {}
        } else if (ct.startsWith('text/')) {
          try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
     payload = await resp.text(); } catch (_) {}
        }

        const looksSuccessful =
          resp.ok ||
          resp.type === 'opaqueredirect' ||
          (typeof payload === 'string' && /ok|success|thank/i.test(payload)) ||
          (payload && (payload.ok || payload.success === true));

        if (looksSuccessful) {
          showNotification("Message sent successfully! I'll get back to you soon.", 'success');
          form.reset();
        } else {
          const reason =
            (payload && (payload.error || payload.message)) ||
            `HTTP ${resp.status}`;
          throw new Error(reason);
        }
      } catch (error) {
        console.warn('AJAX submit failed, falling back to native submit:', error);
        try {
        // --- Inject dynamic subject + reply-to for Formspree ---
        const nameVal = form.querySelector('[name="name"]')?.value?.trim() || 'Visitor';
        const userSub = form.querySelector('[name="subject"]')?.value?.trim() || '';
        const hiddenSub = form.querySelector('input[name="_subject"]');
        if (hiddenSub) hiddenSub.value = userSub ? `New message from ${nameVal}: ${userSub}` : `New message from ${nameVal}`;
        const emailVal = form.querySelector('[name="email"]')?.value?.trim();
        const replyto = form.querySelector('input[name="_replyto"]');
        if (replyto && emailVal) replyto.value = emailVal;
    
          form.removeEventListener('submit', submitHandler);
          form.submit(); // redirect to provider thank-you page
          return;
        } catch {
          showNotification('Network error. Please check your connection and try again.', 'error');
        }
      } finally {
        if (btn) { btn.textContent = txt || 'Send Message'; btn.disabled = false; }
        // Re-attach handler after a tick (in case we removed it)
        setTimeout(() => form.addEventListener('submit', submitHandler), 0);
      }
    };

    form.addEventListener('submit', submitHandler);
  }

  /* ---------- Toast notifications ---------- */
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

  /* ---------- Counters ---------- */
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
        current += inc; el.textContent = `${Math.floor(current)}${suffix}`;
        el.style.transform = 'scale(1.2)'; setTimeout(()=> el.style.transform='scale(1)', 100);
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${target}${suffix}`;
        el.style.transform = 'scale(1.05)'; setTimeout(()=> el.style.transform='scale(1)', 150);
      }
    };
    tick();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initNavigation();
    initRevealAnimations();
    initTypewriter();
    initContactForm();
    initCounters();
  });
})();
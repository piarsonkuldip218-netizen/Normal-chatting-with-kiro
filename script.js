/* ============================================
   NEXORA — Premium Interactions
   ============================================ */

(() => {
  'use strict';

  /* --------- Lucide icons --------- */
  const initIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };
  // Initial + retry once fonts/lucide is loaded
  if (document.readyState !== 'loading') initIcons();
  document.addEventListener('DOMContentLoaded', initIcons);
  window.addEventListener('load', initIcons);

  /* --------- Footer year --------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------- Nav scroll state --------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 16) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------- Mobile menu toggle --------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const closeMenu = () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      navToggle.classList.add('open');
      mobileMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    navToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  /* --------- Smooth scroll (with offset for sticky nav) --------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------- Reveal on scroll --------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger by data-delay or sibling index
          const idx = Array.from(entry.target.parentNode?.children || []).indexOf(entry.target);
          const delay = Math.min(idx * 60, 240);
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* --------- 3D tilt on cards (data-tilt) --------- */
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach((card) => {
      let rafId = null;
      const maxTilt = 6; // degrees

      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 2 * maxTilt;
        const rotX = -(y - 0.5) * 2 * maxTilt;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        });
      };
      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* --------- Cursor spotlight --------- */
  const spotlight = document.getElementById('spotlight');
  if (spotlight && isFinePointer) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let active = false;

    const activate = () => {
      if (!active) {
        spotlight.classList.add('active');
        active = true;
      }
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      activate();
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      spotlight.classList.remove('active');
      active = false;
    });

    // Smooth follow with rAF
    const tick = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      spotlight.style.left = `${curX}px`;
      spotlight.style.top = `${curY}px`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* --------- Contact form (mailto fallback) --------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const subject = `New project enquiry — ${service || 'NEXORA'}`;
      const body =
        `Hi Prastut,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Service: ${service}\n\n` +
        `Project details:\n${message}\n\n` +
        `— Sent via nexora website`;

      // Open mailto
      const mailto = `mailto:prostutkuldip218@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      // Visual success feedback
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = 'Opening your email…';
        btn.style.opacity = '0.7';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.opacity = '';
          if (window.lucide) window.lucide.createIcons();
        }, 2400);
      }
    });
  }

  /* --------- FAQ — close others when one opens --------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* --------- Magnetic effect on primary CTAs (subtle) --------- */
  if (isFinePointer) {
    document.querySelectorAll('.btn-primary').forEach((btn) => {
      const strength = 6;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --------- Parallax orbs (very subtle) --------- */
  if (isFinePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const orbs = document.querySelectorAll('.orb');
    let pmx = 0, pmy = 0;
    document.addEventListener('mousemove', (e) => {
      pmx = (e.clientX / window.innerWidth - 0.5) * 2;
      pmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const orbTick = () => {
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 8;
        orb.style.translate = `${pmx * depth}px ${pmy * depth}px`;
      });
      requestAnimationFrame(orbTick);
    };
    orbTick();
  }

})();

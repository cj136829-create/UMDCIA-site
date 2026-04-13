/* ============================================
   CIA PROGRAM — CONSUMER INSIGHT & ANALYTICS
   main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Active nav link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---- Scrolled navbar ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  const hamburger  = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn   = document.querySelector('.mobile-menu__close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('revealed'));
  }

  /* ---- Counter animation ---- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObserver.observe(c));
  }

  /* ---- Contact form handling ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const original  = submitBtn.textContent;

      // Loading state
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate async send (replace with real fetch/API call)
      setTimeout(() => {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#2a7a4b';
        submitBtn.style.opacity = '1';

        // Show success message
        const success = document.createElement('p');
        success.textContent = 'Thank you for reaching out! A member of our team will be in touch soon.';
        success.style.cssText = 'color:#2a7a4b;font-size:0.88rem;font-weight:500;margin-top:12px;text-align:center;';
        form.appendChild(success);

        // Reset after delay
        setTimeout(() => {
          form.reset();
          submitBtn.textContent = original;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          success.remove();
        }, 4000);
      }, 1200);
    });
  }

  /* ---- Smooth anchor scrolling ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Testimonial carousel (mobile) ---- */
  const carousel = document.querySelector('.testimonials-grid');
  if (carousel && window.innerWidth < 768) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    carousel.style.cssText = 'overflow-x:auto;scroll-snap-type:x mandatory;cursor:grab;-webkit-overflow-scrolling:touch;';
    carousel.querySelectorAll('.testimonial-card').forEach(card => {
      card.style.scrollSnapAlign = 'start';
      card.style.minWidth = '88vw';
    });

    carousel.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });

    ['mouseup', 'mouseleave'].forEach(evt => {
      carousel.addEventListener(evt, () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
      });
    });
  }

  /* ---- Partner logo hover pulse ---- */
  document.querySelectorAll('.partner-logo').forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.04) translateY(-2px)';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.transform = '';
    });
  });

});

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { audio } from './audio.js';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const lenis = initLenis();
  initCustomCursor();
  initMagneticElements();
  initHeroAnimations();
  initScrollReveals();
  initMarqueeVelocity();
  initTimelineTabs();
  initContactInteractions();
  initBackToTop(lenis);

  return { lenis };
}

// 1. Lenis Butter-Smooth Momentum Scrolling
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        lenis.scrollTo(href, { offset: -40, duration: 1.4 });
      }
    });
  });

  return lenis;
}

// 2. Custom Magnetic & Expressive Cursor
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorLabel = document.querySelector('.cursor-label');

  if (!cursorDot || !cursorRing) return;

  // Don't activate on touch-only devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  // Smooth lerp render loop for ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Project hover: show 'VIEW' in cursor
  document.querySelectorAll('[data-cursor-view]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('is-view-mode');
      if (cursorLabel) cursorLabel.textContent = 'EXPLORE';
      audio.playCardHover();
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('is-view-mode');
      if (cursorLabel) cursorLabel.textContent = '';
    });
  });

  // Link & button hover: grow ring
  document.querySelectorAll('a, button, .interactive-hover').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('is-hovering');
    });
  });
}

// 3. Magnetic pull on interactive buttons & pills
function initMagneticElements() {
  const magnets = document.querySelectorAll('.btn-magnetic, .logo-link');

  magnets.forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(elem, {
        x: x * 0.35,
        y: y * 0.35,
        rotation: x * 0.04,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.7,
        ease: 'elastic.out(1.2, 0.4)'
      });
    });
  });
}

// 4. Hero Typography Stagger & Preloader Logo Draw Animation
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  const preloader = document.getElementById('preloader') || document.querySelector('.preloader');
  const drawPaths = document.querySelectorAll('.preloader-draw-path');

  if (drawPaths.length > 0) {
    // Initialize strokeDasharray and strokeDashoffset to exact SVG geometry length
    drawPaths.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len
      });
    });

    // 1. Draw SVG logo paths with signature stroke animation
    tl.to(drawPaths, {
      strokeDashoffset: 0,
      duration: 1.05,
      stagger: 0.16,
      ease: 'power2.inOut'
    })
    // 2. Cross-fade fill colors (red for path-red, deep dark for path-dark)
    .to('.path-red', {
      fill: '#e60000',
      duration: 0.35,
      ease: 'power1.out'
    }, '-=0.25')
    .to('.path-dark', {
      fill: '#111111',
      duration: 0.35,
      ease: 'power1.out'
    }, '<')
    // 3. Subtle brand name reveal
    .to('.preloader-text', {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.2')
    // 4. Gentle pulse & smooth curtain fade out
    .to('.preloader-logo-wrap', {
      scale: 1.08,
      duration: 0.22,
      ease: 'power2.out'
    }, '-=0.1')
    .to(preloader, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      pointerEvents: 'none',
      onComplete: () => {
        if (preloader) preloader.style.display = 'none';
      }
    }, '+=0.1');
  } else if (preloader) {
    tl.to(preloader, {
      opacity: 0,
      duration: 0.35,
      pointerEvents: 'none',
      onComplete: () => {
        preloader.style.display = 'none';
      }
    });
  }

  // Hero title lines & badges
  tl.from('.hero-badge', { y: 24, opacity: 0, duration: 0.8 }, '-=0.2')
    .from('.hero-title-line span', {
      y: '105%',
      opacity: 0,
      stagger: 0.12,
      duration: 1.1
    }, '-=0.6')
    .from('.hero-desc', { y: 30, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('.hero-cta-group', { y: 25, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.site-header', { y: -30, opacity: 0, duration: 0.8 }, '-=0.8');
}

// 5. ScrollTrigger Parallax & Section Reveals
function initScrollReveals() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out'
    });
  });

  // Project cards image parallax
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const img = card.querySelector('.project-img-inner');
    if (img) {
      gsap.fromTo(
        img,
        { yPercent: -12, scale: 1.08 },
        {
          yPercent: 12,
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }
  });

  // Section heading underline & progress lines
  document.querySelectorAll('.section-divider-line').forEach((line) => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: line,
        start: 'top 92%'
      }
    });
  });
}

// 6. Kinetic Marquee velocity responsiveness — calm, readable ticker pace
function initMarqueeVelocity() {
  const marqueeTrack = document.querySelector('.marquee-track');
  if (!marqueeTrack) return;

  let currentPos = 0;
  // Calm reading speed: ~0.04% per frame (~25s full revolution)
  let baseSpeed = 0.04;
  let velocitySpeed = 0;

  // Track scroll velocity with subtle momentum
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const delta = Math.abs(currentScroll - lastScroll);
    velocitySpeed = Math.min(delta * 0.002, 0.08);
    lastScroll = currentScroll;
  }, { passive: true });

  function step() {
    velocitySpeed *= 0.94;
    currentPos -= baseSpeed + velocitySpeed;
    if (currentPos <= -50) {
      currentPos = 0;
    }
    marqueeTrack.style.transform = `translate3d(${currentPos}%, 0, 0)`;
    requestAnimationFrame(step);
  }

  step();
}

// 7. Interactive Journey / Timeline Tabs
function initTimelineTabs() {
  const tabButtons = document.querySelectorAll('[data-journey-city]');
  const storyPanels = document.querySelectorAll('[data-journey-story]');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-journey-city');

      tabButtons.forEach((b) => b.classList.remove('is-active'));
      storyPanels.forEach((p) => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const targetPanel = document.querySelector(`[data-journey-story="${city}"]`);
      if (targetPanel) {
        targetPanel.classList.add('is-active');
      }

      audio.playClick();
    });
  });
}

// 8. Contact form & Email copy
function initContactInteractions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('email-toast');

  if (copyBtn && toast) {
    copyBtn.addEventListener('click', () => {
      const email = 'hello@shijin.design';
      navigator.clipboard.writeText(email).then(() => {
        toast.classList.add('is-visible');
        audio.playChime(784);
        setTimeout(() => {
          toast.classList.remove('is-visible');
        }, 2800);
      });
    });
  }

  // Interactive Project scope selector pills
  const scopePills = document.querySelectorAll('.scope-pill');
  scopePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('is-selected');
      audio.playClick();
    });
  });

  // Contact form submission via Web3Forms
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
      const originalText = btnSpan ? btnSpan.textContent : 'Send Message →';

      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Sending Message...';
      }

      if (formSuccess) {
        formSuccess.classList.remove('is-visible', 'is-error');
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
            formSuccess.classList.remove('is-error');
            formSuccess.classList.add('is-visible');
            setTimeout(() => {
              formSuccess.classList.remove('is-visible');
            }, 6000);
          }
        } else {
          if (formSuccess) {
            formSuccess.textContent = data.message || 'Something went wrong. Please email directly at shijinriju358@gmail.com';
            formSuccess.classList.add('is-visible', 'is-error');
          }
        }
      } catch (err) {
        if (formSuccess) {
          formSuccess.textContent = 'Network error. Please email directly at shijinriju358@gmail.com';
          formSuccess.classList.add('is-visible', 'is-error');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (btnSpan) btnSpan.textContent = originalText;
        }
      }
    });
  }
}

// 9. Back to Top Smooth Button
function initBackToTop(lenis) {
  const btt = document.getElementById('back-to-top');
  const circle = document.querySelector('.progress-circle-bar');
  if (!btt) return;

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;

    if (window.scrollY > 400) {
      btt.classList.add('is-visible');
    } else {
      btt.classList.remove('is-visible');
    }

    if (circle) {
      const circumference = 2 * Math.PI * 20; // r=20
      circle.style.strokeDashoffset = circumference * (1 - progress);
    }
  }, { passive: true });

  btt.addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo(0, { duration: 1.5 });
    audio.playClick();
  });
}

import './style.css';
import { initThreeScene } from './threeScene.js';
import { initAnimations } from './animations.js';
import { initProjectModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js 3D kinetic background
  initThreeScene('hero-canvas');

  // 2. Initialize GSAP, Lenis, and interaction choreographies
  initAnimations();

  // 3. Initialize Case study detail modal
  initProjectModal();

  // 6. Real-time Indian Standard Time (IST) Clock in Contact Section
  function updateClock() {
    const clockElem = document.getElementById('global-clock');
    if (!clockElem) return;

    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    try {
      const istTime = new Intl.DateTimeFormat([], options).format(new Date());
      clockElem.textContent = `${istTime} IST`;
    } catch (e) {
      clockElem.textContent = new Date().toLocaleTimeString();
    }
  }

  setInterval(updateClock, 1000);
  updateClock();
});

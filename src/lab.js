import { audio } from './audio.js';

export function initLab() {
  initColorStudy();
  initContourField();
}

// 1. Red Spectrum Study (Interactive Chromatic Matching)
function initColorStudy() {
  const targetDrop = document.getElementById('target-drop');
  const userDrop = document.getElementById('user-drop');
  const hueSlider = document.getElementById('hue-slider');
  const satSlider = document.getElementById('sat-slider');
  const scoreText = document.getElementById('color-score-text');
  const checkBtn = document.getElementById('check-color-btn');
  const newTargetBtn = document.getElementById('new-target-btn');
  const targetName = document.getElementById('target-shade-name');

  if (!targetDrop || !hueSlider) return;

  const redTones = [
    { name: 'Imperial Vermillion', h: 358, s: 92, l: 52 },
    { name: 'Tokyo Crimson Signal', h: 354, s: 98, l: 46 },
    { name: 'Scarlet Alabaster Tint', h: 4, s: 88, l: 56 },
    { name: 'Kinetic Cherry Red', h: 348, s: 94, l: 49 },
    { name: 'Cyberpunk Carmine', h: 352, s: 100, l: 50 }
  ];

  let currentTargetIndex = 0;

  function setTarget(idx) {
    currentTargetIndex = idx % redTones.length;
    const tone = redTones[currentTargetIndex];
    targetDrop.style.backgroundColor = `hsl(${tone.h}, ${tone.s}%, ${tone.l}%)`;
    if (targetName) targetName.textContent = tone.name;
    scoreText.textContent = 'Adjust the wavelength sliders to match';
    scoreText.className = 'color-score-default';
  }

  function updateUserColor() {
    const h = parseInt(hueSlider.value, 10);
    const s = parseInt(satSlider ? satSlider.value : 90, 10);
    userDrop.style.backgroundColor = `hsl(${h}, ${s}%, 50%)`;
  }

  hueSlider.addEventListener('input', () => {
    updateUserColor();
    audio.playClick();
  });

  if (satSlider) {
    satSlider.addEventListener('input', () => {
      updateUserColor();
      audio.playClick();
    });
  }

  checkBtn.addEventListener('click', () => {
    const userH = parseInt(hueSlider.value, 10);
    const targetH = redTones[currentTargetIndex].h;

    // Calculate angular distance
    let diff = Math.abs(userH - targetH);
    if (diff > 180) diff = 360 - diff;

    // Accuracy from 0 to 100%
    const accuracy = Math.max(0, Math.round(100 - (diff / 25) * 100));

    if (accuracy >= 95) {
      scoreText.innerHTML = `<strong>${accuracy}% Match!</strong> Extraordinary chromatic perception.`;
      scoreText.className = 'color-score-success';
      audio.playChime(880);
    } else if (accuracy >= 80) {
      scoreText.innerHTML = `<strong>${accuracy}% Match!</strong> Extremely close. Slight shift needed.`;
      scoreText.className = 'color-score-near';
      audio.playChime(587);
    } else {
      scoreText.innerHTML = `<strong>${accuracy}% Match.</strong> Off by ${diff}°. Keep fine-tuning the wavelength.`;
      scoreText.className = 'color-score-try';
      audio.playClick();
    }
  });

  if (newTargetBtn) {
    newTargetBtn.addEventListener('click', () => {
      setTarget(currentTargetIndex + 1);
      audio.playChime(440);
    });
  }

  setTarget(0);
  updateUserColor();
}

// 2. Interactive Topographic Contour Field (Canvas Animation)
function initContourField() {
  const canvas = document.getElementById('contour-field');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight || 420);

  let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };
  let time = 0;

  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
  };

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 420;
  });

  const lines = 18;

  function render() {
    time += 0.012;
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < lines; i++) {
      ctx.beginPath();
      const yBase = (height / (lines + 1)) * (i + 1);

      // Interpolate color: primarily subtle graphite lines with vibrant crimson accents on center lines
      const isCrimson = i === 7 || i === 8 || i === 9;
      if (isCrimson) {
        ctx.strokeStyle = `rgba(235, 30, 30, ${0.45 + Math.sin(time + i) * 0.25})`;
        ctx.lineWidth = 1.6;
      } else {
        ctx.strokeStyle = `rgba(18, 18, 18, ${0.08 + (i / lines) * 0.07})`;
        ctx.lineWidth = 1.0;
      }

      ctx.moveTo(0, yBase);

      const segments = 45;
      for (let s = 1; s <= segments; s++) {
        const x = (width / segments) * s;
        // Distance to pointer
        const dx = x - mouse.x;
        const dy = yBase - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 220);

        const wave =
          Math.sin(s * 0.35 + time + i * 0.4) * 16 +
          Math.cos(s * 0.18 - time * 0.7) * 8 -
          influence * 65 * Math.sin(influence * Math.PI);

        ctx.lineTo(x, yBase + wave);
      }

      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  render();
}

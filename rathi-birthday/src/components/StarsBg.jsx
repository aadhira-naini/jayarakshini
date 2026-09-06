import { useEffect, useRef } from 'react';

const STAR_COUNT = 180;

export default function StarsBg() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.7 + 0.1};
      `;
      container.appendChild(star);
    }

    // Shooting stars
    const shootInterval = setInterval(() => {
      const shoot = document.createElement('div');
      shoot.style.cssText = `
        position: absolute;
        top: ${Math.random() * 50}%;
        left: ${Math.random() * 30}%;
        width: ${Math.random() * 100 + 60}px;
        height: 1px;
        background: linear-gradient(90deg, transparent, white, transparent);
        opacity: 0;
        animation: shooting 1.2s ease-in forwards;
        z-index: 0;
      `;
      container.appendChild(shoot);
      setTimeout(() => shoot.remove(), 1300);
    }, 3500);

    return () => clearInterval(shootInterval);
  }, []);

  return <div className="stars-bg" ref={containerRef} />;
}

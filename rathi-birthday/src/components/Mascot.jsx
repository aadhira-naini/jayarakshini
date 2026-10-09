import { useEffect, useRef, useState } from 'react';

const directions = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right'];
const reactions = ['blink', 'heart', 'sparkle', 'surprised', 'wink', 'bashful', 'sleepy', 'dizzy', 'delighted'];
const clockwise = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
const sectorSize = (Math.PI * 2) / clockwise.length;

function cellStyle(index) {
  return { backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` };
}

export default function Mascot() {
  const buttonRef = useRef(null);
  const squashRef = useRef(null);
  const timersRef = useRef([]);
  const boopsRef = useRef({ count: 0, at: 0 });
  const [direction, setDirection] = useState('center');
  const [reaction, setReaction] = useState(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let sector = -1;
    let pointer = null;
    const aim = () => {
      const button = buttonRef.current;
      if (!button || !pointer) return;
      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      if (Math.hypot(dx, dy) < 70) { sector = -1; setDirection('center'); return; }
      const angle = Math.atan2(dy, dx);
      if (sector !== -1) {
        const delta = Math.atan2(Math.sin(angle - sector * sectorSize), Math.cos(angle - sector * sectorSize));
        if (Math.abs(delta) < sectorSize / 2 + 0.12) return;
      }
      sector = (Math.round(angle / sectorSize) + clockwise.length) % clockwise.length;
      setDirection(clockwise[sector]);
    };
    const onPointerMove = (event) => { pointer = { x: event.clientX, y: event.clientY }; aim(); };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, []);

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  const boop = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
    const later = (ms, next) => timersRef.current.push(window.setTimeout(() => setReaction(next), ms));
    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < 1600 ? boops.count + 1 : 1;
    boops.at = now;
    if (boops.count >= 4) {
      boops.count = 0;
      setReaction('dizzy');
      later(1100, null);
    } else {
      setReaction('blink');
      later(120, ['heart', 'sparkle', 'delighted'][(boops.count - 1) % 3]);
      later(560, null);
    }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      squashRef.current?.animate([
        { transform: 'scale(1, 1)', easing: 'ease-in' },
        { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
        { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
        { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
        { transform: 'scale(1, 1)' },
      ], { duration: 420, easing: 'linear' });
    }
  };

  return (
    <aside className="birthday-mascot" aria-label="Birthday mascot">
      <span className="birthday-mascot__hint" aria-hidden="true">Boop me for a little magic ✨</span>
      <button ref={buttonRef} className="birthday-mascot__button" type="button" onClick={boop} aria-label="Boop the birthday bunny">
        <span ref={squashRef} className="birthday-mascot__sprite">
          <span className="birthday-mascot__sheet" style={{ backgroundImage: 'url(/mascots/bunny-directions.webp)', ...cellStyle(directions.indexOf(direction)), opacity: reaction ? 0 : 1 }} />
          <span className="birthday-mascot__sheet" style={{ backgroundImage: 'url(/mascots/bunny-reactions.webp)', ...cellStyle(reactions.indexOf(reaction ?? 'blink')), opacity: reaction ? 1 : 0 }} />
        </span>
      </button>
    </aside>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const balloonColors = ['#a855f7', '#3b82f6', '#ec4899', '#f97316', '#22d3ee', '#fbbf24', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4', '#f43f5e', '#d946ef'];

function Balloon({ color, x, delay, isHeart }) {
  const shapeStyle = isHeart ? {
    width: 50, height: 50, background: color, position: 'relative',
    transform: 'rotate(-45deg)', boxShadow: `0 0 20px ${color}88`,
    filter: 'brightness(1.1)', borderRadius: '50% 50% 50% 0'
  } : {
    width: 50, height: 65, background: color,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    position: 'relative', boxShadow: `0 0 20px ${color}88`, filter: 'brightness(1.1)',
  };
  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ y: '-30vh', opacity: 1 }}
      transition={{ duration: 6 + Math.random() * 4, delay, ease: 'easeOut' }}
      style={{ position: 'fixed', left: `${x}%`, bottom: 0, zIndex: 5 }}
    >
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <div style={shapeStyle}>
          {!isHeart && (
            <div style={{
              position: 'absolute', bottom: -2, left: '50%',
              transform: 'translateX(-50%)', width: 8, height: 8,
              background: color, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              filter: 'brightness(0.8)',
            }} />
          )}
        </div>
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 100, background: `${color}88`, margin: '0 auto', transformOrigin: 'top center' }}
        />
      </motion.div>
    </motion.div>
  );
}

const emojis = ['🎉', '✨', '💜', '🌙', '🌟', '💖', '🎂'];

function EmojiRain() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: `${Math.random() * 100}vw`, opacity: 0, rotate: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 1, 0], rotate: Math.random() * 360 }}
          transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2, ease: 'linear', repeat: Infinity }}
          style={{ position: 'absolute', fontSize: `${10 + Math.random() * 20}px` }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Cosmic Star System (Stable deterministic seed for zero jitter) ── */
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seededRandom(42);

// Layer 1: 160 Deep-sky micro stars (constant twinkling background)
const DISTANT_STARS = Array.from({ length: 160 }, (_, i) => ({
  id: `dist-${i}`,
  x: +(rng() * 100).toFixed(2),
  y: +(rng() * 100).toFixed(2),
  size: +(1.0 + rng() * 1.1).toFixed(1),
  dur: +(1.6 + rng() * 2.4).toFixed(2),
  delay: +(rng() * 3.5).toFixed(2),
  minOp: +(0.45 + rng() * 0.25).toFixed(2),
  maxOp: +(0.85 + rng() * 0.15).toFixed(2),
  color: rng() > 0.35 ? '#ffffff' : rng() > 0.5 ? '#dbeafe' : '#fef08a',
}));

// Layer 2: 85 Mid-field brilliant stars with luminous aura
const MID_STARS = Array.from({ length: 85 }, (_, i) => ({
  id: `mid-${i}`,
  x: +(rng() * 100).toFixed(2),
  y: +(rng() * 100).toFixed(2),
  size: +(2.0 + rng() * 1.5).toFixed(1),
  dur: +(2.0 + rng() * 2.6).toFixed(2),
  delay: +(rng() * 3.5).toFixed(2),
  color: rng() > 0.4 ? '#ffffff' : rng() > 0.5 ? '#e0f2fe' : '#fef9c3',
}));

// Layer 3: 24 Hero radiant celestial stars with diamond pulse
const HERO_STARS = Array.from({ length: 24 }, (_, i) => ({
  id: `hero-${i}`,
  x: +(rng() * 94 + 3).toFixed(2),
  y: +(rng() * 94 + 3).toFixed(2),
  size: +(3.5 + rng() * 1.8).toFixed(1),
  dur: +(2.0 + rng() * 2.0).toFixed(2),
  delay: +(rng() * 3.0).toFixed(2),
  color: rng() > 0.5 ? '#ffffff' : rng() > 0.5 ? '#fde047' : '#93c5fd',
}));

// Layer 4: 10 Sparkling 4-point cross diffraction stars (Polaris / Sirius glints)
const CROSS_STARS = [
  { x: 12, y: 18, size: 16, delay: 0.2, color: '#fef08a' },
  { x: 26, y: 12, size: 14, delay: 1.5, color: '#ffffff' },
  { x: 42, y: 20, size: 18, delay: 0.8, color: '#e0f2fe' },
  { x: 72, y: 24, size: 15, delay: 2.1, color: '#fef9c3' },
  { x: 88, y: 38, size: 14, delay: 1.1, color: '#ffffff' },
  { x: 16, y: 65, size: 16, delay: 2.6, color: '#fde047' },
  { x: 34, y: 80, size: 13, delay: 0.5, color: '#ffffff' },
  { x: 60, y: 76, size: 17, delay: 1.9, color: '#e9d5ff' },
  { x: 82, y: 82, size: 15, delay: 2.8, color: '#fef08a' },
  { x: 92, y: 15, size: 14, delay: 0.4, color: '#ffffff' },
];

function DistantStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DISTANT_STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [s.minOp, s.maxOp, s.minOp] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}

function MidStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {MID_STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.55, 1, 0.55], scale: [0.92, 1.25, 0.92] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 5px ${s.color}, 0 0 10px rgba(255, 255, 255, 0.65)`,
          }}
        />
      ))}
    </div>
  );
}

function CrossSparkleStar({ x, y, size = 14, delay = 0, color = '#ffffff' }) {
  return (
    <motion.div
      animate={{
        opacity: [0.55, 1, 0.55],
        scale: [0.85, 1.25, 0.85],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 3 + (delay % 2),
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path
          d="M12 0 C12 7 7 12 0 12 C7 12 12 17 12 24 C12 17 17 12 24 12 C17 12 12 7 12 0 Z"
          fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px rgba(255,255,255,0.85))` }}
        />
        <circle cx="12" cy="12" r="2" fill="#ffffff" />
      </svg>
    </motion.div>
  );
}

function HeroStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {HERO_STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.35, 1],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 8px #ffffff, 0 0 16px rgba(168, 85, 247, 0.65), 0 0 24px rgba(59, 130, 246, 0.4)`,
          }}
        />
      ))}
      {CROSS_STARS.map((s, idx) => (
        <CrossSparkleStar key={idx} x={s.x} y={s.y} size={s.size} delay={s.delay} color={s.color} />
      ))}
    </div>
  );
}

function ShootingStar({ top, left, delay, duration = 6.5 }) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
      animate={{
        x: [0, 320],
        y: [0, 240],
        opacity: [0, 1, 0.9, 0],
        scale: [0.6, 1.1, 1, 0.2],
      }}
      transition={{
        duration: 1.1,
        delay,
        repeat: Infinity,
        repeatDelay: duration,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: 110,
        height: 2,
        background: 'linear-gradient(90deg, #ffffff 0%, rgba(254, 240, 138, 0.9) 20%, rgba(168, 85, 247, 0.4) 60%, transparent 100%)',
        transform: 'rotate(34deg)',
        transformOrigin: 'left center',
        filter: 'drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))',
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── Glowing Celestial Crescent Moon with Visible Silhouette ──────── */
function Moon() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '6%',
        right: '8%',
        width: 'clamp(115px, 14vw, 155px)',
        height: 'clamp(115px, 14vw, 155px)',
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {/* 1. Soft atmospheric lunar aura */}
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.96, 1.06, 0.96] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '-30%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254, 240, 138, 0.22) 0%, rgba(192, 132, 252, 0.12) 40%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. SVG Crescent Moon with Crisp Silhouette & Visible Shape */}
      <svg
        viewBox="0 0 140 140"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          filter: 'drop-shadow(0 0 12px rgba(254, 240, 138, 0.65)) drop-shadow(0 0 28px rgba(216, 180, 254, 0.35))',
        }}
      >
        <defs>
          {/* Luminous lunar gradient for the illuminated crescent */}
          <linearGradient id="moonGrad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Earthshine dark side of the moon gradient */}
          <radialGradient id="earthshine" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#1e183a" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#100b24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#080515" stopOpacity="0.96" />
          </radialGradient>

          {/* Exact geometric mask creating a crisp crescent */}
          <mask id="crescentMask">
            <rect x="0" y="0" width="140" height="140" fill="#000" />
            {/* Base moon disc (white = show) */}
            <circle cx="70" cy="70" r="52" fill="#fff" />
            {/* Cutout disc shifted right & slightly up (black = cut away) */}
            <circle cx="92" cy="62" r="48" fill="#000" />
          </mask>
        </defs>

        {/* Earthshine: Faint dark spherical disc showing full moon shape */}
        <circle
          cx="70"
          cy="70"
          r="52"
          fill="url(#earthshine)"
          stroke="rgba(216, 180, 254, 0.25)"
          strokeWidth="1.2"
        />

        {/* Craters on the dark unlit side (maria) */}
        <circle cx="86" cy="54" r="7.5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        <circle cx="99" cy="76" r="9.5" fill="rgba(255,255,255,0.025)" />
        <circle cx="76" cy="87" r="6" fill="rgba(255,255,255,0.03)" />
        <circle cx="92" cy="98" r="5" fill="rgba(255,255,255,0.02)" />

        {/* Crisp Crescent Body */}
        <g mask="url(#crescentMask)">
          <circle cx="70" cy="70" r="52" fill="url(#moonGrad)" />

          {/* Distinct craters on the illuminated crescent */}
          <circle cx="42" cy="52" r="5" fill="#ca8a04" opacity="0.45" />
          <circle cx="43" cy="53" r="3.8" fill="#a16207" opacity="0.35" />
          <circle cx="50" cy="82" r="4.2" fill="#ca8a04" opacity="0.4" />
          <circle cx="51" cy="83" r="3" fill="#a16207" opacity="0.3" />
          <circle cx="36" cy="70" r="3.5" fill="#ca8a04" opacity="0.35" />
          <circle cx="48" cy="38" r="3.2" fill="#ca8a04" opacity="0.35" />
          <circle cx="58" cy="98" r="3" fill="#ca8a04" opacity="0.3" />
          <circle cx="62" cy="28" r="2.8" fill="#ca8a04" opacity="0.3" />

          {/* Sunlit inner rim texture */}
          <path
            d="M 68 20 A 50 50 0 0 0 68 120"
            stroke="#ffffff"
            strokeWidth="3.2"
            fill="none"
            opacity="0.85"
          />
        </g>

        {/* Razor-sharp brilliant outer rim highlight */}
        <path
          d="M 68 18 A 52 52 0 0 0 68 122"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }}
        />

        {/* Sharp horned tips */}
        <circle cx="68" cy="18" r="1.6" fill="#ffffff" />
        <circle cx="68" cy="122" r="1.6" fill="#ffffff" />
      </svg>

      {/* Sparkle stars dancing near the crescent tips */}
      <CrossSparkleStar x={-18} y={-8} size={15} delay={0} color="#fef08a" />
      <CrossSparkleStar x={-32} y={35} size={11} delay={1.2} color="#ffffff" />
      <CrossSparkleStar x={-15} y={88} size={13} delay={0.7} color="#fef9c3" />
      <CrossSparkleStar x={85} y={-22} size={12} delay={1.8} color="#e9d5ff" />
      <CrossSparkleStar x={78} y={105} size={11} delay={2.3} color="#ffffff" />
    </div>
  );
}

function GlowingRings() {
  return (
    <div style={{ position: 'absolute', inset: -50, pointerEvents: 'none', zIndex: -1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          animate={{
            rotate: 360,
            scale: [1, 1.1 + ring * 0.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            rotate: { duration: 10 + ring * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 3 + ring, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3 + ring, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            width: 120 + ring * 60, height: 120 + ring * 60,
            borderRadius: '50%',
            border: `2px solid rgba(168, 85, 247, ${0.4 - ring * 0.1})`,
            boxShadow: `0 0 ${20 * ring}px rgba(59, 130, 246, 0.2)`
          }}
        />
      ))}
    </div>
  );
}

function LightRays() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 2, opacity: [0, 0.5, 0] }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{
        position: 'absolute', inset: -200,
        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 30deg, transparent 60deg, rgba(255,255,255,0.3) 90deg, transparent 120deg, rgba(255,255,255,0.3) 150deg, transparent 180deg, rgba(255,255,255,0.3) 210deg, transparent 240deg, rgba(255,255,255,0.3) 270deg, transparent 300deg, rgba(255,255,255,0.3) 330deg, transparent 360deg)',
        zIndex: -1, pointerEvents: 'none', borderRadius: '50%',
      }}
    />
  );
}

function ParticleTrail() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40 - Math.random() * 40],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: `${40 + Math.random() * 20}%`, top: `${40 + Math.random() * 20}%`,
            width: 4 + Math.random() * 4, height: 4 + Math.random() * 4,
            borderRadius: '50%',
            background: ['#fff', '#a855f7', '#3b82f6'][Math.floor(Math.random() * 3)],
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function OpeningScreen({ onOpen }) {
  const [phase, setPhase] = useState('hint'); // hint → opened → animating → done
  const [showBalloons, setShowBalloons] = useState(false);
  const [showRays, setShowRays] = useState(false);

  const fireConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ['#a855f7', '#3b82f6', '#ec4899', '#fbbf24', '#f8f4ff'];
    const frame = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleOpen = () => {
    setShowRays(true);
    setPhase('opened');
    setShowBalloons(true);
    fireConfetti();
    setTimeout(() => {
      setPhase('animating');
      setTimeout(() => {
        setPhase('done');
        setTimeout(() => onOpen(), 1800);
      }, 4500);
    }, 500);
  };

  const happyBirthdayText = "Happy Birthday".split("");
  const rathiText = "Rathi".split("");

  return (
    <AnimatePresence>
      {phase !== 'exiting' && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ══ NIGHT SKY DEEP SPACE BACKGROUND — cinematic push-in ══ */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              background: `
                radial-gradient(ellipse 75% 55% at 82% 10%, rgba(76, 29, 149, 0.65) 0%, transparent 60%),
                radial-gradient(ellipse 65% 50% at 18% 85%, rgba(15, 23, 72, 0.75) 0%, transparent 58%),
                radial-gradient(ellipse 50% 40% at 45% 45%, rgba(30, 27, 75, 0.45) 0%, transparent 65%),
                radial-gradient(ellipse 100% 100% at 50% 50%, #08061a 0%, #04030d 50%, #020108 100%)
              `,
            }}
          />

          {/* ══ NEBULA GLOW & COSMIC DUST ══ */}
          <motion.div
            initial={{ scale: 0.90, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: `
                radial-gradient(ellipse 60% 40% at 25% 35%, rgba(126, 34, 206, 0.24) 0%, transparent 70%),
                radial-gradient(ellipse 45% 35% at 75% 65%, rgba(37, 99, 235, 0.20) 0%, transparent 70%),
                radial-gradient(ellipse 35% 25% at 60% 25%, rgba(236, 72, 153, 0.14) 0%, transparent 65%)
              `,
            }}
          />

          {/* ══ DISTANT STARS LAYER (depth parallax) ══ */}
          <motion.div
            initial={{ scale: 0.86, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
          >
            <DistantStars />
          </motion.div>

          {/* ══ MID-FIELD STARS LAYER (depth parallax) ══ */}
          <motion.div
            initial={{ scale: 0.78, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          >
            <MidStars />
          </motion.div>

          {/* ══ HERO RADIANT STARS & SPARKLING CROSS STARS ══ */}
          <motion.div
            initial={{ scale: 0.70, opacity: 0.95 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          >
            <HeroStars />
          </motion.div>

          {/* ══ SHOOTING STARS / METEORS ══ */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
            <ShootingStar top={10} left={12} delay={1.2} duration={7} />
            <ShootingStar top={26} left={48} delay={4.0} duration={8.5} />
            <ShootingStar top={8} left={68} delay={7.2} duration={8} />
          </div>

          {/* ══ CELESTIAL MOON — zooms into place in the cosmic sky ══ */}
          <motion.div
            initial={{ scale: 0.80, opacity: 0.85, x: 25, y: -15 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
          >
            <Moon />
          </motion.div>

          {/* Balloons */}
          {showBalloons && [...Array(12)].map((_, i) => (
            <Balloon
              key={i}
              color={balloonColors[i % balloonColors.length]}
              x={5 + i * (90 / 11)}
              delay={Math.random() * 1.5}
              isHeart={i % 3 === 0}
            />
          ))}

          {/* Emoji Rain */}
          {(phase === 'opened' || phase === 'animating') && <EmojiRain />}

          {/* ══ FOREGROUND CONTENT — fades in after zoom settles ══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.6 }}
            style={{
              position: 'relative', zIndex: 10, width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              {phase === 'hint' && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  style={{ textAlign: 'center', padding: '0 20px', zIndex: 10, position: 'relative' }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ fontSize: 80, marginBottom: 24, position: 'relative' }}
                  >
                    🌙
                  </motion.div>
                  <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                    color: '#e2d5f8', marginBottom: 16, letterSpacing: 1, position: 'relative'
                  }}>
                    Hey… don't scroll too fast 👀
                  </p>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    color: '#a78bfa', marginBottom: 48, opacity: 0.8, position: 'relative'
                  }}>
                    Something special is waiting for you…
                  </p>

                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <GlowingRings />
                    <ParticleTrail />
                    {showRays && <LightRays />}
                    <motion.button
                      onClick={handleOpen}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, #6b21a8, #3b82f6)',
                        border: 'none', borderRadius: 50,
                        padding: '18px 48px', color: 'white',
                        fontSize: '1.2rem',
                        fontFamily: "'Dancing Script', cursive",
                        fontWeight: 700, letterSpacing: 1,
                        boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(59,130,246,0.2)',
                        animation: 'pulse-glow 2s ease-in-out infinite', zIndex: 2
                      }}
                    >
                      🎁 Open Your Surprise
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {(phase === 'opened' || phase === 'animating') && (
                <motion.div
                  key="name"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                  style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', position: 'relative' }}
                >
                  {showRays && <LightRays />}
                  <div style={{
                    fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: '#a78bfa',
                    marginBottom: 8, letterSpacing: 4, textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif", fontWeight: 300,
                    display: 'flex', justifyContent: 'center', gap: '4px'
                  }}>
                    {happyBirthdayText.map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05, type: 'spring', stiffness: 150 }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </div>
                  <div style={{
                    fontSize: 'clamp(3rem, 12vw, 9rem)',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700, lineHeight: 1, marginBottom: 12,
                    display: 'flex', justifyContent: 'center',
                  }}>
                    {rathiText.map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 40, rotateX: -90 }}
                        animate={{
                          opacity: 1, y: 0, rotateX: 0,
                          color: ['#a855f7', '#3b82f6', '#ec4899', '#a855f7'],
                          textShadow: [
                            '0 0 10px rgba(168,85,247,0.5)',
                            '0 0 20px rgba(59,130,246,0.8)',
                            '0 0 10px rgba(236,72,153,0.5)',
                            '0 0 10px rgba(168,85,247,0.5)'
                          ]
                        }}
                        transition={{
                          delay: 1.0 + index * 0.1, duration: 0.8,
                          color: { duration: 3, repeat: Infinity, ease: 'linear' },
                          textShadow: { duration: 3, repeat: Infinity, ease: 'linear' }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, type: 'spring' }}
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: 'clamp(1.2rem, 4vw, 2rem)', color: '#e2d5f8',
                    }}
                  >
                    🌙 My Moon 💙
                  </motion.p>
                  {phase === 'animating' && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      style={{ marginTop: 40, fontSize: '1rem', color: '#a78bfa', opacity: 0.7 }}
                    >
                      ✨ Scroll down to explore your universe…
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

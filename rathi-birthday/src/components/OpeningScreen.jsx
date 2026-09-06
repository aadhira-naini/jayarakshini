import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const balloonColors = ['#a855f7', '#3b82f6', '#ec4899', '#f97316', '#22d3ee'];

function Balloon({ color, x, delay }) {
  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ y: '-20vh', opacity: 1 }}
      transition={{ duration: 5 + Math.random() * 3, delay, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left: `${x}%`,
        bottom: 0,
        zIndex: 5,
        animation: `balloon-float ${3 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{
        width: 50,
        height: 65,
        background: color,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        position: 'relative',
        boxShadow: `0 0 20px ${color}88`,
        filter: 'brightness(1.1)',
      }}>
        <div style={{
          position: 'absolute',
          bottom: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          background: color,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'brightness(0.8)',
        }} />
      </div>
      <div style={{
        width: 1,
        height: 80,
        background: `${color}88`,
        margin: '0 auto',
      }} />
    </motion.div>
  );
}

export default function OpeningScreen({ onOpen }) {
  const [phase, setPhase] = useState('hint'); // hint → opened → animating → done
  const [showBalloons, setShowBalloons] = useState(false);
  const audioRef = useRef(null);

  const fireConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ['#a855f7', '#3b82f6', '#ec4899', '#fbbf24', '#f8f4ff'];
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleOpen = () => {
    setPhase('opened');
    setShowBalloons(true);
    fireConfetti();
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      setPhase('animating');
      setTimeout(() => {
        setPhase('done');
        setTimeout(() => onOpen(), 1800);
      }, 3500);
    }, 500);
  };

  return (
    <AnimatePresence>
      {phase !== 'exiting' && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a1a 70%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Audio element — drop your birthday.mp3 in /public */}
          <audio ref={audioRef} src="/birthday.mp3" loop />

          {/* Balloons */}
          {showBalloons && balloonColors.map((color, i) => (
            <Balloon key={i} color={color} x={10 + i * 18} delay={i * 0.3} />
          ))}

          <AnimatePresence mode="wait">
            {phase === 'hint' && (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', padding: '0 20px', zIndex: 10 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  style={{ fontSize: 80, marginBottom: 24 }}
                >
                  🌙
                </motion.div>
                <p style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  color: '#e2d5f8',
                  marginBottom: 16,
                  letterSpacing: 1,
                }}>
                  Hey… don't scroll too fast 👀
                </p>
                <p style={{
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  color: '#a78bfa',
                  marginBottom: 48,
                  opacity: 0.8,
                }}>
                  Something special is waiting for you…
                </p>
                <motion.button
                  onClick={handleOpen}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #6b21a8, #3b82f6)',
                    border: 'none',
                    borderRadius: 50,
                    padding: '18px 48px',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontFamily: "'Dancing Script', cursive",
                    fontWeight: 700,
                    letterSpacing: 1,
                    boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(59,130,246,0.2)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                  }}
                >
                  🎁 Open Your Surprise
                </motion.button>
              </motion.div>
            )}

            {(phase === 'opened' || phase === 'animating') && (
              <motion.div
                key="name"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                style={{ textAlign: 'center', zIndex: 10, padding: '0 20px' }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                    color: '#a78bfa',
                    marginBottom: 8,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Happy Birthday
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="gradient-text"
                  style={{
                    fontSize: 'clamp(3rem, 12vw, 9rem)',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  Rathi
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                    color: '#e2d5f8',
                  }}
                >
                  🌙 My Moon 💙
                </motion.p>
                {phase === 'animating' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{ marginTop: 40, fontSize: '1rem', color: '#a78bfa', opacity: 0.7 }}
                  >
                    ✨ Scroll down to explore your universe…
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stars = [
  { reason: 'You listen to me', detail: 'Not just hear — you actually listen. You remember things I mentioned once, months ago. That means more than you know.' },
  { reason: 'You understand my silence', detail: 'You never need me to explain every feeling. Sometimes you just know. And that quiet understanding is everything.' },
  { reason: 'You annoy me (on purpose)', detail: 'You do this thing where you deliberately press my buttons and then laugh about it. I hate that I find it adorable.' },
  { reason: 'You stayed', detail: 'Through the difficult conversations, the long silences, the messy moments. You stayed. That\'s not nothing. That\'s everything.' },
  { reason: 'You became home', detail: 'Somewhere along the way, home stopped being a place and started being conversations with you.' },
  { reason: 'You\'re unapologetically you', detail: 'You don\'t pretend. You don\'t perform. You just exist, and somehow that existence makes everyone around you feel more alive.' },
  { reason: 'Your laugh', detail: 'I genuinely cannot describe it without smiling. It\'s the kind of laugh that makes a whole room feel lighter.' },
  { reason: 'You care deeply', detail: 'Even when it hurts you. Even when no one sees. You care so deeply it\'s almost reckless. It\'s beautiful.' },
];

function OrbitingStar({ star, index, total, isOpen, onClick, time }) {
  const baseAngle = (index / total) * 360;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const baseRadius = isMobile ? 120 : 190;

  // Each star orbits at its own speed and has a bobbing radius
  const speed = 0.15 + index * 0.03;
  const currentAngle = baseAngle + time * speed;
  const radiusWobble = Math.sin(time * 0.5 + index * 0.8) * 20;
  const radius = baseRadius + radiusWobble;

  const x = Math.cos((currentAngle - 90) * Math.PI / 180) * radius;
  const y = Math.sin((currentAngle - 90) * Math.PI / 180) * radius;

  // Slight scale pulsing
  const pulse = 1 + Math.sin(time * 0.8 + index * 1.2) * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring' }}
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: isOpen ? 10 : 2,
      }}
    >
      <motion.button
        whileHover={{ scale: 1.4 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClick(index)}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: isOpen
            ? 'radial-gradient(circle, #fbbf24, #f97316)'
            : 'radial-gradient(circle, #fbbf2477, #6b21a833)',
          border: `2px solid ${isOpen ? '#fbbf24' : '#fbbf2444'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '1.4rem',
          transition: 'background 0.3s, border 0.3s',
          boxShadow: isOpen
            ? '0 0 30px #fbbf24, 0 0 60px #fbbf2444'
            : `0 0 ${6 + pulse * 6}px #fbbf2466`,
          transform: `scale(${pulse})`,
        }}
      >
        ⭐
      </motion.button>
    </motion.div>
  );
}

export default function WhySpecial() {
  const [openStar, setOpenStar] = useState(null);
  const [time, setTime] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setTime(prev => prev + delta);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggle = (i) => setOpenStar(prev => prev === i ? null : i);

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(26,10,46,0.4) 0%, rgba(10,10,26,0.3) 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <p style={{ color: '#a78bfa', letterSpacing: 4, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 12 }}>
          Every star holds a secret
        </p>
        <h2 className="playfair gradient-text" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
          Why You're Special to Me
        </h2>
        <p style={{ color: '#c4b5fd', marginTop: 12, opacity: 0.7 }}>
          Click the orbiting stars to discover what I see in you ⭐
        </p>
      </motion.div>

      {/* Orbiting Star constellation */}
      <div style={{
        position: 'relative',
        width: 'clamp(300px, 90vw, 500px)',
        height: 'clamp(300px, 90vw, 500px)',
        margin: '0 auto 40px',
      }}>
        {/* Center moon */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            zIndex: 3,
            filter: 'drop-shadow(0 0 20px #e2d5f888)',
          }}
        >
          🌙
        </motion.div>

        {/* Orbit trail rings */}
        {[0.7, 0.85, 1].map((scale, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              borderRadius: '50%',
              border: '1px solid rgba(251,191,36,0.15)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Orbiting Stars */}
        {stars.map((star, i) => (
          <OrbitingStar
            key={i}
            star={star}
            index={i}
            total={stars.length}
            isOpen={openStar === i}
            onClick={toggle}
            time={time}
          />
        ))}
      </div>

      {/* Message panel */}
      <AnimatePresence mode="wait">
        {openStar !== null && (
          <motion.div
            key={openStar}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(26, 10, 46, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #fbbf2433',
              borderRadius: 20,
              padding: '28px 32px',
              maxWidth: 480,
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 40px rgba(251,191,36,0.15)',
            }}
          >
            <p style={{
              fontSize: '0.75rem',
              color: '#fbbf24',
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              ⭐ {stars[openStar].reason}
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              color: '#e2d5f8',
              lineHeight: 1.8,
              fontStyle: 'italic',
            }}>
              "{stars[openStar].detail}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {openStar === null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          style={{ color: '#a78bfa', fontSize: '0.9rem', marginTop: 20 }}
        >
          Touch any orbiting star above 👆
        </motion.p>
      )}
    </section>
  );
}

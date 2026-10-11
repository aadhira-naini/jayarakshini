import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stars = [
  { reason: 'You listen to me', detail: 'Naa sona china china vishayam kuda nee seiva😙.' },
  { reason: 'You understand my silence', detail: 'Naa silent aa erruntha , seri nu vidama en nu ketu, naa solama nee kochitu errupa😆.' },
  { reason: 'You annoy me (on purpose)', detail: 'Naa enalaa pudikathu nu soldren noo athu mattum tha thedi thedi seiva 😶, ama la cheloo.' },
  { reason: 'You stayed', detail: 'Yethu epdi ponalum ennoda happines and sadness renduthukum starting point nee tha😍.' },
  { reason: 'You became home', detail: 'enathaa kurumbu senjalum nee epdiyo close aagita😜.' },
  { reason: 'You\'re unapologetically you', detail: 'yarukavum yethukum change panathu illa un characters. but unaku kovam romba varuthu athu kami panu paa pleech🥺.' },
];

function OrbitingStar({ star, index, total, isOpen, onClick, time, radius }) {
  const baseAngle = (index / total) * 360;
  // All stars orbit at the exact same constant speed (12 deg/sec)
  // This ensures the angular distance between adjacent stars is ALWAYS exactly 60 degrees
  const speed = 12;
  const currentAngle = baseAngle + time * speed;

  const x = Math.cos((currentAngle - 90) * Math.PI / 180) * radius;
  const y = Math.sin((currentAngle - 90) * Math.PI / 180) * radius;

  return (
    // Outer plain div: pure absolute positioning, no Framer Motion transform interference
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: isOpen ? 10 : 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.15, type: 'spring' }}
      >
        <motion.button
          whileHover={{ scale: 1.35 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClick(index)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: isOpen
              ? 'radial-gradient(circle, #fbbf24, #f97316)'
              : 'radial-gradient(circle, rgba(251,191,36,0.35), rgba(107,33,168,0.2))',
            border: `2px solid ${isOpen ? '#fbbf24' : 'rgba(251,191,36,0.5)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.4rem',
            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
            boxShadow: isOpen
              ? '0 0 30px #fbbf24, 0 0 60px rgba(251,191,36,0.3)'
              : '0 0 14px rgba(251,191,36,0.45)',
          }}
        >
          ⭐
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function WhySpecial() {
  const [openStar, setOpenStar] = useState(null);
  const [time, setTime] = useState(0);
  const [radius, setRadius] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 600 ? 120 : 190));
  const rafRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 600 ? 120 : 190);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      if (openStar === null) {
        setTime(prev => prev + delta);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [openStar]);

  const toggle = (i) => setOpenStar(prev => prev === i ? null : i);

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'transparent',
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
        {/* Center moon (fixed in center) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            zIndex: 3,
            filter: 'drop-shadow(0 0 24px rgba(226, 213, 248, 0.6))',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🌙
        </div>

        {/* Orbit trail ring matching the exact circular orbit */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%',
            border: '1.5px dashed rgba(251,191,36,0.22)',
            pointerEvents: 'none',
          }}
        />
        {/* Faint outer decorative ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: radius * 2 + 28,
            height: radius * 2 + 28,
            borderRadius: '50%',
            border: '1px solid rgba(251,191,36,0.08)',
            pointerEvents: 'none',
          }}
        />

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
            radius={radius}
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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const finalPhotos = [
  { src: '/photos/photo1.jpg', emoji: '🌙' },
  { src: '/photos/photo2.jpg', emoji: '💙' },
  { src: '/photos/photo3.jpg', emoji: '✨' },
  { src: '/photos/photo4.jpg', emoji: '🎉' },
  { src: '/photos/photo5.jpg', emoji: '🥹' },
];

function Fireworks() {
  useEffect(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#a855f7', '#3b82f6', '#ec4899', '#fbbf24', '#ffffff'];

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
        colors,
        shapes: ['star', 'circle'],
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function FinalSurprise() {
  const [phase, setPhase] = useState('button'); // button → fireworks → photos → message
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleClick = () => {
    setPhase('fireworks');
    setTimeout(() => {
      setPhase('photos');
      // Reveal photos one by one
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setPhotoIndex(i);
        if (i >= finalPhotos.length) {
          clearInterval(iv);
          setTimeout(() => setPhase('message'), 1000);
        }
      }, 800);
    }, 1000);
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0a1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {(phase === 'fireworks' || phase === 'photos') && <Fireworks />}

      <AnimatePresence mode="wait">
        {phase === 'button' && (
          <motion.div
            key="btn"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}
            >
              🎆
            </motion.div>
            <h2
              className="playfair gradient-text"
              style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
            >
              One Last Thing…
            </h2>
            <p style={{ color: '#c4b5fd', fontSize: '1rem', opacity: 0.7, maxWidth: 400 }}>
              You've made it to the end. There's one final surprise waiting for you.
            </p>
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ['0 0 20px #a855f766', '0 0 50px #a855f766', '0 0 20px #a855f766'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: 'linear-gradient(135deg, #6b21a8, #ec4899)',
                border: 'none',
                borderRadius: 50,
                padding: '18px 52px',
                color: 'white',
                fontSize: '1.2rem',
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
              }}
            >
              🎆 Click for Your Final Surprise
            </motion.button>
          </motion.div>
        )}

        {(phase === 'fireworks' || phase === 'photos') && (
          <motion.div
            key="photos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'center',
              maxWidth: 700,
              width: '90%',
            }}
          >
            {finalPhotos.slice(0, photoIndex).map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0, rotate: Math.random() * 20 - 10 }}
                animate={{ scale: 1, opacity: 1, rotate: Math.random() * 6 - 3 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{
                  background: 'white',
                  padding: '10px 10px 30px',
                  borderRadius: 4,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  width: 'clamp(100px, 25vw, 150px)',
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: 'linear-gradient(135deg, #1a0a2e, #0d0d2b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <img
                    src={p.src}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ position: 'absolute' }}>{p.emoji}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === 'message' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 20px' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}
            >
              🌙
            </motion.div>
            <h1
              className="playfair gradient-text"
              style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', lineHeight: 1.2 }}
            >
              Thank you for existing in my universe.
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                color: '#c4b5fd',
                maxWidth: 500,
                lineHeight: 1.7,
              }}
            >
              You are my favourite chapter, Rathi. 
              The one I'd reread a thousand times.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              style={{
                marginTop: 20,
                padding: '20px 40px',
                background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: 16,
              }}
            >
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                background: 'linear-gradient(135deg, #e2d5f8, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
              }}>
                Happy Birthday, My Moon 🌙💙
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

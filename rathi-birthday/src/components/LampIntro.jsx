import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeGreenScreen } from '../utils/removeBackground';

export default function LampIntro({ onLampOn }) {
  const [pulled,     setPulled]     = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [glowing,    setGlowing]    = useState(false);
  const [lampSrc,    setLampSrc]    = useState(null); // null = loading

  /* Strip the vivid green-screen background from lamp.png on mount */
  useEffect(() => {
    removeGreenScreen('/lamp.png', { greenDominance: 35, minGreen: 80 })
      .then(setLampSrc)
      .catch(() => setLampSrc('/lamp.png')); // fallback to original
  }, []);

  const handlePull = () => {
    if (pulled) return;
    setGlowing(true);
    setPulled(true);
    setTimeout(() => { if (onLampOn) onLampOn(); }, 2400);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lamp-screen"
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'default',
        }}
      >
        {/* ── Starfield specks ─────────────────────────────────── */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              borderRadius: '50%',
              background: 'white',
              opacity: 0.08 + (i % 5) * 0.06,
              left: `${(i * 37 + 11) % 100}%`,
              top:  `${(i * 53 + 7)  % 100}%`,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          />
        ))}

        {/* ── Warm glow bloom (on) ─────────────────────────────── */}
        <AnimatePresence>
          {glowing && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 4.5, opacity: 0.5 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '18%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 180,
                height: 180,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,210,130,0.95) 0%, rgba(255,140,80,0.4) 45%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Light cone fanning down ──────────────────────────── */}
        <AnimatePresence>
          {glowing && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '32%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '200px solid transparent',
                borderRight: '200px solid transparent',
                borderTop: '460px solid rgba(255,215,140,0.09)',
                transformOrigin: 'top center',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Lamp + cord container ────────────────────────────── */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Lamp image — white bg removed via canvas flood-fill */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {lampSrc ? (
              <motion.img
                src={lampSrc}
                alt="lamp"
                animate={
                  glowing
                    ? {
                        filter: [
                          'brightness(0.80) saturate(0.8)',
                          'brightness(1.05) saturate(1.4) drop-shadow(0 0 50px rgba(255,200,100,1)) drop-shadow(0 0 100px rgba(255,160,60,0.6))',
                        ],
                      }
                    : { filter: 'brightness(0.80) saturate(0.8)' }
                }
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  width: 'clamp(160px, 36vw, 300px)',
                  height: 'auto',
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />
            ) : (
              /* Loading spinner while bg removal runs */
              <div style={{
                width: 'clamp(160px, 36vw, 300px)',
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ color: '#333', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', letterSpacing: 2 }}
                >
                  …
                </motion.div>
              </div>
            )}

            {/* ── Pull cord — only shown after lamp is ready ── */}
            {!pulled && lampSrc && (
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 70 }}
                dragElastic={0.25}
                onDrag={(_, info) => { if (info.offset.y > 45) handlePull(); }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onClick={handlePull}
                whileHover={{ scale: 1.1 }}
                style={{
                  position: 'absolute',
                  // Cord hangs from the right side of the lamp shade
                  top: '48%',
                  left: '58%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'grab',
                  zIndex: 10,
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                <div style={{
                  width: 2,
                  height: 60,
                  background: 'linear-gradient(180deg, #888, #bbb)',
                  boxShadow: '0 0 8px rgba(255,200,100,0.15)',
                }} />
                <motion.div
                  animate={isDragging ? {} : { y: [0, 6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #e0b0ff, #a855f7)',
                    border: '2px solid #c084fc',
                    boxShadow: '0 0 16px rgba(168,85,247,0.7), 0 2px 8px rgba(0,0,0,0.6)',
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Hint text ─────────────────────────────────────────── */}
        {!pulled && lampSrc && (
          <motion.p
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              color: '#5a4a6a',
              fontSize: 'clamp(0.72rem, 2.2vw, 0.9rem)',
              marginTop: 32,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: 3,
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 4,
              userSelect: 'none',
            }}
          >
            ↓ Pull the cord ↓
          </motion.p>
        )}

        {/* ── "Lights on!" message ──────────────────────────────── */}
        {pulled && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{
              color: '#fde68a',
              fontSize: 'clamp(1rem, 3vw, 1.35rem)',
              marginTop: 32,
              fontFamily: "'Dancing Script', cursive",
              letterSpacing: 2,
              position: 'relative',
              zIndex: 4,
              textShadow: '0 0 24px rgba(251,191,36,0.8)',
              userSelect: 'none',
            }}
          >
            ✨ Let there be light…
          </motion.p>
        )}

        {/* ── Twinkle keyframe ─────────────────────────────────── */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.05; }
            50%       { opacity: 0.35; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

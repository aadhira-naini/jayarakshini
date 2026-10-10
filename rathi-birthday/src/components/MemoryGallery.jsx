import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
  {
    src: '/photos/photo1.jpeg',
    caption: 'This picture looks normal…',
    story: 'But only we know what happened 5 minutes before this 😂 Every photo hides a whole story.',
    date: 'A day I won\'t forget',
    placeholder: '📸',
  },
  {
    src: '/photos/photo2.jpeg',
    caption: 'Caught in the act ✨',
    story: 'This was one of those moments where we both looked at each other and just knew. No words needed.',
    date: 'Random afternoon',
    placeholder: '🌙',
  },
  {
    src: '/photos/photo3.jpeg',
    caption: 'Look at us 🥹',
    story: 'I didn\'t know at the time that this would become one of my favourite memories. But here we are.',
    date: 'That one day',
    placeholder: '💙',
  },
  {
    src: '/photos/photo4.jpeg',
    caption: 'The chaos 😭',
    story: 'Pure, unfiltered chaos. I wouldn\'t change a single second of it.',
    date: 'When we lost our minds',
    placeholder: '⚡',
  },
  {
    src: '/photos/photo5.jpeg',
    caption: 'My favourite kind of moment',
    story: 'The quiet ones. The ones no one else sees. Those are mine to keep.',
    date: 'A quiet day',
    placeholder: '🌸',
  },
  {
    src: '/photos/photo6.jpeg',
    caption: 'Evidence 😂',
    story: 'I have no explanation for this. I don\'t think either of us do. And that\'s exactly what makes it perfect.',
    date: 'Chaotic era',
    placeholder: '🎭',
  },
];

export default function MemoryGallery() {
  const [selected, setSelected] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!isAutoRotating) return;
    const animate = (now) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setRotation(prev => prev + delta * 15); // 15 degrees per second
      rafRef.current = requestAnimationFrame(animate);
    };
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isAutoRotating]);

  const handleCardClick = (index) => {
    setIsAutoRotating(false);
    setSelected(index);
  };

  const closeModal = () => {
    setSelected(null);
    setIsAutoRotating(true);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const radius = isMobile ? 140 : 260;
  const cardW = isMobile ? 120 : 180;

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'linear-gradient(180deg, rgba(13,13,43,0.3), rgba(17,17,51,0.4), rgba(10,10,26,0.3))',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 40, zIndex: 2 }}
      >
        <p style={{ color: '#a78bfa', letterSpacing: 4, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 12 }}>
          Polaroid Wall
        </p>
        <h2 className="playfair gradient-text" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
          Memory Gallery
        </h2>
        <p style={{ color: '#c4b5fd', marginTop: 12, opacity: 0.7, fontSize: '0.9rem' }}>
          Click a photo to reveal the story behind it 📷
        </p>
      </motion.div>

      {/* Circular rotating carousel */}
      <div style={{
        position: 'relative',
        width: radius * 2 + cardW + 40,
        height: radius * 2 + cardW + 40,
        maxWidth: '95vw',
        maxHeight: '95vw',
        margin: '0 auto',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Orbit ring */}
          <div style={{
            position: 'absolute',
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%',
            border: '1px solid rgba(168,85,247,0.1)',
          }} />

          {photos.map((photo, i) => {
            const angle = (i / photos.length) * 360 + rotation;
            const rad = (angle - 90) * Math.PI / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            // Scale based on position (front = bigger)
            const normalizedY = (y + radius) / (radius * 2);
            const scale = 0.6 + normalizedY * 0.5;
            const zIdx = Math.round(normalizedY * 10);
            const tilt = Math.sin(rad) * 8;

            return (
              <motion.div
                key={i}
                onClick={() => handleCardClick(i)}
                whileHover={{ scale: scale * 1.1 }}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${tilt}deg)`,
                  cursor: 'pointer',
                  background: '#fff',
                  padding: '8px 8px 28px',
                  borderRadius: 4,
                  boxShadow: `0 ${4 + zIdx}px ${16 + zIdx * 2}px rgba(0,0,0,${0.3 + normalizedY * 0.3})`,
                  width: cardW,
                  zIndex: zIdx,
                  transition: 'transform 0.1s linear',
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  background: 'linear-gradient(135deg, rgba(26,10,46,0.8), rgba(13,13,43,0.8))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span style={{ position: 'absolute', fontSize: '2.5rem', pointerEvents: 'none' }}>
                    {photo.placeholder}
                  </span>
                </div>
                <p style={{
                  textAlign: 'center',
                  marginTop: 6,
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '0.75rem',
                  color: '#333',
                  lineHeight: 1.3,
                }}>
                  {photo.caption}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff',
                padding: '20px 20px 36px',
                borderRadius: 4,
                maxWidth: 420,
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: 'linear-gradient(135deg, #1a0a2e, #0d0d2b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                borderRadius: 2,
                marginBottom: 16,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img
                  src={photos[selected].src}
                  alt={photos[selected].caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <span style={{ position: 'absolute', fontSize: '5rem' }}>
                  {photos[selected].placeholder}
                </span>
              </div>
              <p style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.3rem',
                color: '#333',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                📷 "{photos[selected].caption}"
              </p>
              <p style={{ color: '#666', textAlign: 'center', fontSize: '0.85rem', marginBottom: 12 }}>
                {photos[selected].date}
              </p>
              <p style={{
                color: '#444',
                textAlign: 'center',
                lineHeight: 1.7,
                fontSize: '0.95rem',
              }}>
                {photos[selected].story}
              </p>
              <button
                onClick={closeModal}
                style={{
                  display: 'block',
                  margin: '20px auto 0',
                  background: 'linear-gradient(135deg, #6b21a8, #3b82f6)',
                  border: 'none',
                  borderRadius: 20,
                  padding: '8px 24px',
                  color: 'white',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{
        textAlign: 'center',
        color: '#4b3a6e',
        fontSize: '0.8rem',
        marginTop: 20,
        opacity: 0.6,
        zIndex: 2,
      }}>
        📁 Add your photos in <code>/public/photos/</code> — name them photo1.jpeg through photo6.jpeg
      </p>
    </section>
  );
}

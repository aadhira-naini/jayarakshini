import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add your image paths here (place images in /public/photos/)
const photos = [
  {
    src: '/photos/photo1.jpg',
    caption: 'This picture looks normal…',
    story: 'But only we know what happened 5 minutes before this 😂 Every photo hides a whole story.',
    date: 'A day I won\'t forget',
    placeholder: '📸',
  },
  {
    src: '/photos/photo2.jpg',
    caption: 'Caught in the act ✨',
    story: 'This was one of those moments where we both looked at each other and just knew. No words needed.',
    date: 'Random afternoon',
    placeholder: '🌙',
  },
  {
    src: '/photos/photo3.jpg',
    caption: 'Look at us 🥹',
    story: 'I didn\'t know at the time that this would become one of my favourite memories. But here we are.',
    date: 'That one day',
    placeholder: '💙',
  },
  {
    src: '/photos/photo4.jpg',
    caption: 'The chaos 😭',
    story: 'Pure, unfiltered chaos. I wouldn\'t change a single second of it.',
    date: 'When we lost our minds',
    placeholder: '⚡',
  },
  {
    src: '/photos/photo5.jpg',
    caption: 'My favourite kind of moment',
    story: 'The quiet ones. The ones no one else sees. Those are mine to keep.',
    date: 'A quiet day',
    placeholder: '🌸',
  },
  {
    src: '/photos/photo6.jpg',
    caption: 'Evidence 😂',
    story: 'I have no explanation for this. I don\'t think either of us do. And that\'s exactly what makes it perfect.',
    date: 'Chaotic era',
    placeholder: '🎭',
  },
];

function PolaroidCard({ photo, index, onClick }) {
  const rotate = (index % 2 === 0 ? -1 : 1) * (Math.random() * 4 + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate * 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={() => onClick(index)}
      style={{
        cursor: 'pointer',
        background: '#fff',
        padding: '12px 12px 40px',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
        width: 'clamp(140px, 30vw, 200px)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Photo area */}
      <div style={{
        width: '100%',
        aspectRatio: '1/1',
        background: 'linear-gradient(135deg, #1a0a2e, #0d0d2b)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <img
          src={photo.src}
          alt={photo.caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.parentNode.querySelector('.placeholder-emoji').style.display = 'flex';
          }}
        />
        <span
          className="placeholder-emoji"
          style={{
            display: 'none',
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
          }}
        >
          {photo.placeholder}
        </span>
      </div>
      {/* Caption */}
      <p style={{
        textAlign: 'center',
        marginTop: 10,
        fontFamily: "'Dancing Script', cursive",
        fontSize: '0.85rem',
        color: '#333',
        lineHeight: 1.3,
      }}>
        {photo.caption}
      </p>
    </motion.div>
  );
}

export default function MemoryGallery() {
  const [selected, setSelected] = useState(null);

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #0d0d2b, #111133, #0a0a1a)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 60 }}
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

      {/* Polaroid grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        justifyContent: 'center',
        maxWidth: 900,
        margin: '0 auto',
        padding: '20px 0 40px',
      }}>
        {photos.map((photo, i) => (
          <PolaroidCard key={i} photo={photo} index={i} onClick={setSelected} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
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
                fontFamily: "'Inter', sans-serif",
              }}>
                {photos[selected].story}
              </p>
              <button
                onClick={() => setSelected(null)}
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
      }}>
        📁 Add your photos in <code>/public/photos/</code> — name them photo1.jpg through photo6.jpg
      </p>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cards = [
  {
    trigger: '💙 Click when you\'re sad',
    emoji: '🌙',
    message: "Hey. I know things feel heavy right now. But you've survived every single hard day life has thrown at you so far. Every. Single. One. And this one? You'll survive this too. I'm not going anywhere. Call me, text me, scream into the void — I'll be at the other end. You don't have to carry this alone.",
    color: '#3b82f6',
  },
  {
    trigger: '🥺 Click when you miss me',
    emoji: '💌',
    message: "Missing people is just love with nowhere to go. But here's the truth — I miss you too. Probably more than I'll ever say out loud. Distance is just a number. The connection? That's not going anywhere. Remember that one time we talked until the sky turned light? That's still us. Always will be.",
    color: '#a855f7',
  },
  {
    trigger: '🌑 Click when you feel alone',
    emoji: '⭐',
    message: "You feel alone, but you're not. I know the feeling — that silence that gets a little too loud. But Rathi, you have more people in your corner than you realize. And I am one of them. Always. Even when I'm quiet. Even when we're apart. You've never really been alone. Not for a single day since we met.",
    color: '#6b21a8',
  },
  {
    trigger: '✨ Click when you forget how amazing you are',
    emoji: '🔥',
    message: "Let me remind you then. You are someone who listens — actually listens. Someone who shows up, even when it's hard. Someone whose laugh can make the worst day lighter. Someone who cares so deeply it sometimes breaks you. That's not a weakness, Rathi. That's your superpower. You are extraordinary. And the world is genuinely better with you in it.",
    color: '#ec4899',
  },
];

export default function NeverToldYou() {
  const [openCard, setOpenCard] = useState(null);

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'radial-gradient(ellipse at 30% 70%, #1a0a2e 0%, #0a0a1a 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <p style={{ color: '#a78bfa', letterSpacing: 4, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 12 }}>
          Just for you
        </p>
        <h2 className="playfair gradient-text" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
          Things I Never Told You
        </h2>
        <p style={{ color: '#c4b5fd', marginTop: 12, opacity: 0.7 }}>
          Open a card when you need it most 🥹
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        maxWidth: 900,
        width: '100%',
      }}>
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            {/* Closed card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpenCard(i)}
              style={{
                background: `linear-gradient(135deg, ${card.color}22, ${card.color}11)`,
                border: `1px solid ${card.color}55`,
                borderRadius: 20,
                padding: '28px 24px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: `0 4px 20px ${card.color}22`,
                transition: 'box-shadow 0.3s',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>{card.emoji}</span>
              <p style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#e2d5f8',
                lineHeight: 1.4,
              }}>
                {card.trigger}
              </p>
              <p style={{ fontSize: '0.75rem', color: card.color, opacity: 0.7 }}>
                tap to open →
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Message modal */}
      <AnimatePresence>
        {openCard !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCard(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(12px)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: `linear-gradient(135deg, #1a0a2e, #0d0d2b)`,
                border: `1px solid ${cards[openCard].color}55`,
                borderRadius: 24,
                padding: '40px 32px',
                maxWidth: 500,
                width: '90%',
                textAlign: 'center',
                boxShadow: `0 0 60px ${cards[openCard].color}33`,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: '3rem', display: 'block', marginBottom: 20 }}
              >
                {cards[openCard].emoji}
              </motion.span>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: '#e2d5f8',
                lineHeight: 1.9,
                fontStyle: 'italic',
              }}>
                "{cards[openCard].message}"
              </p>
              <p style={{
                marginTop: 24,
                fontFamily: "'Dancing Script', cursive",
                color: cards[openCard].color,
                fontSize: '1.1rem',
              }}>
                — Always, me 💙
              </p>
              <button
                onClick={() => setOpenCard(null)}
                style={{
                  marginTop: 24,
                  background: `linear-gradient(135deg, ${cards[openCard].color}, #3b82f6)`,
                  border: 'none',
                  borderRadius: 20,
                  padding: '10px 28px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                I needed that 🥹
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

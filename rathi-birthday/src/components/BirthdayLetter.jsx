import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const lines = [
  "I don't know what the future holds for us.",
  "We may grow, change, get busy,",
  "and sometimes even fight…",
  "",
  "But I hope somewhere in every version of our lives,",
  "we still find our way back to each other.",
  "",
  "Because you are not just a chapter.",
  "You are one of the reasons",
  "the story is worth telling.",
];

function LetterLine({ text, index }) {
  if (text === '') return <div style={{ height: 16 }} />;
  return (
    <motion.p
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(1rem, 3vw, 1.4rem)',
        color: index < 3 ? '#c4b5fd' : index < 6 ? '#e2d5f8' : '#ffffff',
        lineHeight: 1.9,
        fontStyle: index > 5 ? 'normal' : 'italic',
        fontWeight: index > 7 ? 600 : 400,
      }}
    >
      {text}
    </motion.p>
  );
}

export default function BirthdayLetter() {
  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'linear-gradient(180deg, rgba(10,10,26,0.3) 0%, rgba(13,0,32,0.4) 50%, rgba(10,10,26,0.3) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Paper texture effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'rgba(26, 10, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 24,
          padding: 'clamp(30px, 6vw, 60px)',
          maxWidth: 680,
          width: '95%',
          position: 'relative',
        }}
      >
        {/* Decorative top */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '2.5rem', marginBottom: 16, display: 'inline-block' }}
          >
            ✉️
          </motion.div>
          <p style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: '1rem',
            color: '#a78bfa',
            letterSpacing: 3,
          }}>
            A letter for Rathi, on her birthday
          </p>
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #6b21a8, transparent)',
            marginTop: 20,
          }} />
        </div>

        {/* Letter body */}
        <div style={{ padding: '0 8px' }}>
          {lines.map((line, i) => (
            <LetterLine key={i} text={line} index={i} />
          ))}
        </div>

        {/* Sign-off */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ textAlign: 'right', marginTop: 40 }}
        >
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #6b21a8, transparent)',
            marginBottom: 20,
          }} />
          <p style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            background: 'linear-gradient(135deg, #e2d5f8, #a855f7, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
          }}>
            Happy Birthday, My Moon 🌙💙
          </p>
          <p style={{
            color: '#7c6fa0',
            fontSize: '0.9rem',
            marginTop: 8,
            fontStyle: 'italic',
          }}>
            — With all the love in my universe
          </p>
        </motion.div>

        {/* Floating stars inside letter */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            animate={{ y: [-5, 5, -5], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
            style={{
              position: 'absolute',
              fontSize: '0.8rem',
              top: `${15 + i * 15}%`,
              right: i % 2 === 0 ? '-10px' : 'auto',
              left: i % 2 !== 0 ? '-10px' : 'auto',
              opacity: 0.5,
            }}
          >
            ✨
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}

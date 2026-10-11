import { motion } from 'framer-motion';

const funnySections = [
  {
    emoji: '😭',
    title: 'Exhibit A',
    text: 'The time we said "okay I\'ll sleep now" at 12AM and then talked until 4AM. Every. Single. Time.',
    bg: '#1a0510',
    border: '#f97316',
  },
  {
    emoji: '💀',
    title: 'Exhibit B',
    text: '"I\'m not even tired." — Us, five minutes before completely losing it.',
    bg: '#0a1a05',
    border: '#22d3ee',
  },
  {
    emoji: '🤡',
    title: 'Exhibit C',
    text: 'The screenshots. You know which ones. No further explanation needed. Evidence sealed.',
    bg: '#1a1005',
    border: '#ec4899',
  },
  {
    emoji: '🫠',
    title: 'Exhibit D',
    text: 'The inside jokes that make zero sense to literally any other human on earth.',
    bg: '#05101a',
    border: '#a855f7',
  },
  {
    emoji: '🎭',
    title: 'Exhibit E',
    text: 'Us pretending to be normal people in public while internally being completely feral.',
    bg: '#100a1a',
    border: '#fbbf24',
  },
  {
    emoji: '🫡',
    title: 'Exhibit F',
    text: 'The fact that I still don\'t know how we became this close. Brain still buffering.',
    bg: '#1a0a0a',
    border: '#3b82f6',
  },
];

export default function FunnySide() {
  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Tilted banner */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -3 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, #6b21a8, #ec4899)',
          padding: '12px 40px',
          textAlign: 'center',
          transform: 'rotate(-2deg)',
          marginBottom: 60,
          boxShadow: '0 8px 30px rgba(107,33,168,0.4)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.2rem, 4vw, 2.2rem)',
            color: 'white',
            letterSpacing: 2,
          }}
        >
          😂 Evidence That We Should Not Be Allowed Together
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 24,
        maxWidth: 900,
        margin: '0 auto',
      }}>
        {funnySections.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? -1 : 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: item.bg,
              border: `1px solid ${item.border}55`,
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Corner decoration */}
            <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `${item.border}11`,
            }} />
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>
              {item.emoji}
            </span>
            <p style={{
              color: item.border,
              fontSize: '0.75rem',
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 8,
              fontWeight: 600,
            }}>
              {item.title}
            </p>
            <p style={{
              color: '#c4b5fd',
              lineHeight: 1.7,
              fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1.05rem',
            }}>
              {item.text}
            </p>

            {/* Photo slot hint */}
            <div style={{
              marginTop: 16,
              background: `${item.border}11`,
              border: `1px dashed ${item.border}44`,
              borderRadius: 8,
              padding: '10px',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: `${item.border}88`,
            }}>
              📷 Add a screenshot or photo here
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center',
          marginTop: 48,
          fontFamily: "'Dancing Script', cursive",
          fontSize: '1.3rem',
          color: '#a78bfa',
        }}
      >
        Honestly? I wouldn't change any of it. Not one bit. 💙
      </motion.p>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const chapters = [
  {
    number: '01',
    title: 'The Beginning',
    emoji: '🌙',
    date: 'Once upon a time…',
    description: 'Epdiyo vera yarukudayo best friend aaga vendiya unoda fate enkita matikichu ',
    detail: 'unaku epdi nu theriyala, but unkuda na close aanathuku oru nal kuda feel panathu illa ',
    color: '#6b21a8',
  },
  {
    number: '02',
    title: 'The Funny Moments',
    emoji: '😂',
    date: 'Way too many to count',
    description: 'Namba sirchi vilayaduna days la countla ya illa ',
    detail: 'Yepaiyo nadantha nenachi siricha nalum erruku',
    color: '#f97316',
  },
  {
    number: '03',
    title: 'The Fights',
    emoji: '⚡',
    date: 'When we were both idiots',
    description: 'Sirichathu athigama illa fight athigama patha sanda pota naltha athigam.',
    detail: 'onu onu yosichi patha, rendu perum care tha kovama express pani errupom. ',
    color: '#ef4444',
  },
  {
    number: '04',
    title: 'Random Chats at Odd Hours',
    emoji: '🌃',
    date: '11PM — 1AM mostly',
    description: 'oru conversation oru hr pogum ',
    detail: 'late night conversation 3 perum conf la pesurathu oru stress bruster.',
    color: '#3b82f6',
  },
  {
    number: '05',
    title: 'Best Memories',
    emoji: '✨',
    date: 'A random one School day ',
    description: 'first time long time call.',
    detail: 'Aniku tha madam first day call 53min pesunathuku, madam enum konjam neram line la na 1hr aagitu screenshot edukanum na story poda poren nu ennum 20min pesunom. still its fresh in my mind.',
    color: '#a855f7',
  },
  {
    number: '06',
    title: 'Today',
    emoji: '🎂',
    date: 'Your Birthday 🎉',
    description: 'just revealing how much you mean to me.',
    detail: 'Already na nechathu onu, nadakurathu onaa pothu. I hope your Day will be gud. ',
    color: '#ec4899',
  },
];

export default function Timeline() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'transparent',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <p style={{ color: '#a78bfa', letterSpacing: 4, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: 12 }}>
          Our Story
        </p>
        <h2
          className="playfair gradient-text"
          style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.2 }}
        >
          Our Memories Timeline
        </h2>
        <p style={{ color: '#c4b5fd', marginTop: 16, fontSize: '1rem', opacity: 0.7 }}>
          Tap any chapter to read more 🌙
        </p>
      </motion.div>

      {/* Vertical line */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 200,
        bottom: 100,
        width: 2,
        background: 'linear-gradient(180deg, transparent, #6b21a8, #3b82f6, transparent)',
        transform: 'translateX(-50%)',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
        {chapters.map((ch, i) => {
          const isLeft = i % 2 === 0;
          const isOpen = expanded === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                marginBottom: 48,
                position: 'relative',
              }}
            >
              {/* Chapter card */}
              <motion.div
                onClick={() => setExpanded(isOpen ? null : i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: 'calc(50% - 30px)',
                  background: 'rgba(26, 10, 46, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${ch.color}44`,
                  borderRadius: 16,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  boxShadow: isOpen ? `0 0 30px ${ch.color}44` : 'none',
                  transition: 'box-shadow 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.5rem' }}>{ch.emoji}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: ch.color, letterSpacing: 3, textTransform: 'uppercase' }}>
                      Chapter {ch.number}
                    </p>
                    <h3 className="playfair" style={{ fontSize: '1.1rem', color: '#e2d5f8' }}>
                      {ch.title}
                    </h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#7c6fa0', marginBottom: 8 }}>{ch.date}</p>
                <p style={{ fontSize: '0.9rem', color: '#c4b5fd', lineHeight: 1.6 }}>{ch.description}</p>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: `1px solid ${ch.color}33`,
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '1.05rem',
                        color: '#e2d5f8',
                        lineHeight: 1.8,
                      }}>
                        {ch.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Center dot */}
              <motion.div
                whileInView={{ scale: [0, 1.4, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 20,
                  transform: 'translateX(-50%)',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: ch.color,
                  boxShadow: `0 0 12px ${ch.color}`,
                  zIndex: 1,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

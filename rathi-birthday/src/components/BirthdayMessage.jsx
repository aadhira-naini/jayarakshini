import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

function AnimatedLine({ text, delay = 0, className = '', style = {} }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      className={className}
      style={style}
    >
      {text}
    </motion.div>
  );
}

export default function BirthdayMessage() {
  return (
    <section
      className="section-container"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(26,10,46,0.4) 0%, rgba(10,10,26,0.3) 80%)',
        textAlign: 'center',
        gap: 32,
        padding: '80px 20px',
      }}
    >
      {/* Decorative moon */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginBottom: 8 }}
      >
        🌙
      </motion.div>

      <AnimatedLine
        text="Today isn't just another day…"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.6rem, 5vw, 3.5rem)',
          color: '#e2d5f8',
          fontStyle: 'italic',
          maxWidth: 700,
        }}
        delay={0.1}
      />

      <AnimatedLine
        text="Because on this day,"
        style={{
          fontSize: 'clamp(1rem, 3vw, 1.6rem)',
          color: '#a78bfa',
          fontWeight: 300,
          letterSpacing: 2,
        }}
        delay={0.3}
      />

      <AnimatedLine
        text="my favorite person entered this world."
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.4rem, 4.5vw, 2.8rem)',
          background: 'linear-gradient(135deg, #e2d5f8, #a855f7, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          maxWidth: 700,
        }}
        delay={0.5}
      />

      <AnimatedLine
        text="💙"
        style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
        delay={0.8}
      />

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          height: 1,
          width: 'min(400px, 80vw)',
          background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
          margin: '16px auto',
        }}
      />

      <AnimatedLine
        text='"Some people change your life just by existing in it.  You are one of those people, Rathi."'
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 'clamp(1.1rem, 3vw, 1.7rem)',
          color: '#c4b5fd',
          maxWidth: 600,
          lineHeight: 1.8,
          opacity: 0.9,
        }}
        delay={0.7}
      />
    </section>
  );
}

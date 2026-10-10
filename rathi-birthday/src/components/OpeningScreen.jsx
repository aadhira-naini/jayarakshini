import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const balloonColors = ['#a855f7', '#3b82f6', '#ec4899', '#f97316', '#22d3ee', '#fbbf24', '#ef4444', '#10b981', '#8b5cf6', '#06b6d4', '#f43f5e', '#d946ef'];

function Balloon({ color, x, delay, isHeart }) {
  const shapeStyle = isHeart ? {
    width: 50, height: 50, background: color, position: 'relative',
    transform: 'rotate(-45deg)', boxShadow: `0 0 20px ${color}88`,
    filter: 'brightness(1.1)', borderRadius: '50% 50% 50% 0'
  } : {
    width: 50, height: 65, background: color,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    position: 'relative', boxShadow: `0 0 20px ${color}88`, filter: 'brightness(1.1)',
  };
  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ y: '-30vh', opacity: 1 }}
      transition={{ duration: 6 + Math.random() * 4, delay, ease: 'easeOut' }}
      style={{ position: 'fixed', left: `${x}%`, bottom: 0, zIndex: 5 }}
    >
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <div style={shapeStyle}>
          {!isHeart && (
            <div style={{
              position: 'absolute', bottom: -2, left: '50%',
              transform: 'translateX(-50%)', width: 8, height: 8,
              background: color, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              filter: 'brightness(0.8)',
            }} />
          )}
        </div>
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 100, background: `${color}88`, margin: '0 auto', transformOrigin: 'top center' }}
        />
      </motion.div>
    </motion.div>
  );
}

const emojis = ['🎉', '✨', '💜', '🌙', '🌟', '💖', '🎂'];

function EmojiRain() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: `${Math.random() * 100}vw`, opacity: 0, rotate: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 1, 0], rotate: Math.random() * 360 }}
          transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2, ease: 'linear', repeat: Infinity }}
          style={{ position: 'absolute', fontSize: `${10 + Math.random() * 20}px` }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
}

/* ── 120 CSS twinkling stars ──────────────────────────────────────── */
const STAR_DATA = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: (1 + Math.random() * 2.5) * 1.4,
  dur: 1.8 + Math.random() * 3,
  delay: Math.random() * 4,
  brightness: 0.5 + Math.random() * 0.5,
}));

function NightSkyStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {STAR_DATA.map(s => (
        <motion.div
          key={s.id}
          animate={{ opacity: [s.brightness * 0.3, s.brightness, s.brightness * 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,0.8)`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Glowing crescent Moon top-right ─────────────────────────────── */
function Moon() {
  return (
    <div style={{ position: 'absolute', top: '7%', right: '10%', width: 110, height: 110, zIndex: 2, pointerEvents: 'none' }}>
      {/* Outer glow halo */}
      <motion.div
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -40, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230,220,255,0.15) 0%, transparent 65%)',
          boxShadow: '0 0 80px 30px rgba(200,180,255,0.12)',
        }}
      />
      {/* Moon disc */}
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 38%, #fff9e6 0%, #f0e8c8 35%, #d4c090 70%, #b8a060 100%)',
        boxShadow: '0 0 30px 10px rgba(255,240,180,0.4), 0 0 70px 25px rgba(255,220,100,0.15), inset -14px -10px 0 rgba(160,130,60,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Crescent cut-out shadow */}
        <div style={{
          position: 'absolute', top: '-10%', left: '22%',
          width: '90%', height: '110%', borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(5,5,20,0.84) 55%, transparent 72%)',
        }} />
        {/* Craters */}
        <div style={{ position: 'absolute', width: 11, height: 11, borderRadius: '50%', top: '20%', left: '13%', background: 'rgba(160,130,60,0.35)', boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', width: 7,  height: 7,  borderRadius: '50%', top: '55%', left: '7%',  background: 'rgba(160,130,60,0.28)', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)' }} />
        <div style={{ position: 'absolute', width: 5,  height: 5,  borderRadius: '50%', top: '36%', left: '5%',  background: 'rgba(160,130,60,0.22)' }} />
      </div>
      {/* Nearby sparkle stars */}
      {[
        { top: '-22%', left: '-32%', size: 5.6 },
        { top: '8%',   left: '-42%', size: 4.2 },
        { top: '-32%', left: '8%',   size: 4.2 },
        { top: '118%', left: '-28%', size: 3.5 },
        { top: '-8%',  right: '-38%', size: 3.5 },
      ].map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2 + i * 0.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', ...s,
            width: s.size, height: s.size,
            borderRadius: '50%', background: '#fff',
            boxShadow: `0 0 6px rgba(255,255,255,0.9)`,
          }}
        />
      ))}
    </div>
  );
}

function GlowingRings() {
  return (
    <div style={{ position: 'absolute', inset: -50, pointerEvents: 'none', zIndex: -1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          animate={{
            rotate: 360,
            scale: [1, 1.1 + ring * 0.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            rotate: { duration: 10 + ring * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 3 + ring, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3 + ring, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            width: 120 + ring * 60, height: 120 + ring * 60,
            borderRadius: '50%',
            border: `2px solid rgba(168, 85, 247, ${0.4 - ring * 0.1})`,
            boxShadow: `0 0 ${20 * ring}px rgba(59, 130, 246, 0.2)`
          }}
        />
      ))}
    </div>
  );
}

function LightRays() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 2, opacity: [0, 0.5, 0] }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{
        position: 'absolute', inset: -200,
        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 30deg, transparent 60deg, rgba(255,255,255,0.3) 90deg, transparent 120deg, rgba(255,255,255,0.3) 150deg, transparent 180deg, rgba(255,255,255,0.3) 210deg, transparent 240deg, rgba(255,255,255,0.3) 270deg, transparent 300deg, rgba(255,255,255,0.3) 330deg, transparent 360deg)',
        zIndex: -1, pointerEvents: 'none', borderRadius: '50%',
      }}
    />
  );
}

function ParticleTrail() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40 - Math.random() * 40],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: `${40 + Math.random() * 20}%`, top: `${40 + Math.random() * 20}%`,
            width: 4 + Math.random() * 4, height: 4 + Math.random() * 4,
            borderRadius: '50%',
            background: ['#fff', '#a855f7', '#3b82f6'][Math.floor(Math.random() * 3)],
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function OpeningScreen({ onOpen }) {
  const [phase, setPhase] = useState('hint'); // hint → opened → animating → done
  const [showBalloons, setShowBalloons] = useState(false);
  const [showRays, setShowRays] = useState(false);
  const audioRef = useRef(null);

  const fireConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ['#a855f7', '#3b82f6', '#ec4899', '#fbbf24', '#f8f4ff'];
    const frame = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleOpen = () => {
    setShowRays(true);
    setPhase('opened');
    setShowBalloons(true);
    fireConfetti();
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      setPhase('animating');
      setTimeout(() => {
        setPhase('done');
        setTimeout(() => onOpen(), 1800);
      }, 4500);
    }, 500);
  };

  const happyBirthdayText = "Happy Birthday".split("");
  const rathiText = "Rathi".split("");

  return (
    <AnimatePresence>
      {phase !== 'exiting' && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ══ NIGHT SKY BACKGROUND — cinematic zoom-in ══ */}
          <motion.div
            initial={{ scale: 1.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              background: `
                radial-gradient(ellipse 80% 60% at 80% 12%, rgba(45,18,90,0.85) 0%, transparent 58%),
                radial-gradient(ellipse 60% 50% at 15% 85%, rgba(8,12,50,0.75) 0%, transparent 55%),
                radial-gradient(ellipse 100% 100% at 50% 50%, #090718 0%, #050412 45%, #020209 100%)
              `,
            }}
          />

          {/* ══ STARS — zoom in with the sky ══ */}
          <motion.div
            initial={{ scale: 1.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ position: 'absolute', inset: 0, zIndex: 1 }}
          >
            <NightSkyStars />
          </motion.div>

          {/* ══ NEBULA GLOW — zoom in ══ */}
          <motion.div
            initial={{ scale: 1.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: `
                radial-gradient(ellipse 55% 35% at 28% 42%, rgba(88,28,135,0.20) 0%, transparent 70%),
                radial-gradient(ellipse 42% 30% at 72% 62%, rgba(30,58,138,0.16) 0%, transparent 70%)
              `,
            }}
          />

          {/* ══ MOON — zooms in with sky ══ */}
          <motion.div
            initial={{ scale: 1.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
          >
            <Moon />
          </motion.div>

          {/* Audio */}
          <audio ref={audioRef} src="/birthday.mp3" loop />

          {/* Balloons */}
          {showBalloons && [...Array(12)].map((_, i) => (
            <Balloon
              key={i}
              color={balloonColors[i % balloonColors.length]}
              x={5 + i * (90 / 11)}
              delay={Math.random() * 1.5}
              isHeart={i % 3 === 0}
            />
          ))}

          {/* Emoji Rain */}
          {(phase === 'opened' || phase === 'animating') && <EmojiRain />}

          {/* ══ FOREGROUND CONTENT — fades in after zoom settles ══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.6 }}
            style={{
              position: 'relative', zIndex: 10, width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              {phase === 'hint' && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  style={{ textAlign: 'center', padding: '0 20px', zIndex: 10, position: 'relative' }}
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    style={{ fontSize: 80, marginBottom: 24, position: 'relative' }}
                  >
                    🌙
                  </motion.div>
                  <p style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                    color: '#e2d5f8', marginBottom: 16, letterSpacing: 1, position: 'relative'
                  }}>
                    Hey… don't scroll too fast 👀
                  </p>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    color: '#a78bfa', marginBottom: 48, opacity: 0.8, position: 'relative'
                  }}>
                    Something special is waiting for you…
                  </p>

                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <GlowingRings />
                    <ParticleTrail />
                    {showRays && <LightRays />}
                    <motion.button
                      onClick={handleOpen}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, #6b21a8, #3b82f6)',
                        border: 'none', borderRadius: 50,
                        padding: '18px 48px', color: 'white',
                        fontSize: '1.2rem',
                        fontFamily: "'Dancing Script', cursive",
                        fontWeight: 700, letterSpacing: 1,
                        boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(59,130,246,0.2)',
                        animation: 'pulse-glow 2s ease-in-out infinite', zIndex: 2
                      }}
                    >
                      🎁 Open Your Surprise
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {(phase === 'opened' || phase === 'animating') && (
                <motion.div
                  key="name"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                  style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', position: 'relative' }}
                >
                  {showRays && <LightRays />}
                  <div style={{
                    fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: '#a78bfa',
                    marginBottom: 8, letterSpacing: 4, textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif", fontWeight: 300,
                    display: 'flex', justifyContent: 'center', gap: '4px'
                  }}>
                    {happyBirthdayText.map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05, type: 'spring', stiffness: 150 }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </div>
                  <div style={{
                    fontSize: 'clamp(3rem, 12vw, 9rem)',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700, lineHeight: 1, marginBottom: 12,
                    display: 'flex', justifyContent: 'center',
                  }}>
                    {rathiText.map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 40, rotateX: -90 }}
                        animate={{
                          opacity: 1, y: 0, rotateX: 0,
                          color: ['#a855f7', '#3b82f6', '#ec4899', '#a855f7'],
                          textShadow: [
                            '0 0 10px rgba(168,85,247,0.5)',
                            '0 0 20px rgba(59,130,246,0.8)',
                            '0 0 10px rgba(236,72,153,0.5)',
                            '0 0 10px rgba(168,85,247,0.5)'
                          ]
                        }}
                        transition={{
                          delay: 1.0 + index * 0.1, duration: 0.8,
                          color: { duration: 3, repeat: Infinity, ease: 'linear' },
                          textShadow: { duration: 3, repeat: Infinity, ease: 'linear' }
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, type: 'spring' }}
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: 'clamp(1.2rem, 4vw, 2rem)', color: '#e2d5f8',
                    }}
                  >
                    🌙 My Moon 💙
                  </motion.p>
                  {phase === 'animating' && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      style={{ marginTop: 40, fontSize: '1rem', color: '#a78bfa', opacity: 0.7 }}
                    >
                      ✨ Scroll down to explore your universe…
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeBackgrounds } from '../utils/removeBackground';

/* ─── Butterfly image paths (public folder) ──────────────────────── */
const RAW_IMAGES = [
  '/butterfly1.jpeg',
  '/butterfly2.jpeg',
  '/butterfly3.jpeg',
  '/butterfly4.jpeg',
  '/butterfly5.jpeg',
  '/butterfly6.jpeg',
  '/butterfly7.jpeg',
];

/* ─── Per-butterfly glow colours (match each image's dominant hue) ─ */
const GLOWS = [
  'rgba(100,180,255,0.8)',  // blue
  'rgba(180,120,255,0.8)',  // lavender
  'rgba(140,50,220,0.8)',   // purple
  'rgba(60,130,255,0.8)',   // royal blue
  'rgba(180,130,255,0.8)',  // soft purple
  'rgba(230,100,180,0.8)',  // pink
  'rgba(100,200,180,0.8)',  // teal
];

/* ─── Friendship questions ───────────────────────────────────────── */
const QUESTIONS = [
  {
    label: 'Step I',
    title: 'Identity Verification',
    subtitle: 'Who is the most endearingly annoying person in this friendship?',
    options: [
      { text: 'Definitely me',         correct: true  },
      { text: 'Probably you',          correct: false },
      { text: "It's mutual, honestly", correct: false },
    ],
    correctMsg: '✓ Verified. Welcome back.',
    wrongMsg:   'Incorrect. Reconsider your answer.',
    isLast: false,
  },
  {
    label: 'Step II',
    title: 'Friendship Authentication',
    subtitle: 'Do you genuinely consider yourself my closest friend?',
    options: [
      { text: 'Without question',        correct: true  },
      { text: 'I was coerced into this', correct: true  },
      { text: "Where's the exit?",       correct: false },
    ],
    correctMsg: '✓ Authenticated. Proceed.',
    wrongMsg:   'Access denied. This friendship is permanent.',
    isLast: false,
  },
  {
    label: 'Step III',
    title: 'Affection Calibration',
    subtitle: 'How deeply do you value this friendship?',
    options: [
      { text: 'Moderately',                             correct: false },
      { text: 'Considerably',                           correct: false },
      { text: 'Completely',                             correct: false },
      { text: "Immeasurably, and it's terrifying",      correct: true  },
    ],
    correctMsg: '✓ Calibration complete. You passed.',
    wrongMsg:   'Recalibrating…',
    isLast: false,
  },
  {
    label: 'Final Step',
    title: 'Final Clearance',
    subtitle: 'Are you prepared for what awaits?',
    options: [
      { text: 'Absolutely',            correct: true  },
      { text: "I'm nervous but ready", correct: true  },
      { text: 'Let me reconsider',     correct: false }, // triggers please.mp4
    ],
    correctMsg: '✓ Access granted.',
    wrongMsg:   'Reconsideration denied. Proceed.',
    isLast: true,
  },
];

/* ─── Net cursor (SVG data-URL) ──────────────────────────────────── */
const NET_SVG = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="44" height="52" viewBox="0 0 44 52">
  <line x1="22" y1="26" x2="22" y2="50" stroke="#c084fc" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="22" cy="15" r="14" fill="none" stroke="#e0e7ff" stroke-width="2.5"/>
  <path d="M10 20 Q16 34 22 36 Q28 34 34 20" fill="none" stroke="rgba(224,231,255,0.45)" stroke-width="1.2"/>
  <path d="M11 15 Q22 34 33 15" fill="none" stroke="rgba(224,231,255,0.3)" stroke-width="1"/>
  <line x1="22" y1="15" x2="22" y2="36" stroke="rgba(224,231,255,0.3)" stroke-width="1"/>
  <circle cx="22" cy="7" r="2" fill="#fbbf24" opacity="0.9"/>
  <circle cx="14" cy="9" r="1.2" fill="#f472b6" opacity="0.7"/>
  <circle cx="30" cy="9" r="1.2" fill="#818cf8" opacity="0.7"/>
</svg>`);
const NET_CURSOR = `url("data:image/svg+xml;utf8,${NET_SVG}") 22 15, crosshair`;

/* ─── Inject / remove global net-cursor style on <body> ─────────── */
const STYLE_ID = 'butterfly-net-cursor';
function setNetCursor(on) {
  let el = document.getElementById(STYLE_ID);
  if (on) {
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = `*, *::before, *::after { cursor: ${NET_CURSOR} !important; }`;
  } else {
    if (el) el.remove();
  }
}

/* ─── Create a butterfly physics object ──────────────────────────── */
function makeBf(id) {
  return {
    id,
    imgIdx: id % RAW_IMAGES.length,
    x:   120 + Math.random() * (window.innerWidth  - 240),
    y:   120 + Math.random() * (window.innerHeight - 280),
    vx:  (Math.random() - 0.5) * 3.2,
    vy:  (Math.random() - 0.5) * 3.2,
    size: 88 + Math.random() * 44,
    flip: false,
    waveOff: Math.random() * Math.PI * 2,
  };
}

/* ─── Particle burst on catch ────────────────────────────────────── */
function Burst({ x, y, color }) {
  const pts = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * Math.PI * 2,
    dist:  55 + Math.random() * 65,
    size:  4  + Math.random() * 5,
  }));
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.85 }}
      style={{ position: 'fixed', left: x, top: y, zIndex: 80, pointerEvents: 'none' }}
    >
      {pts.map((p, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{ x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist, scale: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: color, boxShadow: `0 0 8px ${color}`,
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.55 }}
        style={{
          position: 'absolute', width: 28, height: 28, borderRadius: '50%',
          border: `2px solid ${color}`, left: -14, top: -14,
        }}
      />
    </motion.div>
  );
}

/* ─── Slim toast (auto-vanishes) ─────────────────────────────────── */
function Toast({ message, visible, onDone }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -18, x: '-50%' }}
          animate={{ opacity: 1,  y: 0,   x: '-50%' }}
          exit={{   opacity: 0,  y: -18,  x: '-50%' }}
          style={{
            position: 'fixed', top: 18, left: '50%',
            background: 'rgba(8,5,22,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(168,85,247,0.35)',
            padding: '13px 28px', borderRadius: 12,
            color: '#f0e8ff',
            fontFamily: "'Inter', sans-serif", fontSize: '0.93rem',
            zIndex: 400, maxWidth: '90vw', textAlign: 'center',
            boxShadow: '0 6px 36px rgba(0,0,0,0.7)',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Option button ──────────────────────────────────────────────── */
function OptionBtn({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.025, background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.55)', boxShadow: '0 0 22px rgba(168,85,247,0.22)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: 'block', width: '100%', marginBottom: 11,
        padding: '15px 22px', borderRadius: 12,
        border: '1px solid rgba(168,85,247,0.22)',
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(8px)',
        color: '#ede5ff',
        fontFamily: "'Inter', sans-serif", fontSize: '0.97rem',
        cursor: 'pointer', textAlign: 'center',
        transition: 'all 0.22s ease', letterSpacing: '0.25px',
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Progress dots ──────────────────────────────────────────────── */
function Dots({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 26, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i}
          animate={{ scale: i === current ? 1.5 : 1 }}
          style={{
            height: 4, borderRadius: 2,
            width: i === current ? 30 : 18,
            background: i <= current
              ? 'linear-gradient(90deg,#a855f7,#3b82f6)'
              : 'rgba(255,255,255,0.1)',
            boxShadow: i <= current ? '0 0 10px rgba(168,85,247,0.5)' : 'none',
            transition: 'all 0.4s ease',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Correct-answer video (gemini clip) ─────────────────────────── */
function VideoReward({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
    const t = setTimeout(() => { if (ref.current) ref.current.pause(); onDone(); }, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        width: '100%', maxWidth: 290, borderRadius: 18, overflow: 'hidden',
        border: '2px solid rgba(251,191,36,0.5)',
        boxShadow: '0 0 40px rgba(251,191,36,0.2)',
        marginBottom: 16,
      }}
    >
      <video ref={ref} src="/video/gemini_generated_video_43ec5079.mp4"
        muted playsInline style={{ width: '100%', display: 'block' }} />
      <motion.div
        initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        style={{ height: 3, background: 'linear-gradient(90deg,#fbbf24,#f472b6,#818cf8)', transformOrigin: 'left' }}
      />
    </motion.div>
  );
}

/* ─── Final correct-answer love video ────────────────────────────── */
function LoveVideo({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    let t;
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {
        t = setTimeout(() => { if (ref.current) ref.current.pause(); onDone(); }, 8000);
      });
    }
    return () => { if (t) clearTimeout(t); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        position: 'relative',
        width: '100%', maxWidth: 290, borderRadius: 18, overflow: 'hidden',
        border: '2px solid rgba(236,72,153,0.8)',
        boxShadow: '0 0 50px rgba(236,72,153,0.5)',
        marginBottom: 16,
      }}
    >
      <video ref={ref} src="/video/love.mp4"
        playsInline style={{ width: '100%', display: 'block' }} onEnded={onDone} />
      <button 
        onClick={onDone}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
          color: 'white', width: 28, height: 28, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', zIndex: 10, padding: 0
        }}
      >
        ✕
      </button>
    </motion.div>
  );
}

/* ─── Wrong-answer angry bird video ──────────────────────────────── */
function AngryBirdVideo({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
    const t = setTimeout(() => { if (ref.current) ref.current.pause(); onDone(); }, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        width: '100%', maxWidth: 290, borderRadius: 18, overflow: 'hidden',
        border: '2px solid rgba(239,68,68,0.5)',
        boxShadow: '0 0 40px rgba(239,68,68,0.25)',
        marginBottom: 16,
      }}
    >
      <video ref={ref} src="/video/angry bird.mp4"
        muted playsInline style={{ width: '100%', display: 'block' }} />
      <motion.div
        initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        style={{ height: 3, background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24)', transformOrigin: 'left' }}
      />
    </motion.div>
  );
}

/* ─── Second wrong-answer angry bird 2 video ─────────────────────── */
function AngryBird2Video({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
    const t = setTimeout(() => { if (ref.current) ref.current.pause(); onDone(); }, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        width: '100%', maxWidth: 290, borderRadius: 18, overflow: 'hidden',
        border: '2px solid rgba(239,68,68,0.7)',
        boxShadow: '0 0 50px rgba(239,68,68,0.4)',
        marginBottom: 16,
      }}
    >
      <video ref={ref} src="/video/angrybird_2.mp4"
        muted playsInline style={{ width: '100%', display: 'block' }} />
      <motion.div
        initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        style={{ height: 3, background: 'linear-gradient(90deg,#dc2626,#ef4444,#f97316)', transformOrigin: 'left' }}
      />
    </motion.div>
  );
}

/* ─── Third wrong-answer angry bird 3 video (angry_3.mp4) ────────── */
function AngryBird3Video({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    let t;
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {
        // Fallback safety timeout if autoplay with sound fails
        t = setTimeout(() => { if (ref.current) ref.current.pause(); onDone(); }, 5000);
      });
    }
    return () => { if (t) clearTimeout(t); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        position: 'relative',
        width: '100%', maxWidth: 240, borderRadius: 18, overflow: 'hidden',
        border: '2px solid rgba(220,38,38,0.9)',
        boxShadow: '0 0 60px rgba(220,38,38,0.6)',
        marginBottom: 16,
      }}
    >
      <video ref={ref} src="/video/angry_3.mp4"
        playsInline style={{ width: '100%', display: 'block' }} onEnded={onDone} />
      <button 
        onClick={onDone}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
          color: 'white', width: 28, height: 28, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', zIndex: 10, padding: 0
        }}
      >
        ✕
      </button>
    </motion.div>
  );
}

/* ─── "Please" video for last-question refusal ───────────────────── */
function PleaseVideo({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
    // auto-dismiss after 8s, or user can skip
    const t = setTimeout(() => { if (ref.current) ref.current.pause(); onDone(); }, 8000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{   opacity: 0, scale: 0.7 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        width: '100%', maxWidth: 290, borderRadius: 18, overflow: 'hidden',
        border: '2px solid rgba(236,72,153,0.5)',
        boxShadow: '0 0 40px rgba(236,72,153,0.3)',
        marginBottom: 12,
      }}
    >
      <video ref={ref} src="/video/please.mp4"
        playsInline style={{ width: '100%', display: 'block' }} />
      <motion.div
        initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
        transition={{ duration: 8, ease: 'linear' }}
        style={{ height: 3, background: 'linear-gradient(90deg,#ec4899,#a855f7,#3b82f6)', transformOrigin: 'left' }}
      />
      <motion.button
        whileHover={{ opacity: 0.85 }}
        onClick={onDone}
        style={{
          width: '100%', padding: '10px', border: 'none',
          background: 'rgba(236,72,153,0.15)',
          color: '#f9a8d4', fontFamily: "'Dancing Script', cursive",
          fontSize: '1rem', cursor: 'pointer', letterSpacing: 1,
        }}
      >
        ok ok, I'm ready 💖
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   Phase flow per step:
     'loading'     → images processed
     'flying'      → ALL butterflies fly, net cursor active
                     user clicks one → 'question'
     'question'    → answer shown
                     correct → 'video'
                     wrong (1st) → 'angryvideo'  (then back to 'question')
                     wrong (2nd) → 'angryvideo2' (then back to 'question')
                     last Q wrong refusal → 'pleasevideo' (then back to 'question')
     'video'       → 5 s correct-answer clip → 'correct'
     'angryvideo'  → 5 s angry bird clip     → back to 'question'
     'angryvideo2' → 5 s angry bird 2 clip   → back to 'question'
     'pleasevideo' → 8 s please clip         → back to 'question'
     'correct'     → 1.2 s pause             → next step or 'done'
     'done'        → onPass()
═══════════════════════════════════════════════════════════════════ */
export default function BestFriendGate({ onPass }) {
  /* ── State ─────────────────────────────────────────────────── */
  const [processedImgs, setProcessedImgs] = useState([]);
  const [butterflies,   setButterflies]   = useState([]);
  const [step,          setStep]          = useState(0);
  const [phase,         setPhase]         = useState('loading');
  // 'loading'|'flying'|'question'|'video'|'angryvideo'|'angryvideo2'|'pleasevideo'|'correct'|'done'
  const [caughtIdx,     setCaughtIdx]     = useState(0);
  const [bursts,        setBursts]        = useState([]);
  const [toast,         setToast]         = useState({ msg: '', on: false });
  const [wrongCount,    setWrongCount]    = useState(0); // wrong clicks per question

  const rafRef = useRef(null);

  /* ── 1. Load & strip backgrounds from all 7 images ──────────── */
  useEffect(() => {
    removeBackgrounds(RAW_IMAGES, { threshold: 68 }).then((processed) => {
      setProcessedImgs(processed);
      setButterflies(RAW_IMAGES.map((_, i) => makeBf(i)));
      setPhase('flying');
    });
  }, []);

  /* ── 2. Net cursor — active only while butterflies are flying ── */
  useEffect(() => {
    setNetCursor(phase === 'flying');
    return () => setNetCursor(false);
  }, [phase]);

  /* ── 3. Toast auto-dismiss ───────────────────────────────────── */
  useEffect(() => {
    if (!toast.on) return;
    const t = setTimeout(() => setToast(v => ({ ...v, on: false })), 2200);
    return () => clearTimeout(t);
  }, [toast.on, toast.msg]);

  /* ── 4. Butterfly physics loop ───────────────────────────────── */
  useEffect(() => {
    if (phase === 'done' || phase === 'loading') return;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const now = Date.now();

      setButterflies(prev => prev.map(b => {
        let { x, y, vx, vy, waveOff, size, flip } = b;

        vx += Math.sin(now * 0.0012 + b.id * 1.9 + waveOff) * 0.13;
        vy += Math.cos(now * 0.0016 + b.id * 1.5 + waveOff) * 0.10;

        const spd = Math.sqrt(vx * vx + vy * vy);
        if (spd > 4.2) { vx *= 4.2 / spd; vy *= 4.2 / spd; }
        if (spd < 0.9) { vx *= 1.5; vy *= 1.5; }

        x += vx; y += vy;

        const pad = size / 2 + 8;
        if (x < pad)        { x = pad;        vx =  Math.abs(vx); flip = false; }
        if (x > W - pad)    { x = W - pad;    vx = -Math.abs(vx); flip = true;  }
        if (y < pad)        { y = pad;         vy =  Math.abs(vy); }
        if (y > H - pad)    { y = H - pad;     vy = -Math.abs(vy); }

        return { ...b, x, y, vx, vy, flip };
      }));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase]);

  /* ── Handlers ───────────────────────────────────────────────── */
  const handleCatch = useCallback((bfId, imgIdx, cx, cy) => {
    if (phase !== 'flying') return;

    const color = GLOWS[imgIdx];
    const burstId = Date.now();
    setBursts(p => [...p, { id: burstId, x: cx, y: cy, color }]);
    setTimeout(() => setBursts(p => p.filter(b => b.id !== burstId)), 950);

    setButterflies(p => p.filter(b => b.id !== bfId));
    setCaughtIdx(imgIdx);
    setToast({ msg: '', on: false });
    setWrongCount(0); // reset per question
    setPhase('question');
  }, [phase]);

  const handleAnswer = (correct, isLastQRefusal = false) => {
    if (correct) {
      setToast({ msg: QUESTIONS[step].correctMsg, on: true });
      setTimeout(() => setToast(v => ({ ...v, on: false })), 1000);
      setWrongCount(0);
      if (step === QUESTIONS.length - 1) {
        setPhase('lovevideo');
      } else {
        setPhase('video');
      }
    } else {
      // Last question "Let me reconsider" → please video
      if (isLastQRefusal) {
        setPhase('pleasevideo');
      } else {
        // 1st wrong → angryvideo, 2nd wrong → angryvideo2, 3rd+ wrong → angryvideo3
        setWrongCount(prev => {
          const next = prev + 1;
          if (next === 1) setPhase('angryvideo');
          else if (next === 2) setPhase('angryvideo2');
          else setPhase('angryvideo3');
          return next;
        });
      }
    }
  };

  const handleVideoDone = useCallback(() => {
    setPhase('correct');
    setToast({ msg: '', on: false });

    setTimeout(() => {
      const next = step + 1;
      if (next >= QUESTIONS.length) {
        setPhase('done');
        setTimeout(() => onPass(), 1400);
      } else {
        setStep(next);
        setToast({ msg: '', on: false });
        setPhase('flying');
      }
    }, 1200);
  }, [step, onPass]);

  // After angry bird video finishes → return to question
  const handleAngryVideoDone = useCallback(() => {
    setPhase('question');
  }, []);

  // After angry bird 2 video finishes → return to question
  const handleAngryVideo2Done = useCallback(() => {
    setPhase('question');
  }, []);

  // After angry bird 3 video finishes → return to question
  const handleAngryVideo3Done = useCallback(() => {
    setPhase('question');
  }, []);

  // After please video finishes → return to question
  const handlePleaseVideoDone = useCallback(() => {
    setPhase('question');
  }, []);

  /* ── Derived ────────────────────────────────────────────────── */
  const q            = QUESTIONS[step];
  const showQuestion = ['question', 'video', 'lovevideo', 'angryvideo', 'angryvideo2', 'angryvideo3', 'pleasevideo', 'correct'].includes(phase);
  const imgSrc       = (i) => processedImgs[i] || RAW_IMAGES[i];

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', cursor: 'default', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* ── Toast ────────────────────────────────────────────── */}
      <Toast
        message={toast.msg}
        visible={toast.on}
        onDone={() => setToast(v => ({ ...v, on: false }))}
      />

      {/* ── Particle bursts ──────────────────────────────────── */}
      <AnimatePresence>
        {bursts.map(b => <Burst key={b.id} x={b.x} y={b.y} color={b.color} />)}
      </AnimatePresence>

      {/* ── Loading screen ───────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.p
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                color: '#a78bfa',
                letterSpacing: 2,
              }}
            >
              🦋 Summoning the butterflies…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── All butterflies — always flying, even during questions ─ */}
      <AnimatePresence>
        {butterflies.map(b => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, rotate: 520 }}
            transition={{ opacity: { duration: 0.4 }, scale: { duration: 0.5, type: 'spring' } }}
            style={{
              position: 'fixed',
              left: b.x - b.size / 2,
              top:  b.y - b.size / 2,
              width:  b.size,
              height: b.size,
              zIndex: 35,
              pointerEvents: phase === 'flying' ? 'auto' : 'none',
              transform: b.flip ? 'scaleX(-1)' : 'none',
              filter: `drop-shadow(0 0 10px ${GLOWS[b.imgIdx]}) drop-shadow(0 0 22px ${GLOWS[b.imgIdx]})`,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              cursor: phase === 'flying' ? 'inherit' : 'default',
            }}
            onClick={(e) => { e.preventDefault(); handleCatch(b.id, b.imgIdx, e.clientX, e.clientY); }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Wing-flap wrapper */}
            <motion.div
              animate={{ scaleX: [1, 0.18, 1] }}
              transition={{ duration: 0.38 + (b.id % 3) * 0.05, repeat: Infinity, ease: 'easeInOut', delay: (b.id * 0.13) % 0.3 }}
              style={{ width: '100%', height: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}
            >
              <img
                src={imgSrc(b.imgIdx)}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── "Flying" header ──────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'flying' && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1,  y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: 'fixed', top: '6%', left: 0, right: 0,
              textAlign: 'center', zIndex: 50, pointerEvents: 'none',
            }}
          >
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.2rem,4.5vw,2rem)',
              color: '#fbbf24',
              textShadow: '0 0 28px rgba(251,191,36,0.35)',
              margin: 0,
            }}>
              Best Friend Verification 🦋
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.72rem,2vw,0.9rem)',
              color: 'rgba(248,244,255,0.5)',
              marginTop: 6,
            }}>
              {butterflies.length} butterfl{butterflies.length !== 1 ? 'ies' : 'y'} in the garden · question {step + 1} of {QUESTIONS.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── "Catch" prompt (bottom) ───────────────────────────── */}
      <AnimatePresence>
        {phase === 'flying' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', bottom: '7%', left: 0, right: 0,
              textAlign: 'center', zIndex: 50, pointerEvents: 'none',
            }}
          >
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4], y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{
                color: '#f0abfc',
                fontFamily: "'Dancing Script', cursive",
                fontSize: 'clamp(1rem,3.5vw,1.5rem)',
                textShadow: '0 0 18px rgba(168,85,247,0.5)',
                margin: 0,
              }}
            >
              🦋 be careful
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Question overlay ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {showQuestion && (
          <motion.div
            key={`q-${step}-${phase}`}
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.88,  y: -30 }}
            transition={{ type: 'spring', stiffness: 190, damping: 22 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '20px 16px',
              pointerEvents: 'auto',
              cursor: 'default',
            }}
          >
            {/* Blurred backdrop */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(4,2,16,0.60)',
              backdropFilter: 'blur(7px)',
              zIndex: -1,
            }} />

            {/* Card */}
            <div style={{
              background: 'rgba(10,5,28,0.75)',
              backdropFilter: 'blur(22px)',
              border: '1px solid rgba(168,85,247,0.18)',
              borderRadius: 28,
              padding: 'clamp(24px,5vw,42px)',
              width: '100%', maxWidth: 520,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              boxShadow: '0 30px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03)',
            }}>
              <Dots current={step} total={QUESTIONS.length} />

              {/* ── Correct-answer video ── */}
              <AnimatePresence>
                {phase === 'video' && <VideoReward onDone={handleVideoDone} />}
              </AnimatePresence>

              {/* ── Final correct-answer love video ── */}
              <AnimatePresence>
                {phase === 'lovevideo' && <LoveVideo onDone={handleVideoDone} />}
              </AnimatePresence>

              {/* ── Wrong-answer angry bird video ── */}
              <AnimatePresence>
                {phase === 'angryvideo' && <AngryBirdVideo onDone={handleAngryVideoDone} />}
              </AnimatePresence>

              {/* ── Second wrong-answer angry bird 2 video ── */}
              <AnimatePresence>
                {phase === 'angryvideo2' && <AngryBird2Video onDone={handleAngryVideo2Done} />}
              </AnimatePresence>

              {/* ── Third wrong-answer angry bird 3 video ── */}
              <AnimatePresence>
                {phase === 'angryvideo3' && <AngryBird3Video onDone={handleAngryVideo3Done} />}
              </AnimatePresence>

              {/* ── Last-question refusal "please" video ── */}
              <AnimatePresence>
                {phase === 'pleasevideo' && <PleaseVideo onDone={handlePleaseVideoDone} />}
              </AnimatePresence>

              {/* Caught butterfly images (not during videos) — two straight, no rotation */}
              {!['video', 'lovevideo', 'angryvideo', 'angryvideo2', 'angryvideo3', 'pleasevideo'].includes(phase) && (
                <div style={{ display: 'flex', gap: 18, marginBottom: 18, alignItems: 'center' }}>
                  {[caughtIdx, (caughtIdx + 1) % RAW_IMAGES.length].map((idx, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                    >
                      <img
                        src={imgSrc(idx)}
                        alt="butterfly"
                        draggable={false}
                        style={{
                          width: 72, height: 72, objectFit: 'contain',
                          filter: `drop-shadow(0 0 14px ${GLOWS[idx]})`,
                          userSelect: 'none', pointerEvents: 'none',
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Video caption labels */}
              {phase === 'video' && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', color: '#fbbf24',
                    fontFamily: "'Dancing Script', cursive", fontSize: '1.12rem',
                  }}
                >
                  🎉 Correct! Enjoy this little moment…
                </motion.p>
              )}
              {phase === 'lovevideo' && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', color: '#f472b6',
                    fontFamily: "'Dancing Script', cursive", fontSize: '1.12rem',
                    marginTop: 8,
                  }}
                >
                  💖 You made it...
                </motion.p>
              )}
              {phase === 'angryvideo' && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', color: '#f87171',
                    fontFamily: "'Dancing Script', cursive", fontSize: '1.12rem',
                    marginTop: 8,
                  }}
                >
                  😤 Wrong! That's what you get…
                </motion.p>
              )}
              {phase === 'angryvideo2' && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', color: '#ef4444',
                    fontFamily: "'Dancing Script', cursive", fontSize: '1.12rem',
                    marginTop: 8,
                  }}
                >
                  😡😡 AGAIN?! Are you serious right now…
                </motion.p>
              )}
              {phase === 'angryvideo3' && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', color: '#dc2626',
                    fontFamily: "'Dancing Script', cursive", fontSize: '1.12rem',
                    marginTop: 8,
                  }}
                >
                  😡😡😡 THIRD STRIKE?! What is wrong with you...
                </motion.p>
              )}
              {phase === 'pleasevideo' && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center', color: '#f9a8d4',
                    fontFamily: "'Dancing Script', cursive", fontSize: '1.12rem',
                    marginTop: 8,
                  }}
                >
                  🥺 Please don't leave…
                </motion.p>
              )}

              {/* Step label */}
              {!['video', 'lovevideo', 'angryvideo', 'angryvideo2', 'angryvideo3', 'pleasevideo'].includes(phase) && (
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.68rem',
                  color: 'rgba(96,165,250,0.6)',
                  letterSpacing: 4, textTransform: 'uppercase',
                  marginBottom: 10,
                }}>
                  {q.label}
                </p>
              )}

              {/* Title */}
              {!['video', 'lovevideo', 'angryvideo', 'angryvideo2', 'angryvideo3', 'pleasevideo'].includes(phase) && (
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#fbbf24',
                  textAlign: 'center',
                  marginBottom: 10,
                  fontSize: 'clamp(1.15rem,4vw,1.5rem)',
                  fontWeight: 600,
                }}>
                  {q.title}
                </h2>
              )}

              {/* Subtitle */}
              {!['video', 'lovevideo', 'angryvideo', 'angryvideo2', 'angryvideo3', 'pleasevideo'].includes(phase) && (
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  color: 'rgba(240,232,255,0.72)',
                  textAlign: 'center',
                  marginBottom: 26,
                  fontSize: 'clamp(0.88rem,2.5vw,0.98rem)',
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}>
                  {q.subtitle}
                </p>
              )}

              {/* Answers / state content */}
              {phase === 'correct' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '20px', textAlign: 'center',
                    color: '#60a5fa',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem', fontStyle: 'italic',
                  }}
                >
                  {q.correctMsg}
                </motion.div>
              ) : phase === 'question' ? (
                <div style={{ width: '100%' }}>
                  {q.options.map((opt, i) => (
                    <OptionBtn
                      key={i}
                      onClick={() => {
                        // Detect last-question refusal: isLast + wrong
                        const isRefusal = q.isLast && !opt.correct;
                        handleAnswer(opt.correct, isRefusal);
                      }}
                    >
                      {opt.text}
                    </OptionBtn>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Subtle hint about butterflies in background */}
            {phase === 'question' && butterflies.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0] }}
                transition={{ duration: 3.5, delay: 2, repeat: Infinity }}
                style={{
                  marginTop: 16, color: '#7c6b9a',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem', letterSpacing: 1, textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                {butterflies.length} butterfl{butterflies.length !== 1 ? 'ies are' : 'y is'} still dancing behind…
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Completion screen ─────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 70,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(4,2,16,0.75)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ marginBottom: 24 }}
            >
              <img
                src={imgSrc(0)}
                alt="butterfly"
                draggable={false}
                style={{
                  width: 100, height: 100, objectFit: 'contain',
                  filter: 'drop-shadow(0 0 22px rgba(168,85,247,0.9))',
                  userSelect: 'none',
                }}
              />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem,5vw,2.2rem)',
                color: '#60a5fa', fontStyle: 'italic',
                textShadow: '0 0 30px rgba(96,165,250,0.55)',
                textAlign: 'center',
              }}
            >
              Access Granted ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

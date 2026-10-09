import { useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import StarsBg from './components/StarsBg';
import LampIntro from './components/LampIntro';
import BestFriendGate from './components/BestFriendGate';
import OpeningScreen from './components/OpeningScreen';
import BirthdayMessage from './components/BirthdayMessage';
import Timeline from './components/Timeline';
import MemoryGallery from './components/MemoryGallery';
import NeverToldYou from './components/NeverToldYou';
import FunnySide from './components/FunnySide';
import WhySpecial from './components/WhySpecial';
import BirthdayLetter from './components/BirthdayLetter';
import FinalSurprise from './components/FinalSurprise';
import Mascot from './components/Mascot';
import './index.css';

function SectionDivider({ emoji = '✨', label }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px 0',
      background: 'transparent',
      position: 'relative',
    }}>
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
        marginBottom: 12,
      }} />
      <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>{emoji}</span>
      {label && <p style={{ color: '#4b3a6e', fontSize: '0.7rem', letterSpacing: 4, textTransform: 'uppercase', marginTop: 4 }}>{label}</p>}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
        marginTop: 12,
      }} />
    </div>
  );
}

export default function App() {
  const [lampOn, setLampOn] = useState(false);
  const [gateCleared, setGateCleared] = useState(false);
  const [opened, setOpened] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Step 1: Lamp intro (dark room, pull cord)
  if (!lampOn) {
    return <LampIntro onLampOn={() => setLampOn(true)} />;
  }

  // Step 2: Butterfly catching + friend gate quiz
  if (!gateCleared) {
    return (
      <>
        <StarsBg />
        <BestFriendGate onPass={() => setGateCleared(true)} />
      </>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <StarsBg />

      {/* Opening screen overlay */}
      <AnimatePresence>
        {!opened && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 1.5 }}>
            <OpeningScreen onOpen={() => setOpened(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — only visible after opening */}
      {opened && (
        <>
          <Mascot />
          {/* Scroll progress indicator */}
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--purple-light), var(--blue-accent))',
              transformOrigin: '0%',
              scaleX,
              zIndex: 100,
            }}
          />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <SectionDivider emoji="✨" label="Welcome" />

            {/* 1. Birthday Message */}
            <BirthdayMessage />
            <SectionDivider emoji="🌙" label="Our Story" />

            {/* 2. Timeline */}
            <Timeline />
            <SectionDivider emoji="📸" label="Memories" />

            {/* 3. Memory Gallery */}
            <MemoryGallery />
            <SectionDivider emoji="💌" label="For You" />

            {/* 4. Things I Never Told You */}
            <NeverToldYou />
            <SectionDivider emoji="😂" label="Evidence" />

            {/* 5. Funny Side */}
            <FunnySide />
            <SectionDivider emoji="⭐" label="Stars" />

            {/* 6. Why You're Special */}
            <WhySpecial />
            <SectionDivider emoji="✉️" label="Letter" />

            {/* 7. Birthday Letter */}
            <BirthdayLetter />
            <SectionDivider emoji="🎆" label="Finale" />

            {/* 8. Final Surprise */}
            <FinalSurprise />

            {/* Footer */}
            <footer style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'rgba(5, 5, 16, 0.4)',
              borderTop: '1px solid rgba(107,33,168,0.2)',
              backdropFilter: 'blur(5px)',
            }}>
              <p style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.1rem',
                color: '#4b3a6e',
              }}>
                Made with 💙 for Rathi — My Moon 🌙
              </p>
              <p style={{ color: '#2a1a3e', fontSize: '0.7rem', marginTop: 8 }}>
                A Little Universe Made for You
              </p>
            </footer>
          </motion.main>
        </>
      )}
    </div>
  );
}


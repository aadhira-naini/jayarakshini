import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;
    audio.loop = true;

    // Handler for playing audio
    const attemptPlay = () => {
      if (audio && audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            // Browser autoplay restrictions prevented play; awaiting user interaction
          });
      }
    };

    // Try playing immediately on mount
    attemptPlay();

    // Listen for any user interaction on the window to start playing if autoplay was blocked
    const onUserGesture = () => {
      attemptPlay();
    };

    const removeGestureListeners = () => {
      window.removeEventListener('click', onUserGesture, true);
      window.removeEventListener('touchstart', onUserGesture, true);
      window.removeEventListener('keydown', onUserGesture, true);
      window.removeEventListener('pointerdown', onUserGesture, true);
      window.removeEventListener('scroll', onUserGesture, true);
    };

    window.addEventListener('click', onUserGesture, { capture: true, passive: true });
    window.addEventListener('touchstart', onUserGesture, { capture: true, passive: true });
    window.addEventListener('keydown', onUserGesture, { capture: true, passive: true });
    window.addEventListener('pointerdown', onUserGesture, { capture: true, passive: true });
    window.addEventListener('scroll', onUserGesture, { capture: true, passive: true });

    // Ensure audio loops continuously without stopping
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasStarted(true);
      removeGestureListeners();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      removeGestureListeners();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.error('Audio play error:', err);
        });
    }
  };

  return (
    <>
      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/songs.mpeg" type="audio/mpeg" />
        <source src="/songs.mp3" type="audio/mp3" />
      </audio>

      {/* Floating Ambient Music Control Widget */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          userSelect: 'none',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(15, 10, 30, 0.85)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                backdropFilter: 'blur(10px)',
                color: '#e9d5ff',
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '20px',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                pointerEvents: 'none',
              }}
            >
              {isPlaying ? '🎵 Playing Birthday Song' : '🔇 Click to Play Song'}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.35), rgba(79, 70, 229, 0.35))'
              : 'rgba(20, 15, 35, 0.7)',
            border: isPlaying
              ? '1.5px solid rgba(192, 132, 252, 0.6)'
              : '1.5px solid rgba(168, 85, 247, 0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '50px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: isPlaying
              ? '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(168, 85, 247, 0.2)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#ffffff',
          }}
        >
          {/* Rotating vinyl / music note icon */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { repeat: Infinity, duration: 4, ease: 'linear' } : { duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            {isPlaying ? '💿' : '🔇'}
          </motion.div>

          {/* Equalizer animation bars when playing */}
          {isPlaying ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '2.5px',
                height: '14px',
                paddingTop: '2px',
              }}
            >
              {[0.4, 0.8, 0.5, 0.9].map((heightRatio, i) => (
                <motion.span
                  key={i}
                  animate={{
                    height: ['3px', '14px', '5px', '12px', '3px'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1 + i * 0.2,
                    ease: 'easeInOut',
                    delay: i * 0.15,
                  }}
                  style={{
                    width: '2.5px',
                    borderRadius: '2px',
                    background: 'linear-gradient(to top, #c084fc, #60a5fa)',
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          ) : (
            <span
              style={{
                fontSize: '0.72rem',
                color: '#c4b5fd',
                letterSpacing: '0.5px',
                fontWeight: 500,
              }}
            >
              Play Music
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}

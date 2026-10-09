import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const emojis = ['🎂', '🎁', '🎈', '🎀', '🌟', '💫', '🦋', '🌸', '💜', '✨', '🎊', '🎉', '🥳', '💙', '🌙'];

const generateStickers = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    size: Math.random() > 0.7 ? 50 : Math.random() > 0.4 ? 35 : 20,
    top: Math.random() * 90 + 5,
    left: Math.random() * 90 + 5,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 6,
    xOffset: (Math.random() - 0.5) * 60,
    yOffset: (Math.random() - 0.5) * 60,
    rotation: (Math.random() - 0.5) * 60,
    isGlass: Math.random() > 0.6,
    zIndex: Math.random() > 0.5 ? 5 : 1,
    hideOnMobile: Math.random() > 0.4
  }));
};

const FloatingStickers = () => {
  const [stickers, setStickers] = useState([]);
  
  useEffect(() => {
    setStickers(generateStickers(20));
  }, []);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        pointerEvents: 'none', 
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {stickers.map((sticker) => (
        <motion.div
          key={sticker.id}
          className={`floating-sticker ${sticker.hideOnMobile ? 'hide-mobile' : ''}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, sticker.yOffset, -sticker.yOffset, 0],
            x: [0, sticker.xOffset, -sticker.xOffset, 0],
            rotate: [0, sticker.rotation, -sticker.rotation, 0]
          }}
          transition={{
            opacity: { delay: sticker.delay, duration: 1, ease: 'easeOut' },
            scale: { delay: sticker.delay, duration: 1, ease: 'backOut' },
            y: { duration: sticker.duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            x: { duration: sticker.duration * 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            rotate: { duration: sticker.duration * 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
          }}
          style={{
            position: 'absolute',
            top: `${sticker.top}%`,
            left: `${sticker.left}%`,
            fontSize: `${sticker.size}px`,
            zIndex: sticker.zIndex,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            ...(sticker.isGlass ? {
              padding: `${sticker.size * 0.4}px`,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            } : {
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
            })
          }}
        >
          {sticker.emoji}
        </motion.div>
      ))}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingStickers;

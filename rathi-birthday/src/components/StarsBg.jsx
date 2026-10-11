import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// ─── Celestial Starfield for infinite scrolling background ────────────────────
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seededRandom(99);

const DISTANT_STARS = Array.from({ length: 160 }, (_, i) => ({
  id: `bg-dist-${i}`,
  x: +(rng() * 100).toFixed(2),
  y: +(rng() * 100).toFixed(2),
  size: +(1.0 + rng() * 1.1).toFixed(1),
  dur: +(1.6 + rng() * 2.4).toFixed(2),
  delay: +(rng() * 3.5).toFixed(2),
  minOp: +(0.45 + rng() * 0.25).toFixed(2),
  maxOp: +(0.85 + rng() * 0.15).toFixed(2),
  color: rng() > 0.35 ? '#ffffff' : rng() > 0.5 ? '#dbeafe' : '#fef08a',
}));

const MID_STARS = Array.from({ length: 85 }, (_, i) => ({
  id: `bg-mid-${i}`,
  x: +(rng() * 100).toFixed(2),
  y: +(rng() * 100).toFixed(2),
  size: +(2.0 + rng() * 1.5).toFixed(1),
  dur: +(2.0 + rng() * 2.6).toFixed(2),
  delay: +(rng() * 3.5).toFixed(2),
  color: rng() > 0.4 ? '#ffffff' : rng() > 0.5 ? '#e0f2fe' : '#fef9c3',
}));

const HERO_STARS = Array.from({ length: 24 }, (_, i) => ({
  id: `bg-hero-${i}`,
  x: +(rng() * 94 + 3).toFixed(2),
  y: +(rng() * 94 + 3).toFixed(2),
  size: +(3.5 + rng() * 1.8).toFixed(1),
  dur: +(2.0 + rng() * 2.0).toFixed(2),
  delay: +(rng() * 3.0).toFixed(2),
  color: rng() > 0.5 ? '#ffffff' : rng() > 0.5 ? '#fde047' : '#93c5fd',
}));

const CROSS_STARS = [
  { x: 10, y: 16, size: 16, delay: 0.2, color: '#fef08a' },
  { x: 24, y: 10, size: 14, delay: 1.5, color: '#ffffff' },
  { x: 40, y: 18, size: 18, delay: 0.8, color: '#e0f2fe' },
  { x: 70, y: 22, size: 15, delay: 2.1, color: '#fef9c3' },
  { x: 86, y: 36, size: 14, delay: 1.1, color: '#ffffff' },
  { x: 14, y: 63, size: 16, delay: 2.6, color: '#fde047' },
  { x: 32, y: 78, size: 13, delay: 0.5, color: '#ffffff' },
  { x: 58, y: 74, size: 17, delay: 1.9, color: '#e9d5ff' },
  { x: 80, y: 80, size: 15, delay: 2.8, color: '#fef08a' },
  { x: 90, y: 14, size: 14, delay: 0.4, color: '#ffffff' },
];

function DistantStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DISTANT_STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [s.minOp, s.maxOp, s.minOp] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}

function MidStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {MID_STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.55, 1, 0.55], scale: [0.92, 1.25, 0.92] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 5px ${s.color}, 0 0 10px rgba(255, 255, 255, 0.65)`,
          }}
        />
      ))}
    </div>
  );
}

function CrossSparkleStar({ x, y, size = 14, delay = 0, color = '#ffffff' }) {
  return (
    <motion.div
      animate={{
        opacity: [0.55, 1, 0.55],
        scale: [0.85, 1.25, 0.85],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 3 + (delay % 2),
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path
          d="M12 0 C12 7 7 12 0 12 C7 12 12 17 12 24 C12 17 17 12 24 12 C17 12 12 7 12 0 Z"
          fill={color}
          style={{ filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px rgba(255,255,255,0.85))` }}
        />
        <circle cx="12" cy="12" r="2" fill="#ffffff" />
      </svg>
    </motion.div>
  );
}

function HeroStars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {HERO_STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.35, 1],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 8px #ffffff, 0 0 16px rgba(168, 85, 247, 0.65), 0 0 24px rgba(59, 130, 246, 0.4)`,
          }}
        />
      ))}
      {CROSS_STARS.map((s, idx) => (
        <CrossSparkleStar key={idx} x={s.x} y={s.y} size={s.size} delay={s.delay} color={s.color} />
      ))}
    </div>
  );
}

function ShootingStar({ top, left, delay, duration = 6.5 }) {
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
      animate={{
        x: [0, 320],
        y: [0, 240],
        opacity: [0, 1, 0.9, 0],
        scale: [0.6, 1.1, 1, 0.2],
      }}
      transition={{
        duration: 1.1,
        delay,
        repeat: Infinity,
        repeatDelay: duration,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: 110,
        height: 2,
        background: 'linear-gradient(90deg, #ffffff 0%, rgba(254, 240, 138, 0.9) 20%, rgba(168, 85, 247, 0.4) 60%, transparent 100%)',
        transform: 'rotate(34deg)',
        transformOrigin: 'left center',
        filter: 'drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))',
        pointerEvents: 'none',
      }}
    />
  );
}

// ─── Shape point generators ──────────────────────────────────────────────────
function getMoonPoints(count) {
  const pts = [];
  const R = 160;
  const r = 130;
  const offset = 60;
  
  while (pts.length < count) {
    const x = (Math.random() - 0.5) * 2 * R;
    const y = (Math.random() - 0.5) * 2 * R;
    if (x * x + y * y <= R * R && (x - offset) * (x - offset) + y * y >= r * r) {
      pts.push([x + 30, y, (Math.random() - 0.5) * 20]);
    }
  }
  return pts;
}

function getFlowerPoints(count) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const t = angle * 6;
    const r = 130 * Math.abs(Math.cos(t / 2)) + Math.random() * 15;
    pts.push([Math.cos(angle) * r + (Math.random()-0.5)*10, Math.sin(angle) * r + (Math.random()-0.5)*10, (Math.random()-0.5)*20]);
  }
  return pts;
}

function getSaturnPoints(count) {
  const pts = [];
  const globe = Math.floor(count * 0.45);
  const ring = count - globe;
  for (let i = 0; i < globe; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 80 + Math.random() * 5;
    pts.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]);
  }
  for (let i = 0; i < ring; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = 110 + Math.random() * 75;
    const x = Math.cos(ang) * r;
    const y = (Math.random() - 0.5) * 10;
    const z = Math.sin(ang) * r * 0.3;
    const tilt = 0.4;
    pts.push([x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)]);
  }
  return pts;
}

function getHeartPoints(count) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3) * 10;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 10;
    pts.push([x + (Math.random()-0.5)*12, y + (Math.random()-0.5)*12, (Math.random()-0.5)*30]);
  }
  return pts;
}

function getGalaxyPoints(count) {
  const pts = [];
  const arms = 3;
  for (let i = 0; i < count; i++) {
    const a = i % arms;
    const t = (i / count) * Math.PI * 6;
    const r = t * 22 + Math.random() * 15;
    const spin = a * ((Math.PI * 2) / arms);
    const scatter = (Math.random() - 0.5) * r * 0.3;
    pts.push([Math.cos(t+spin)*r+scatter, Math.sin(t+spin)*r+scatter, (Math.random()-0.5)*40]);
  }
  return pts;
}

function getSupernovaPoints(count) {
  const pts = [];
  const rays = 12;
  for (let i = 0; i < count; i++) {
    const ray = i % rays;
    const ang = (ray / rays) * Math.PI * 2 + (Math.random()-0.5)*0.3;
    const r = Math.random() * 200;
    pts.push([Math.cos(ang)*r+(Math.random()-0.5)*r*0.12, Math.sin(ang)*r+(Math.random()-0.5)*r*0.12, (Math.random()-0.5)*50]);
  }
  return pts;
}

function getDNAPoints(count) {
  const pts = [];
  const half = Math.floor(count / 2);
  const H = 320, R = 85, turns = 3.5;
  for (let i = 0; i < half; i++) {
    const t = (i / half) * Math.PI * 2 * turns;
    pts.push([Math.cos(t)*R+(Math.random()-0.5)*6, (i/half)*H - H/2, Math.sin(t)*R*0.35+(Math.random()-0.5)*6]);
  }
  for (let i = 0; i < half; i++) {
    const t = (i / half) * Math.PI * 2 * turns + Math.PI;
    pts.push([Math.cos(t)*R+(Math.random()-0.5)*6, (i/half)*H - H/2, Math.sin(t)*R*0.35+(Math.random()-0.5)*6]);
  }
  return pts;
}

function buildShape(name, count) {
  switch (name) {
    case 'moon':      return getMoonPoints(count);
    case 'flower':    return getFlowerPoints(count);
    case 'saturn':    return getSaturnPoints(count);
    case 'heart':     return getHeartPoints(count);
    case 'galaxy':    return getGalaxyPoints(count);
    case 'supernova': return getSupernovaPoints(count);
    case 'dna':       return getDNAPoints(count);
    default:          return Array.from({ length: count }, () => [(Math.random()-0.5)*400,(Math.random()-0.5)*400,(Math.random()-0.5)*100]);
  }
}

const SHAPES = ['moon', 'flower', 'saturn', 'heart', 'galaxy', 'supernova', 'dna'];

// Each shape's RGB accent color (r,g,b in 0-1)
const SHAPE_RGB = {
  moon:      [1.00, 0.84, 0.50],
  flower:    [1.00, 0.47, 0.77],
  saturn:    [0.54, 0.91, 0.99],
  heart:     [1.00, 0.34, 0.34],
  galaxy:    [0.74, 0.58, 0.98],
  supernova: [1.00, 0.72, 0.42],
  dna:       [0.31, 0.98, 0.48],
};

// ─── Component ────────────────────────────────────────────────────────────────
const StarsBg = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    // Lower pixel-ratio cap on phones/tablets keeps the animation smooth.
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const maxDpr = isTouchDevice ? 1.5 : 2;

    // ── Scene / Camera / Renderer ─────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 600;

    // If WebGL is unavailable, skip the background instead of crashing the whole site.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      console.warn('StarsBg: WebGL unavailable, background disabled.', err);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    // ── Background twinkling stars ─────────────────────────────────────────
    const STAR_COUNT = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos   = new Float32Array(STAR_COUNT * 3);
    const starSz    = new Float32Array(STAR_COUNT);
    const starPhase = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT * 3; i++) starPos[i] = (Math.random()-0.5) * 3200;
    for (let i = 0; i < STAR_COUNT; i++) { starSz[i] = Math.random()*2.4 + 1.2; starPhase[i] = Math.random()*Math.PI*2; }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size',     new THREE.BufferAttribute(starSz, 1));
    starGeo.setAttribute('aPhase',   new THREE.BufferAttribute(starPhase, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        attribute float aPhase;
        varying float vPhase;
        void main() {
          vPhase = aPhase;
          vec4 mvp = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(1.8, size * (380.0 / -mvp.z));
          gl_Position = projectionMatrix * mvp;
        }`,
      fragmentShader: `
        uniform float uTime;
        varying float vPhase;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float a = 0.45 + 0.55 * sin(uTime * 2.0 + vPhase);
          gl_FragColor = vec4(1.0, 1.0, 1.0, a * (1.0 - d * 2.0));
        }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);

    // ── Nebula clouds ──────────────────────────────────────────────────────
    const makeCloudTex = () => {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(128,128,0,128,128,128);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
      return new THREE.CanvasTexture(c);
    };
    const cloudTex = makeCloudTex();
    const clouds = [];
    const cloudColors = [0x4a00e0, 0x8e2de2, 0x1a0050];
    for (let i = 0; i < 20; i++) {
      const mat = new THREE.SpriteMaterial({ map: cloudTex, color: cloudColors[i%3], transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending });
      const s = new THREE.Sprite(mat);
      s.position.set((Math.random()-0.5)*2000, (Math.random()-0.5)*2000, (Math.random()-0.5)*1000-500);
      s.scale.set(800,800,1);
      scene.add(s); clouds.push(s);
    }

    // ── Moon with Crisp Crescent Shape & Earthshine ───────────────────────
    const makeMoonTex = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 512;
      const ctx = c.getContext('2d');
      const cx = 256, cy = 256, R = 185;

      // 1. Earthshine (unlit dark side showing full sphere)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(12, 10, 26, 0.88)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(190, 170, 250, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Subtle craters on dark sphere
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.beginPath(); ctx.arc(cx + 60, cy - 20, 26, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 95, cy + 45, 32, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 35, cy + 75, 20, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // 2. Crisp illuminated crescent moon body
      ctx.save();
      ctx.beginPath();
      // Outer arc (left side)
      ctx.arc(cx, cy, R, Math.PI * 0.5, Math.PI * 1.5, false);
      // Inner arc curving back
      ctx.arc(cx + 80, cy - 10, R * 0.92, Math.PI * 1.5, Math.PI * 0.5, true);
      ctx.closePath();

      // Crescent gradient
      const g = ctx.createLinearGradient(cx - R, cy, cx, cy);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.25, '#fffbeb');
      g.addColorStop(0.65, '#fde047');
      g.addColorStop(1, '#ca8a04');
      ctx.fillStyle = g;
      ctx.shadowColor = 'rgba(254, 240, 138, 0.85)';
      ctx.shadowBlur = 24;
      ctx.fill();

      // Lunar craters on crescent
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(161, 98, 7, 0.4)';
      const craters = [
        [cx - 100, cy - 30, 15],
        [cx - 78, cy + 58, 14],
        [cx - 128, cy + 20, 12],
        [cx - 60, cy - 78, 10],
        [cx - 38, cy + 108, 9],
      ];
      craters.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Brilliant outer rim stroke
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI * 0.5, Math.PI * 1.5, false);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();
      return new THREE.CanvasTexture(c);
    };

    const moonTex = makeMoonTex();
    // Using NormalBlending with transparent true preserves the crisp crescent outline and dark disc
    const moonSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: moonTex, transparent: true, opacity: 0.95 }));
    moonSprite.position.set(520, 520, -200);
    moonSprite.scale.set(650, 650, 1);
    scene.add(moonSprite);

    const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, color: 0xfff0aa, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending }));
    moonGlow.position.set(520, 520, -210);
    moonGlow.scale.set(1000, 1000, 1);
    scene.add(moonGlow);

    // ── Shooting stars ─────────────────────────────────────────────────────
    const shootingStars = [];
    const ssMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const spawnSS = () => {
      const sx = (Math.random()-0.5)*2000, sy = Math.random()*800+400, sz = (Math.random()-0.5)*800-400;
      const pts = [new THREE.Vector3(sx,sy,sz), new THREE.Vector3(sx,sy,sz)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, ssMat.clone());
      scene.add(line);
      return { line, pos: new THREE.Vector3(sx,sy,sz), vel: new THREE.Vector3(-18-Math.random()*18, -8-Math.random()*8, 0), life: 1.0 };
    };

    // ── Particle shape system ──────────────────────────────────────────────
    const PC = 2000; // particle count
    const pPos    = new Float32Array(PC * 3); // current positions
    const pTarget = new Float32Array(PC * 3); // target shape positions
    const pVel    = new Float32Array(PC * 3); // velocities
    const pCol    = new Float32Array(PC * 3); // per-particle color (named 'aColor' to avoid reserved name)
    const pSz     = new Float32Array(PC);     // point sizes

    // Init randomly spread around scene center
    for (let i = 0; i < PC * 3; i++) pPos[i] = (Math.random()-0.5) * 300;
    for (let i = 0; i < PC; i++) pSz[i] = Math.random() * 2.5 + 1.5;

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aColor',   new THREE.BufferAttribute(pCol, 3));   // NOTE: named 'aColor' not 'color'
    pGeo.setAttribute('aSize',    new THREE.BufferAttribute(pSz, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSize;
        attribute vec3  aColor;
        varying vec3  vCol;
        void main() {
          vCol = aColor;
          vec4 mvp = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (500.0 / -mvp.z);
          gl_Position  = projectionMatrix * mvp;
        }`,
      fragmentShader: `
        varying vec3 vCol;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float a = 1.0 - d * 2.0;
          gl_FragColor = vec4(vCol, a * 0.85);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pMesh = new THREE.Points(pGeo, pMat);
    scene.add(pMesh);

    // Responsive scaling for interactive shapes
    const updateShapeScale = () => {
      let s = 1.0;
      if (window.innerWidth < 768) {
        s = Math.max(0.75, (window.innerWidth / 768) * 0.95);
      }
      pMesh.scale.set(s, s, s);
    };
    updateShapeScale();

    // ── Shape state machine ────────────────────────────────────────────────
    let shapeIdx      = 0;
    let morphT        = 0;   // 0→1 morph progress
    let cycleTimer    = 0;
    const MORPH_DUR   = 2.8; // seconds for one full morph
    const CYCLE_INT   = 9.0; // seconds between shape switches

    // From / to snapshots for lerp
    const pFrom = new Float32Array(PC * 3);
    const pTo   = new Float32Array(PC * 3);

    const applyShape = (name) => {
      const col = SHAPE_RGB[name] || [1,1,1];
      const pts = buildShape(name, PC);
      // Save current positions as 'from'
      pFrom.set(pPos);
      // Set new targets
      for (let i = 0; i < PC; i++) {
        pTo[i*3]   = pts[i][0];
        pTo[i*3+1] = pts[i][1];
        pTo[i*3+2] = pts[i][2];
        pCol[i*3]   = col[0];
        pCol[i*3+1] = col[1];
        pCol[i*3+2] = col[2];
      }
      pGeo.attributes.aColor.needsUpdate = true;
      morphT = 0;
    };

    // Kick off with first shape immediately
    // Set target array to first shape directly (no 'from' snap needed on boot)
    {
      const col = SHAPE_RGB[SHAPES[0]] || [1,1,1];
      const pts = buildShape(SHAPES[0], PC);
      for (let i = 0; i < PC; i++) {
        pTarget[i*3]   = pts[i][0];
        pTarget[i*3+1] = pts[i][1];
        pTarget[i*3+2] = pts[i][2];
        pFrom[i*3]   = pPos[i*3];
        pFrom[i*3+1] = pPos[i*3+1];
        pFrom[i*3+2] = pPos[i*3+2];
        pTo[i*3]   = pts[i][0];
        pTo[i*3+1] = pts[i][1];
        pTo[i*3+2] = pts[i][2];
        pCol[i*3]   = col[0];
        pCol[i*3+1] = col[1];
        pCol[i*3+2] = col[2];
      }
      pGeo.attributes.aColor.needsUpdate = true;
    }

    // ── Mouse tracking ─────────────────────────────────────────────────────
    let camMouseX = 0, camMouseY = 0;  // for camera parallax
    let scrollY = 0;
    // Mouse in normalized device coords for 3D cursor repulsion
    let ndcX = 0, ndcY = 0;
    let mouseActive = false;

    const mouse3D = new THREE.Vector3();

    // Pointer events cover mouse, touch and pen with one handler.
    const onMouseMove = (e) => {
      mouseActive = true;
      camMouseX = (e.clientX - window.innerWidth  / 2) * 0.025;
      camMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
      ndcX =  (e.clientX / window.innerWidth)  * 2 - 1;
      ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    // A finger lifting means "no cursor" — stop repelling particles.
    const onPointerEnd = (e) => { if (e.pointerType !== 'mouse') mouseActive = false; };
    const onMouseLeave = () => { mouseActive = false; };
    const onScroll = () => { scrollY = window.scrollY; };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateShapeScale();
    };
    const onMouseClick = (e) => {
      if (e.target.closest('button, a, input, textarea, select')) return;
      cycleTimer = 0;
      shapeIdx = (shapeIdx + 1) % SHAPES.length;
      applyShape(SHAPES[shapeIdx]);
    };
    document.addEventListener('pointermove', onMouseMove, { passive: true });
    document.addEventListener('pointerdown', onMouseMove, { passive: true });
    document.addEventListener('pointerup', onPointerEnd, { passive: true });
    document.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('click', onMouseClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // ── Animation loop ─────────────────────────────────────────────────────
    let lastTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt  = Math.min((now - lastTime) / 1000, 0.05); // real delta in seconds, capped at 50ms
      lastTime  = now;
      const elapsed = now / 1000;

      // Uniforms
      starMat.uniforms.uTime.value = elapsed;
      pMat.uniforms.uTime.value    = elapsed;

      // Star field slow rotation
      starMesh.rotation.y += 0.0002;
      starMesh.rotation.x += 0.0001;

      // Camera parallax — scroll offset adjusts camera Y so particles stay
      // aligned to the viewport regardless of how far the user has scrolled.
      const scrollNorm = scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const targetCamY = -camMouseY - scrollNorm * 300;
      camera.position.x += (camMouseX   - camera.position.x) * 0.04;
      camera.position.y += (targetCamY  - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // Keep shape flat facing forward so 100% of the shape is visible and mouse repulsion is exact
      pMesh.rotation.set(0, 0, 0);

      // Unproject mouse to Z=0 plane for cursor repulsion.
      // ndcY is already viewport-relative via clientY — correct for a fixed canvas.
      const ray = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera).sub(camera.position).normalize();
      const tDist = -camera.position.z / ray.z;
      mouse3D.copy(camera.position).addScaledVector(ray, tDist);
      mouse3D.divideScalar(pMesh.scale.x); // Convert world to local space for proper physics

      // ── Shape cycle ──────────────────────────────────────────────────────
      cycleTimer += dt;
      if (cycleTimer >= CYCLE_INT) {
        cycleTimer = 0;
        shapeIdx = (shapeIdx + 1) % SHAPES.length;
        applyShape(SHAPES[shapeIdx]);
      }

      // Morph progress (0→1 over MORPH_DUR seconds)
      if (morphT < 1) {
        morphT = Math.min(1, morphT + dt / MORPH_DUR);
      }
      // Smoothstep easing
      const ease = morphT * morphT * (3 - 2 * morphT);

      // ── Particle physics update ──────────────────────────────────────────
      const posAttr = pGeo.attributes.position;
      const posArr  = posAttr.array;

      const REPEL_R  = mouseActive ? 170 : 0;
      const REPEL_F  = 420;
      const SPRING   = 3.5;
      const DAMP     = 0.86;

      for (let i = 0; i < PC; i++) {
        const i3 = i * 3;
        const cx = posArr[i3], cy = posArr[i3+1], cz = posArr[i3+2];

        // Lerped target position for this frame, with strong mouse follow
        const tx = pFrom[i3]   + (pTo[i3]   - pFrom[i3])   * ease;
        const ty = pFrom[i3+1] + (pTo[i3+1] - pFrom[i3+1]) * ease;
        const tz = pFrom[i3+2] + (pTo[i3+2] - pFrom[i3+2]) * ease;

        // Spring force toward lerped target
        let fx = (tx - cx) * SPRING;
        let fy = (ty - cy) * SPRING;
        let fz = (tz - cz) * SPRING;

        // Mouse cursor repulsion (in the Z=0 plane)
        const dx = cx - mouse3D.x;
        const dy = cy - mouse3D.y;
        const dz = cz;
        const dist2 = dx*dx + dy*dy + dz*dz;
        if (dist2 < REPEL_R * REPEL_R && dist2 > 0.01) {
          const d = Math.sqrt(dist2);
          const push = (1 - d / REPEL_R) * REPEL_F;
          fx += (dx / d) * push;
          fy += (dy / d) * push;
          fz += (dz / d) * push * 0.2;
        }

        // Integrate velocity
        pVel[i3]   = (pVel[i3]   + fx * dt) * DAMP;
        pVel[i3+1] = (pVel[i3+1] + fy * dt) * DAMP;
        pVel[i3+2] = (pVel[i3+2] + fz * dt) * DAMP;

        posArr[i3]   = cx + pVel[i3];
        posArr[i3+1] = cy + pVel[i3+1];
        posArr[i3+2] = cz + pVel[i3+2];
      }
      posAttr.needsUpdate = true;


      // Nebula drift
      clouds.forEach((c, i) => { c.rotation.z += 0.0008 * (i % 2 === 0 ? 1 : -1); });

      // Shooting stars
      if (Math.random() > 0.988 && shootingStars.length < 3) shootingStars.push(spawnSS());
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life -= 0.018;
        ss.pos.add(ss.vel);
        const pa = ss.line.geometry.attributes.position.array;
        pa[0]=ss.pos.x; pa[1]=ss.pos.y; pa[2]=ss.pos.z;
        pa[3]=ss.pos.x-ss.vel.x*4; pa[4]=ss.pos.y-ss.vel.y*4; pa[5]=ss.pos.z;
        ss.line.geometry.attributes.position.needsUpdate = true;
        ss.line.material.opacity = ss.life;
        if (ss.life <= 0) { scene.remove(ss.line); ss.line.geometry.dispose(); ss.line.material.dispose(); shootingStars.splice(i,1); }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('pointermove', onMouseMove);
      document.removeEventListener('pointerdown', onMouseMove);
      document.removeEventListener('pointerup', onPointerEnd);
      document.removeEventListener('pointercancel', onPointerEnd);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('click', onMouseClick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      starGeo.dispose(); starMat.dispose();
      pGeo.dispose(); pMat.dispose();
      cloudTex.dispose(); moonTex.dispose(); ssMat.dispose();
      clouds.forEach(c => { c.material.dispose(); });
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* 1. Deep Space Cosmic Midnight Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 75% 55% at 82% 10%, rgba(76, 29, 149, 0.65) 0%, transparent 60%),
            radial-gradient(ellipse 65% 50% at 18% 85%, rgba(15, 23, 72, 0.75) 0%, transparent 58%),
            radial-gradient(ellipse 50% 40% at 45% 45%, rgba(30, 27, 75, 0.45) 0%, transparent 65%),
            radial-gradient(ellipse 100% 100% at 50% 50%, #08061a 0%, #04030d 50%, #020108 100%)
          `,
        }}
      />

      {/* 2. Glowing Stardust & Cosmic Nebula */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 25% 35%, rgba(126, 34, 206, 0.24) 0%, transparent 70%),
            radial-gradient(ellipse 45% 35% at 75% 65%, rgba(37, 99, 235, 0.20) 0%, transparent 70%),
            radial-gradient(ellipse 35% 25% at 60% 25%, rgba(236, 72, 153, 0.14) 0%, transparent 65%)
          `,
        }}
      />

      {/* 3. Celestial Starfield (160 distant stars, 85 mid stars, 24 hero stars, 10 cross stars) */}
      <DistantStars />
      <MidStars />
      <HeroStars />

      {/* 4. Shooting Stars / Meteors across the night sky */}
      <ShootingStar top={10} left={12} delay={1.2} duration={7} />
      <ShootingStar top={26} left={48} delay={4.0} duration={8.5} />
      <ShootingStar top={8} left={68} delay={7.2} duration={8} />

      {/* 5. 3D WebGL Canvas Layer (interactive morphing shapes & space) */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default StarsBg;







import { useState, useEffect } from 'react';

const COLORS = ['#ff6b35', '#0ea5e9', '#22c55e', '#f59e0b', '#ffffff'];
const PIECE_COUNT = 35;

function createPiece(i) {
  return {
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.4,
    size: Math.random() * 6 + 4,
    drift: (Math.random() - 0.5) * 80,
    rotation: Math.random() * 720,
  };
}

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (active) {
      setPieces(Array.from({ length: PIECE_COUNT }, (_, i) => createPiece(i)));
      const timer = setTimeout(() => setPieces([]), 1400);
      return () => clearTimeout(timer);
    }
    setPieces([]);
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 50 }}>
      {pieces.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall 1.2s ease-out ${p.delay}s forwards`,
            transform: `translateX(${p.drift}px)`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ScoreDisplay({ score }) {
  const [floatingPoints, setFloatingPoints] = useState(null);
  const prevScore = useRef(score);

  useEffect(() => {
    const diff = score - prevScore.current;
    if (diff > 0) {
      setFloatingPoints(diff);
      const timer = setTimeout(() => setFloatingPoints(null), 800);
      return () => clearTimeout(timer);
    }
    prevScore.current = score;
  }, [score]);

  useEffect(() => {
    prevScore.current = score;
  }, [score]);

  return (
    <div className="relative text-center">
      <div className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Score</div>
      <motion.div
        key={score}
        initial={{ scale: 1.3 }}
        animate={{ scale: [1.3, 0.95, 1] }}
        className="text-2xl font-bold text-primary-300"
      >
        {score}
      </motion.div>
      <AnimatePresence>
        {floatingPoints && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1.2 }}
            animate={{ opacity: 0, y: -35, scale: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-correct font-bold text-sm"
          >
            +{floatingPoints}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

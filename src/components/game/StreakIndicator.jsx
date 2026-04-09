import { motion, AnimatePresence } from 'framer-motion';

// Streak intensity tiers
function getIntensity(streak) {
  if (streak >= 10) return { size: 'text-xl', glow: 'shadow-[0_0_16px_rgba(245,158,11,0.5)]', extra: '🔥🔥🔥' };
  if (streak >= 7) return { size: 'text-lg', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]', extra: '🔥🔥' };
  if (streak >= 5) return { size: 'text-lg', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.3)]', extra: '🔥' };
  return { size: 'text-base', glow: '', extra: '' };
}

export default function StreakIndicator({ streak }) {
  if (streak < 2) return null;

  const { size, glow, extra } = getIntensity(streak);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`flex items-center gap-1.5 bg-streak/10 border border-streak/20 px-3 py-1 rounded-full ${glow}`}
      >
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: streak >= 7 ? 0.35 : 0.6 }}
          className={size}
        >
          🔥{extra}
        </motion.span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={streak}
            initial={{ scale: 1.8, color: '#fde047' }}
            animate={{ scale: 1, color: '#f59e0b' }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            className="text-streak font-bold text-xs inline-block"
          >
            {streak}x Streak!
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';

export default function StreakIndicator({ streak }) {
  if (streak < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex items-center gap-1.5 bg-streak/10 border border-streak/20 px-3 py-1 rounded-full"
      >
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="text-base"
        >
          🔥
        </motion.span>
        <span className="text-streak font-bold text-xs">{streak}x Streak!</span>
      </motion.div>
    </AnimatePresence>
  );
}

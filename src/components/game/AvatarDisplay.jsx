import { motion } from 'framer-motion';

const reactions = {
  idle: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  thinking: {
    animate: { rotate: [-3, 3, -3] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  correct: {
    animate: { scale: [1, 1.3, 1], y: [0, -10, 0] },
    transition: { duration: 0.5, type: 'spring' },
  },
  wrong: {
    animate: { x: [-5, 5, -4, 4, -2, 2, 0], y: [0, 3, 0] },
    transition: { duration: 0.5 },
  },
  timeUp: {
    animate: { scale: [1, 1.2, 0.9, 1], rotate: [0, -10, 10, 0] },
    transition: { duration: 0.6 },
  },
};

export default function AvatarDisplay({ emoji, reaction = 'idle' }) {
  const config = reactions[reaction] || reactions.idle;

  return (
    <motion.div
      className="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center backdrop-blur-sm"
      animate={config.animate}
      transition={config.transition}
      key={reaction} // Re-trigger animation on reaction change
    >
      <span className="text-2xl">{emoji}</span>
    </motion.div>
  );
}

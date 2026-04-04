import { motion } from 'framer-motion';

export default function ProgressBar({ value, max, className = '' }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={`w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary-500 to-accent rounded-full"
        initial={false}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}

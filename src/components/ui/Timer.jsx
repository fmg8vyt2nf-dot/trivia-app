import { motion } from 'framer-motion';

export default function Timer({ timeRemaining, maxTime, compact = false }) {
  const percentage = maxTime > 0 ? (timeRemaining / maxTime) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const color =
    percentage > 60 ? '#22c55e' :
    percentage > 30 ? '#f59e0b' :
    '#ef4444';

  return (
    <div className={`relative ${compact ? 'w-12 h-12' : 'w-20 h-20'} flex items-center justify-center flex-shrink-0`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={compact ? 7 : 5} />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={compact ? 7 : 5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
      </svg>
      <motion.span
        className={`absolute ${compact ? 'text-sm' : 'text-xl'} font-bold`}
        style={{ color }}
        animate={timeRemaining <= 5 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {timeRemaining}
      </motion.span>
    </div>
  );
}

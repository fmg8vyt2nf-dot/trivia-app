import { motion } from 'framer-motion';

export default function XPBar({ level, levelTitle, xpProgress, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">{level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-[0_0_12px_rgba(255,107,53,0.3)]">
            <span className="text-xs font-bold text-white">{level}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white/80">{levelTitle}</div>
            <div className="text-[10px] text-white/30">Level {level}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/40">
            {xpProgress.needed > 0 ? `${xpProgress.current} / ${xpProgress.needed} XP` : 'MAX'}
          </span>
        </div>
      </div>
      <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress.percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

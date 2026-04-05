import { motion } from 'framer-motion';

const powerUpConfig = [
  { key: 'fiftyFifty', icon: '✂️', label: '50/50', desc: 'Remove 2 wrong answers' },
  { key: 'doubleDip', icon: '🎯', label: 'Dip', desc: 'Two attempts, 50% points' },
  { key: 'skip', icon: '⏭️', label: 'Skip', desc: 'Skip this question' },
  { key: 'extraTime', icon: '⏱️', label: '+10s', desc: 'Add 10 seconds' },
  { key: 'categoryHint', icon: '💡', label: 'Hint', desc: 'Get a clue' },
  { key: 'audiencePoll', icon: '📊', label: 'Poll', desc: 'Ask the audience' },
];

export default function PowerUpBar({ powerUps, onUseFiftyFifty, onUseSkip, onUseExtraTime, onUseCategoryHint, onUseDoubleDip, onUseAudiencePoll, disabled }) {
  const handlers = {
    fiftyFifty: onUseFiftyFifty,
    doubleDip: onUseDoubleDip,
    skip: onUseSkip,
    extraTime: onUseExtraTime,
    categoryHint: onUseCategoryHint,
    audiencePoll: onUseAudiencePoll,
  };

  return (
    <div className="flex justify-center gap-1.5 sm:gap-3">
      {powerUpConfig.map(({ key, icon, label }) => {
        const count = powerUps[key] ?? 0;
        const isDisabled = disabled || count <= 0;

        return (
          <motion.button
            key={key}
            whileHover={!isDisabled ? { scale: 1.08 } : {}}
            whileTap={!isDisabled ? { scale: 0.92 } : {}}
            onClick={() => !isDisabled && handlers[key]?.()}
            disabled={isDisabled}
            className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border transition-all cursor-pointer ${
              isDisabled
                ? 'border-white/[0.04] bg-white/[0.02] opacity-40 cursor-not-allowed'
                : 'border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08] hover:border-primary-500/30 hover:shadow-[0_0_15px_rgba(255,107,53,0.1)]'
            }`}
          >
            <span className="text-base sm:text-lg">{icon}</span>
            <span className="text-[9px] sm:text-[10px] font-medium text-white/50">{label}</span>
            {/* Count badge */}
            <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center ${
              count > 0 ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/30'
            }`}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

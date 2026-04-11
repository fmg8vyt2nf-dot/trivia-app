import { motion } from 'framer-motion';

const labels = ['A', 'B', 'C', 'D'];

export default function AnswerOption({ answer, index, isSelected, isCorrect, isRevealed, onSelect, disabled, eliminated, isDoubleDipWrong, pollPercentage }) {
  let bg = 'bg-white/[0.05] hover:bg-white/[0.10] border-white/[0.10] hover:border-white/[0.18]';
  let glow = '';
  let shakeClass = '';
  if (isRevealed) {
    if (answer === isCorrect) {
      bg = 'bg-correct/15 border-correct/60';
      glow = 'shadow-[0_0_20px_rgba(34,197,94,0.2)]';
    } else if (isSelected) {
      bg = 'bg-wrong/15 border-wrong/60';
      glow = 'shadow-[0_0_20px_rgba(239,68,68,0.2)]';
      shakeClass = 'animate-[shake_0.4s_ease-in-out]';
    } else {
      bg = 'bg-white/[0.02] border-white/[0.04] opacity-40';
    }
  }

  // Double Dip first wrong answer: show as wrong but don't reveal correct
  if (isDoubleDipWrong) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0.5, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="w-full p-4 rounded-xl border border-wrong/30 bg-wrong/10 text-left flex items-center gap-3 pointer-events-none"
      >
        <span className="w-8 h-8 rounded-lg bg-wrong/10 border border-wrong/20 flex items-center justify-center text-xs font-bold shrink-0 text-wrong/50">
          {labels[index]}
        </span>
        <span className="text-sm md:text-base text-wrong/50 line-through">{answer}</span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-wrong/60 text-lg"
        >
          &#10007;
        </motion.span>
      </motion.div>
    );
  }

  if (eliminated) {
    return (
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0.15, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] text-left flex items-center gap-3 pointer-events-none"
      >
        <span className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-xs font-bold shrink-0 text-white/20">
          {labels[index]}
        </span>
        <span className="text-sm md:text-base text-white/20 line-through">{answer}</span>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 320, damping: 24 }}
      whileHover={disabled ? {} : { scale: 1.015, x: 4 }}
      whileTap={disabled ? {} : { scale: 0.96, backgroundColor: 'rgba(255,107,53,0.18)', borderColor: 'rgba(255,107,53,0.5)' }}
      className={`w-full px-4 py-4 md:py-5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer backdrop-blur-sm active:brightness-125 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 ${bg} ${glow} ${shakeClass} ${disabled && !isRevealed ? 'cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect(answer)}
      disabled={disabled}
    >
      <span className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.10] flex items-center justify-center text-xs font-bold shrink-0 text-white/50">
        {labels[index]}
      </span>
      <span className="text-sm md:text-base text-white/90 flex-1">{answer}</span>
      {pollPercentage != null && (
        <div className="flex items-center gap-2 ml-auto min-w-[80px]">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pollPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-accent/60"
            />
          </div>
          <span className="text-sm font-bold text-accent w-10 text-right">{pollPercentage}%</span>
        </div>
      )}
      {isRevealed && answer === isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-correct text-lg"
        >
          &#10003;
        </motion.span>
      )}
      {isRevealed && isSelected && answer !== isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-wrong text-lg"
        >
          &#10007;
        </motion.span>
      )}
    </motion.button>
  );
}

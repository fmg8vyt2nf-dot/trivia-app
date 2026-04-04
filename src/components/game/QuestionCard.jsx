import { motion, AnimatePresence } from 'framer-motion';
import AnswerOption from './AnswerOption';
import DifficultyBadge from './DifficultyBadge';

export default function QuestionCard({ question, selectedAnswer, onAnswer, isRevealed, eliminatedAnswers = [], doubleDipFirstAnswer = null, audiencePollData = null }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 font-medium">{question.category}</span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <h2 className="text-lg md:text-xl font-semibold mb-6 leading-relaxed text-white/95">
          {question.question}
        </h2>

        <div className="grid gap-3">
          {question.allAnswers.map((answer, i) => (
            <AnswerOption
              key={answer}
              answer={answer}
              index={i}
              isSelected={selectedAnswer === answer}
              isCorrect={question.correctAnswer}
              isRevealed={isRevealed}
              onSelect={onAnswer}
              disabled={isRevealed}
              eliminated={eliminatedAnswers.includes(answer)}
              isDoubleDipWrong={doubleDipFirstAnswer === answer}
              pollPercentage={audiencePollData?.[answer]}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrivia } from '../hooks/useTrivia';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import Timer from '../components/ui/Timer';
import QuestionCard from '../components/game/QuestionCard';
import QuestionProgress from '../components/game/QuestionProgress';
import ScoreDisplay from '../components/game/ScoreDisplay';
import StreakIndicator from '../components/game/StreakIndicator';
import Confetti from '../components/effects/Confetti';
import PowerUpBar from '../components/game/PowerUpBar';
import AvatarDisplay from '../components/game/AvatarDisplay';
import { useAvatar } from '../hooks/useAvatar';

export default function GamePlayPage() {
  const navigate = useNavigate();
  const {
    state, submitAnswer, handleTimeUp, nextQuestion,
    useFiftyFifty, useSkip, useExtraTime, clearExtraTimeFlag, useCategoryHint, useDoubleDip, useAudiencePoll,
  } = useTrivia();
  const advanceTimerRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { playSound } = useSound();
  const { selectedAvatar } = useAvatar();
  const gameStartedRef = useRef(false);
  const prevStreakRef = useRef(0);

  const {
    questions, currentIndex, status, score, streak, selectedAnswer,
    timePerQuestion, powerUps, eliminatedAnswers, extraTimeGranted, currentHint,
    doubleDipActive, doubleDipFirstAnswer, gameMode,
    streakShield, streakShieldUsed, audiencePollData,
  } = state;

  const currentQuestion = questions[currentIndex];
  const isSpeed = gameMode === 'speed';
  const isBlitz = gameMode === 'blitz';
  const prevCategoryRef = useRef(null);
  const [categoryChanged, setCategoryChanged] = useState(false);

  // Category Blitz: detect category changes
  useEffect(() => {
    if (isBlitz && currentQuestion && status === 'playing') {
      const cat = currentQuestion.category;
      if (prevCategoryRef.current && prevCategoryRef.current !== cat) {
        setCategoryChanged(true);
        const timer = setTimeout(() => setCategoryChanged(false), 1500);
        return () => clearTimeout(timer);
      }
      prevCategoryRef.current = cat;
    }
  }, [isBlitz, currentIndex, currentQuestion, status]);

  // Game start sound
  useEffect(() => {
    if (questions.length > 0 && !gameStartedRef.current) {
      gameStartedRef.current = true;
      playSound('gameStart');
    }
  }, [questions.length, playSound]);

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/setup', { replace: true });
    }
  }, [questions.length, navigate]);

  useEffect(() => {
    if (status === 'finished') {
      navigate('/results', { replace: true });
    }
  }, [status, navigate]);

  const onTimeUp = useCallback(() => {
    handleTimeUp();
  }, [handleTimeUp]);

  const { timeRemaining, addTime } = useTimer({
    duration: timePerQuestion,
    onExpire: onTimeUp,
    isRunning: status === 'playing',
  });

  // Handle extra time power-up
  useEffect(() => {
    if (extraTimeGranted) {
      addTime(10);
      clearExtraTimeFlag();
    }
  }, [extraTimeGranted, addTime, clearExtraTimeFlag]);

  // Timer tick sound for last 5 seconds
  useEffect(() => {
    if (status === 'playing' && timeRemaining <= 5 && timeRemaining > 0) {
      playSound('tick');
    }
  }, [status, Math.ceil(timeRemaining), playSound]);

  function handleAnswer(answer) {
    if (status !== 'playing') return;
    // If double dip first answer was already wrong, don't allow re-clicking it
    if (doubleDipFirstAnswer === answer) return;
    submitAnswer(answer, timeRemaining);
  }

  // Power-up handlers with sound
  function handleFiftyFifty() {
    playSound('powerUp');
    useFiftyFifty();
  }

  function handleSkip() {
    playSound('skip');
    useSkip();
  }

  function handleExtraTime() {
    playSound('powerUp');
    useExtraTime();
  }

  function handleCategoryHint() {
    playSound('powerUp');
    useCategoryHint();
  }

  function handleDoubleDip() {
    playSound('powerUp');
    useDoubleDip();
  }

  function handleAudiencePoll() {
    playSound('powerUp');
    useAudiencePoll();
  }

  // Handle post-answer effects (sound + confetti + advance)
  useEffect(() => {
    if (status === 'answered') {
      const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

      if (isCorrect) {
        playSound('correct');
        setShowConfetti(true);

        // Streak milestone sound
        if (streak >= 3 && streak > prevStreakRef.current) {
          setTimeout(() => playSound('streakMilestone'), 300);
        }

        const confettiTimer = setTimeout(() => setShowConfetti(false), 1400);
        advanceTimerRef.current = setTimeout(() => {
          nextQuestion();
        }, 1500);
        return () => {
          clearTimeout(confettiTimer);
          clearTimeout(advanceTimerRef.current);
        };
      } else {
        if (streakShieldUsed) {
          playSound('streakShield');
        }
        playSound('wrong');
      }

      // Auto-advance after delay
      advanceTimerRef.current = setTimeout(() => {
        nextQuestion();
      }, 1500);
      return () => clearTimeout(advanceTimerRef.current);
    }
  }, [status, nextQuestion, selectedAnswer, currentQuestion?.correctAnswer, playSound, streak, streakShieldUsed]);

  // Track previous streak
  useEffect(() => {
    prevStreakRef.current = streak;
  }, [streak]);

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-white/10 border-t-primary-500"
        />
        <span className="text-sm text-white/40">Loading questions...</span>
      </div>
    );
  }

  const isWrong = status === 'answered' && selectedAnswer !== null && selectedAnswer !== currentQuestion.correctAnswer;

  const isTimeUp = status === 'answered' && selectedAnswer === null;

  return (
    <div className="flex-1 px-4 py-3 sm:py-6 max-w-2xl mx-auto w-full relative">
      <Confetti active={showConfetti} />

      {/* Time's Up flash overlay */}
      {isTimeUp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 1.2] }}
          transition={{ duration: 1.4, times: [0, 0.2, 0.7, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="px-8 py-5 rounded-2xl bg-wrong/20 border-2 border-wrong/50 backdrop-blur-md shadow-[0_0_60px_rgba(239,68,68,0.5)]">
            <span className="text-4xl sm:text-5xl font-extrabold text-wrong uppercase tracking-wider">⏰ Time&apos;s Up!</span>
          </div>
        </motion.div>
      )}

      {/* Category Blitz banner */}
      {isBlitz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-3"
        >
          <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold uppercase tracking-widest">
            🌀 Category Blitz · {currentQuestion?.category}
          </span>
        </motion.div>
      )}

      {/* Category switch notification */}
      {categoryChanged && isBlitz && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center mb-2"
        >
          <span className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold">
            Category switched!
          </span>
        </motion.div>
      )}

      {/* Speed Round banner */}
      {isSpeed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-3"
        >
          <span className="text-[10px] px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-widest">
            ⚡ Speed Round · 2x Points
          </span>
        </motion.div>
      )}

      {/* Top bar: Avatar + Progress + Timer + Score */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <AvatarDisplay
          emoji={selectedAvatar.emoji}
          reaction={
            status === 'answered'
              ? (selectedAnswer === currentQuestion?.correctAnswer ? 'correct'
                : selectedAnswer === null ? 'timeUp' : 'wrong')
              : 'thinking'
          }
          compact
        />
        <div className="flex-1 flex flex-col gap-1">
          <QuestionProgress current={currentIndex} total={questions.length} />
          <div className="flex items-center gap-3">
            <StreakIndicator streak={streak} />
            <ScoreDisplay score={score} />
          </div>
        </div>
        <Timer timeRemaining={timeRemaining} maxTime={timePerQuestion} compact />
      </div>

      {/* Power-ups */}
      <div className="mb-3">
        <PowerUpBar
          powerUps={powerUps}
          onUseFiftyFifty={handleFiftyFifty}
          onUseSkip={handleSkip}
          onUseExtraTime={handleExtraTime}
          onUseCategoryHint={handleCategoryHint}
          onUseDoubleDip={handleDoubleDip}
          onUseAudiencePoll={handleAudiencePoll}
          disabled={status !== 'playing'}
        />
      </div>

      {/* Hint banner */}
      {currentHint && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm text-center"
        >
          <span className="text-amber-300 text-xs sm:text-sm font-medium">💡 {currentHint}</span>
        </motion.div>
      )}

      {/* Streak Shield indicator */}
      {streakShield > 0 && status === 'playing' && (
        <div className="text-center mb-2">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300/70 font-medium">
            🛡️ Streak Shield Ready
          </span>
        </div>
      )}

      {/* Streak Shield activated banner */}
      {streakShieldUsed && status === 'answered' && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm text-center"
        >
          <span className="text-emerald-300 text-xs sm:text-sm font-medium">🛡️ Streak Shield activated!</span>
        </motion.div>
      )}

      {/* Double Dip feedback */}
      {doubleDipFirstAnswer && status === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 px-3 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 backdrop-blur-sm text-center"
        >
          <span className="text-sky-300 text-xs sm:text-sm font-medium">🎯 Try again! One more chance</span>
        </motion.div>
      )}

      {/* Question + Answers with shake on wrong */}
      <motion.div
        animate={isWrong ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
          isRevealed={status === 'answered'}
          eliminatedAnswers={eliminatedAnswers}
          doubleDipFirstAnswer={doubleDipFirstAnswer}
          audiencePollData={audiencePollData}
        />
      </motion.div>

      {/* Feedback */}
      {status === 'answered' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <span className="text-correct font-semibold text-sm">Correct!</span>
          ) : selectedAnswer === null ? (
            <span className="text-wrong font-semibold text-sm">Time&apos;s up! Answer: {currentQuestion.correctAnswer}</span>
          ) : (
            <span className="text-wrong font-semibold text-sm">Wrong! Answer: {currentQuestion.correctAnswer}</span>
          )}
        </motion.div>
      )}
    </div>
  );
}

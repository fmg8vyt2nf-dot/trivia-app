import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { fetchQuestions } from '../services/triviaApi';
import { markQuestionsAsSeen } from '../services/seenQuestions';
import { getPerkAdjustedPowerUps, isPerkUnlocked } from '../data/levelPerks';
import { shuffle } from '../utils/shuffle';
import { CATEGORIES } from '../data/categories';
import { questions as fallbackPool } from '../data/fallbackQuestions';

export function useTrivia() {
  const { state, dispatch } = useGameContext();

  const configureGame = useCallback(({ category, difficulty, questionCount }) => {
    dispatch({ type: 'SET_CONFIG', payload: { category, difficulty, questionCount } });
  }, [dispatch]);

  const startGame = useCallback(async ({ category, difficulty, questionCount }) => {
    dispatch({ type: 'SET_CONFIG', payload: { category, difficulty, questionCount } });
    const result = await fetchQuestions({ amount: questionCount, category, difficulty });
    const powerUps = getPerkAdjustedPowerUps();
    const streakShield = isPerkUnlocked('streak_shield') ? 1 : 0;
    dispatch({ type: 'LOAD_QUESTIONS', payload: { ...result, powerUps, streakShield } });

    // Mark questions as seen so they won't repeat next game
    if (result.questions.length > 0) {
      const categoryName = result.questions[0]?.category || 'Any';
      markQuestionsAsSeen(result.questions, categoryName);
    }

    return result;
  }, [dispatch]);

  const startSpeedRound = useCallback(async ({ category, difficulty, questionCount }) => {
    dispatch({ type: 'SET_CONFIG', payload: { category, difficulty, questionCount, gameMode: 'speed' } });
    const result = await fetchQuestions({ amount: questionCount, category, difficulty });
    const powerUps = getPerkAdjustedPowerUps();
    const streakShield = isPerkUnlocked('streak_shield') ? 1 : 0;
    dispatch({ type: 'LOAD_QUESTIONS', payload: { ...result, powerUps, gameMode: 'speed', streakShield } });

    if (result.questions.length > 0) {
      const categoryName = result.questions[0]?.category || 'Any';
      markQuestionsAsSeen(result.questions, categoryName);
    }

    return result;
  }, [dispatch]);

  const startDailyChallenge = useCallback((questions) => {
    const powerUps = getPerkAdjustedPowerUps();
    const streakShield = isPerkUnlocked('streak_shield') ? 1 : 0;
    dispatch({
      type: 'SET_CONFIG',
      payload: { category: null, difficulty: 'medium', questionCount: 10, gameMode: 'daily' },
    });
    dispatch({
      type: 'LOAD_QUESTIONS',
      payload: { questions, source: 'fallback', gameMode: 'daily', powerUps, streakShield },
    });
  }, [dispatch]);

  const startCategoryBlitz = useCallback(async ({ difficulty, questionCount }) => {
    dispatch({ type: 'SET_CONFIG', payload: { category: null, difficulty, questionCount, gameMode: 'blitz' } });
    // Pick 4 random API categories (numeric IDs only for reliability)
    const apiCategories = CATEGORIES.filter(c => c.id && typeof c.id === 'number');
    const picked = shuffle([...apiCategories]).slice(0, 4);
    const perCategory = Math.ceil(questionCount / picked.length);

    // Fetch from each category in parallel
    const results = await Promise.all(
      picked.map(cat =>
        fetchQuestions({ amount: perCategory, category: cat.id, difficulty }).catch(() => ({ questions: [] }))
      )
    );

    const allQuestions = shuffle(results.flatMap(r => r.questions)).slice(0, questionCount);
    const powerUps = getPerkAdjustedPowerUps();
    const streakShield = isPerkUnlocked('streak_shield') ? 1 : 0;
    dispatch({
      type: 'LOAD_QUESTIONS',
      payload: { questions: allQuestions, source: 'api', gameMode: 'blitz', powerUps, streakShield },
    });

    // Mark as seen
    allQuestions.forEach(q => {
      markQuestionsAsSeen([q], q.category);
    });

    return { questions: allQuestions };
  }, [dispatch]);

  const submitAnswer = useCallback((answer, timeRemaining) => {
    // Double Dip: intercept first wrong pick
    if (state.doubleDipActive && state.doubleDipFirstAnswer === null) {
      const question = state.questions[state.currentIndex];
      const isCorrect = answer === question.correctAnswer;
      if (!isCorrect) {
        dispatch({ type: 'DOUBLE_DIP_FIRST_WRONG', payload: { answer } });
        return;
      }
    }
    dispatch({ type: 'SELECT_ANSWER', payload: { answer, timeRemaining } });
  }, [dispatch, state.doubleDipActive, state.doubleDipFirstAnswer, state.questions, state.currentIndex]);

  const handleTimeUp = useCallback(() => {
    if (state.status === 'playing') {
      dispatch({ type: 'TIME_UP' });
    }
  }, [dispatch, state.status]);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  // Power-ups
  const useFiftyFifty = useCallback(() => {
    if (state.powerUps.fiftyFifty > 0 && state.status === 'playing') {
      dispatch({ type: 'USE_FIFTY_FIFTY' });
    }
  }, [dispatch, state.powerUps.fiftyFifty, state.status]);

  const useReroll = useCallback(() => {
    if (state.powerUps.reroll > 0 && state.status === 'playing') {
      const currentQ = state.questions[state.currentIndex];
      const usedQuestions = new Set(state.questions.map(q => q.question));
      // Find a replacement from the same category and difficulty
      const candidates = fallbackPool.filter(q =>
        q.category === currentQ.category &&
        q.difficulty === currentQ.difficulty &&
        !usedQuestions.has(q.question)
      );
      // Fallback: same category any difficulty
      const pool = candidates.length > 0
        ? candidates
        : fallbackPool.filter(q => q.category === currentQ.category && !usedQuestions.has(q.question));
      // Fallback: any question not already in game
      const finalPool = pool.length > 0
        ? pool
        : fallbackPool.filter(q => !usedQuestions.has(q.question));

      if (finalPool.length > 0) {
        const picked = finalPool[Math.floor(Math.random() * finalPool.length)];
        const replacement = {
          ...picked,
          id: crypto.randomUUID(),
          allAnswers: shuffle([picked.correctAnswer, ...picked.incorrectAnswers]),
        };
        dispatch({ type: 'USE_REROLL', payload: { replacement } });
      }
    }
  }, [dispatch, state.powerUps.reroll, state.status, state.questions, state.currentIndex]);

  const useSlowMotion = useCallback(() => {
    if (state.powerUps.slowMotion > 0 && state.status === 'playing') {
      dispatch({ type: 'USE_SLOW_MOTION' });
    }
  }, [dispatch, state.powerUps.slowMotion, state.status]);

  const clearSlowMotionFlag = useCallback(() => {
    dispatch({ type: 'CLEAR_SLOW_MOTION_FLAG' });
  }, [dispatch]);

  const useCategoryHint = useCallback(() => {
    if (state.powerUps.categoryHint > 0 && state.status === 'playing') {
      dispatch({ type: 'USE_CATEGORY_HINT' });
    }
  }, [dispatch, state.powerUps.categoryHint, state.status]);

  const useDoubleDip = useCallback(() => {
    if (state.powerUps.doubleDip > 0 && state.status === 'playing') {
      dispatch({ type: 'USE_DOUBLE_DIP' });
    }
  }, [dispatch, state.powerUps.doubleDip, state.status]);

  const useAudiencePoll = useCallback(() => {
    if (state.powerUps.audiencePoll > 0 && state.status === 'playing') {
      dispatch({ type: 'USE_AUDIENCE_POLL' });
    }
  }, [dispatch, state.powerUps.audiencePoll, state.status]);

  return {
    state,
    configureGame,
    startGame,
    startSpeedRound,
    startDailyChallenge,
    submitAnswer,
    handleTimeUp,
    nextQuestion,
    resetGame,
    useFiftyFifty,
    useReroll,
    useSlowMotion,
    clearSlowMotionFlag,
    useCategoryHint,
    useDoubleDip,
    useAudiencePoll,
    startCategoryBlitz,
  };
}

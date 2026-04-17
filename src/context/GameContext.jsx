import { createContext, useContext, useReducer } from 'react';
import { TIMER_DURATION, SPEED_ROUND_TIMER, SPEED_ROUND_MULTIPLIER } from '../utils/constants';
import { calculatePoints } from '../utils/scoring';
import { shuffle } from '../utils/shuffle';

const GameContext = createContext(null);

const initialState = {
  category: null,
  difficulty: 'medium',
  questionCount: 10,
  status: 'idle', // idle | loading | playing | answered | finished
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  correctCount: 0,
  streak: 0,
  longestStreak: 0,
  answers: [],
  timePerQuestion: TIMER_DURATION.medium,
  questionSource: null,
  // Power-ups
  powerUps: { fiftyFifty: 1, reroll: 1, slowMotion: 1, categoryHint: 1, doubleDip: 0, audiencePoll: 1 },
  eliminatedAnswers: [],
  slowMotionGranted: false,
  rerollQuestion: null, // backup of original question for reroll
  currentHint: null,
  audiencePollData: null, // { answer: percentage } map when active
  // Streak Shield (passive — auto-activates on wrong answer when streak > 0)
  streakShield: 0, // 0 or 1
  streakShieldUsed: false, // true on the answer where shield triggered
  // Double Dip state
  doubleDipActive: false,
  doubleDipFirstAnswer: null,
  // Game mode
  gameMode: 'standard', // 'standard' | 'daily' | 'speed'
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG': {
      const isSpeed = action.payload.gameMode === 'speed';
      return {
        ...state,
        category: action.payload.category,
        difficulty: action.payload.difficulty,
        questionCount: action.payload.questionCount,
        timePerQuestion: isSpeed
          ? SPEED_ROUND_TIMER
          : (TIMER_DURATION[action.payload.difficulty] || TIMER_DURATION.medium),
        gameMode: action.payload.gameMode || 'standard',
      };
    }

    case 'LOAD_QUESTIONS':
      return {
        ...state,
        status: 'playing',
        questions: action.payload.questions,
        questionSource: action.payload.source,
        currentIndex: 0,
        selectedAnswer: null,
        score: 0,
        correctCount: 0,
        streak: 0,
        longestStreak: 0,
        answers: [],
        powerUps: action.payload.powerUps || { fiftyFifty: 1, reroll: 1, slowMotion: 1, categoryHint: 1, doubleDip: 0, audiencePoll: 1 },
        eliminatedAnswers: [],
        slowMotionGranted: false,
        currentHint: null,
        audiencePollData: null,
        doubleDipActive: false,
        doubleDipFirstAnswer: null,
        streakShield: action.payload.streakShield || 0,
        streakShieldUsed: false,
        gameMode: action.payload.gameMode || state.gameMode,
      };

    case 'SELECT_ANSWER': {
      const question = state.questions[state.currentIndex];
      const isCorrect = action.payload.answer === question.correctAnswer;
      // Streak Shield: if wrong + has streak + shield available → preserve streak
      const shieldActivated = !isCorrect && state.streak > 0 && state.streakShield > 0;
      const newStreak = isCorrect ? state.streak + 1 : (shieldActivated ? state.streak : 0);
      const usedDoubleDip = state.doubleDipActive && state.doubleDipFirstAnswer !== null;
      let points = isCorrect
        ? calculatePoints({
            difficulty: state.difficulty,
            streak: newStreak,
            timeRemaining: action.payload.timeRemaining,
            maxTime: state.timePerQuestion,
          })
        : 0;

      // Speed Round: 2× points
      if (isCorrect && state.gameMode === 'speed') {
        points = Math.round(points * SPEED_ROUND_MULTIPLIER);
      }
      // Double Dip: 50% points (applied after speed multiplier)
      if (isCorrect && usedDoubleDip) {
        points = Math.round(points * 0.5);
      }

      return {
        ...state,
        status: 'answered',
        selectedAnswer: action.payload.answer,
        score: state.score + points,
        correctCount: state.correctCount + (isCorrect ? 1 : 0),
        streak: newStreak,
        longestStreak: Math.max(state.longestStreak, newStreak),
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentIndex,
            selected: action.payload.answer,
            correct: question.correctAnswer,
            isCorrect,
            points,
            timeRemaining: action.payload.timeRemaining,
            doubleDipUsed: usedDoubleDip,
            doubleDipFirstAnswer: state.doubleDipFirstAnswer,
            shieldActivated,
          },
        ],
        doubleDipActive: false,
        doubleDipFirstAnswer: null,
        streakShield: shieldActivated ? 0 : state.streakShield,
        streakShieldUsed: shieldActivated,
      };
    }

    case 'TIME_UP': {
      const question = state.questions[state.currentIndex];
      return {
        ...state,
        status: 'answered',
        selectedAnswer: null,
        streak: 0,
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentIndex,
            selected: null,
            correct: question.correctAnswer,
            isCorrect: false,
            points: 0,
            timeRemaining: 0,
          },
        ],
        doubleDipActive: false,
        doubleDipFirstAnswer: null,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, status: 'finished' };
      }
      return {
        ...state,
        status: 'playing',
        currentIndex: nextIndex,
        selectedAnswer: null,
        eliminatedAnswers: [],
        currentHint: null,
        audiencePollData: null,
        doubleDipActive: false,
        doubleDipFirstAnswer: null,
        streakShieldUsed: false,
      };
    }

    case 'USE_FIFTY_FIFTY': {
      if (state.powerUps.fiftyFifty <= 0 || state.status !== 'playing') return state;
      const question = state.questions[state.currentIndex];
      const wrongAnswers = question.allAnswers
        .filter(a => a !== question.correctAnswer && !state.eliminatedAnswers.includes(a));
      const toEliminate = shuffle([...wrongAnswers]).slice(0, 2);
      return {
        ...state,
        powerUps: { ...state.powerUps, fiftyFifty: state.powerUps.fiftyFifty - 1 },
        eliminatedAnswers: [...state.eliminatedAnswers, ...toEliminate],
      };
    }

    case 'USE_REROLL': {
      if (state.powerUps.reroll <= 0 || state.status !== 'playing') return state;
      const replacement = action.payload.replacement;
      if (!replacement) return state;
      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = replacement;
      return {
        ...state,
        questions: newQuestions,
        powerUps: { ...state.powerUps, reroll: state.powerUps.reroll - 1 },
        eliminatedAnswers: [],
        currentHint: null,
        audiencePollData: null,
      };
    }

    case 'USE_SLOW_MOTION': {
      if (state.powerUps.slowMotion <= 0 || state.status !== 'playing') return state;
      return {
        ...state,
        powerUps: { ...state.powerUps, slowMotion: state.powerUps.slowMotion - 1 },
        slowMotionGranted: true,
      };
    }

    case 'CLEAR_SLOW_MOTION_FLAG':
      return { ...state, slowMotionGranted: false };

    case 'USE_CATEGORY_HINT': {
      if (state.powerUps.categoryHint <= 0 || state.status !== 'playing') return state;
      const hintQuestion = state.questions[state.currentIndex];
      const answer = hintQuestion.correctAnswer.trim();
      const words = answer.split(/\s+/);
      const firstLetter = answer[0].toUpperCase();
      const hint = words.length > 1
        ? `The answer has ${words.length} words and starts with "${firstLetter}"`
        : `The answer has ${answer.length} letters and starts with "${firstLetter}"`;
      return {
        ...state,
        powerUps: { ...state.powerUps, categoryHint: state.powerUps.categoryHint - 1 },
        currentHint: hint,
      };
    }

    case 'USE_DOUBLE_DIP': {
      if (state.powerUps.doubleDip <= 0 || state.status !== 'playing') return state;
      return {
        ...state,
        powerUps: { ...state.powerUps, doubleDip: state.powerUps.doubleDip - 1 },
        doubleDipActive: true,
      };
    }

    case 'DOUBLE_DIP_FIRST_WRONG':
      return {
        ...state,
        doubleDipFirstAnswer: action.payload.answer,
        // Status stays 'playing' — timer keeps running, remaining answers clickable
      };

    case 'USE_AUDIENCE_POLL': {
      if (state.powerUps.audiencePoll <= 0 || state.status !== 'playing') return state;
      const pollQuestion = state.questions[state.currentIndex];
      const answers = pollQuestion.allAnswers;
      const correct = pollQuestion.correctAnswer;
      // Generate biased percentages: correct gets 40-65%, rest split randomly
      const correctPct = Math.floor(Math.random() * 26) + 40; // 40-65
      let remaining = 100 - correctPct;
      const pollData = {};
      const wrongAnswers = answers.filter(a => a !== correct);
      wrongAnswers.forEach((a, i) => {
        if (i === wrongAnswers.length - 1) {
          pollData[a] = remaining;
        } else {
          const share = Math.floor(Math.random() * (remaining - (wrongAnswers.length - 1 - i))) + 1;
          pollData[a] = Math.min(share, remaining - (wrongAnswers.length - 1 - i));
          remaining -= pollData[a];
        }
      });
      pollData[correct] = correctPct;
      return {
        ...state,
        powerUps: { ...state.powerUps, audiencePoll: state.powerUps.audiencePoll - 1 },
        audiencePollData: pollData,
      };
    }

    case 'CLEAR_HINT':
      return { ...state, currentHint: null };

    case 'FINISH_GAME':
      return { ...state, status: 'finished' };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within GameProvider');
  return context;
}

import { API_BASE_URL } from '../utils/constants';
import { decodeHTML } from './questionDecoder';
import { shuffle } from '../utils/shuffle';
import { getLocalQuestions, CATEGORY_NAME_MAP } from '../data/fallbackQuestions';
import { fetchFromTriviaApi, hasApiSupport } from './theTriviaApi';
import { filterUnseenQuestions } from './seenQuestions';

let sessionToken = null;

async function getToken() {
  if (sessionToken) return sessionToken;
  const stored = sessionStorage.getItem('trivia_token');
  if (stored) {
    sessionToken = stored;
    return sessionToken;
  }
  const res = await fetch(`${API_BASE_URL}/api_token.php?command=request`);
  const data = await res.json();
  if (data.response_code === 0) {
    sessionToken = data.token;
    sessionStorage.setItem('trivia_token', sessionToken);
  }
  return sessionToken;
}

async function resetToken() {
  if (!sessionToken) return;
  await fetch(`${API_BASE_URL}/api_token.php?command=reset&token=${sessionToken}`);
}

function normalizeQuestion(q, index) {
  return {
    id: `api-${index}-${Date.now()}`,
    category: decodeHTML(q.category),
    difficulty: q.difficulty,
    question: decodeHTML(q.question),
    correctAnswer: decodeHTML(q.correct_answer),
    allAnswers: shuffle([
      decodeHTML(q.correct_answer),
      ...q.incorrect_answers.map(a => decodeHTML(a)),
    ]),
  };
}

export async function fetchQuestions({ amount = 10, category = null, difficulty = 'medium' }) {
  // Custom (non-numeric) categories like 'bollywood', 'marvel', etc.
  if (category && typeof category === 'string' && isNaN(Number(category))) {
    const categoryName = CATEGORY_NAME_MAP[category] || category;

    // Try The Trivia API first for categories that have API support
    if (hasApiSupport(category)) {
      try {
        const apiQuestions = await fetchFromTriviaApi({ amount, category, difficulty });
        if (apiQuestions.length >= amount) {
          return { source: 'api', questions: apiQuestions.slice(0, amount) };
        }
        // Got some but not enough — supplement with local fallback
        if (apiQuestions.length > 0) {
          const remaining = amount - apiQuestions.length;
          const localAll = getLocalQuestions({ amount: remaining + 20, category: categoryName, difficulty });
          const unseen = filterUnseenQuestions(localAll, categoryName, remaining);
          const extra = shuffle(unseen).slice(0, remaining);
          return { source: 'api', questions: [...apiQuestions, ...extra] };
        }
      } catch {
        // API failed — fall through to local
      }
    }

    // Use local fallback with seen-question filtering
    const localAll = getLocalQuestions({ amount: amount + 30, category: categoryName, difficulty });
    const unseen = filterUnseenQuestions(localAll, categoryName, amount);
    const questions = shuffle(unseen).slice(0, amount);
    return { source: 'fallback', questions };
  }

  // Standard numeric categories — try OpenTDB first
  try {
    const token = await getToken();
    const params = new URLSearchParams({
      amount: String(amount),
      type: 'multiple',
    });
    if (category) params.set('category', String(category));
    if (difficulty) params.set('difficulty', difficulty);
    if (token) params.set('token', token);

    const res = await fetch(`${API_BASE_URL}/api.php?${params}`);
    if (!res.ok) throw new Error('Network error');

    const data = await res.json();

    if (data.response_code === 0 && data.results.length > 0) {
      const apiQuestions = data.results.map((q, i) => normalizeQuestion(q, i));
      // If API returned fewer than requested, supplement with fallback
      if (apiQuestions.length < amount) {
        const categoryName = category ? CATEGORY_NAME_MAP[category] || null : null;
        const extra = getLocalQuestions({
          amount: amount - apiQuestions.length,
          category: categoryName,
          difficulty,
        });
        return { source: 'api', questions: [...apiQuestions, ...extra] };
      }
      return { source: 'api', questions: apiQuestions };
    }

    if (data.response_code === 4) {
      await resetToken();
      sessionToken = null;
      sessionStorage.removeItem('trivia_token');
      return fetchQuestions({ amount, category, difficulty });
    }

    throw new Error(`API response code: ${data.response_code}`);
  } catch (error) {
    // OpenTDB failed — try The Trivia API as secondary source
    try {
      const secondaryQuestions = await fetchFromTriviaApi({ amount, category, difficulty });
      if (secondaryQuestions.length >= amount) {
        return { source: 'api', questions: secondaryQuestions.slice(0, amount) };
      }
      // Got some from secondary — supplement with local
      if (secondaryQuestions.length > 0) {
        const categoryName = category ? CATEGORY_NAME_MAP[category] || null : null;
        const remaining = amount - secondaryQuestions.length;
        const extra = getLocalQuestions({ amount: remaining, category: categoryName, difficulty });
        return { source: 'api', questions: [...secondaryQuestions, ...extra] };
      }
    } catch {
      // Secondary also failed
    }

    // Both APIs failed — use local fallback with seen filtering
    console.warn('Both APIs unavailable, using fallback questions:', error.message);
    const categoryName = category ? CATEGORY_NAME_MAP[category] || null : null;
    const localAll = getLocalQuestions({ amount: amount + 20, category: categoryName, difficulty });
    const unseen = filterUnseenQuestions(localAll, categoryName || 'Any', amount);
    return {
      source: 'fallback',
      questions: shuffle(unseen).slice(0, amount),
    };
  }
}

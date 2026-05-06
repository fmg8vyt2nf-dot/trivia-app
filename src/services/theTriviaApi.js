// The Trivia API (the-trivia-api.com) — Free, no auth key needed
// Used as secondary source for fresh internet questions

import { shuffle } from '../utils/shuffle';

const BASE_URL = 'https://the-trivia-api.com/v2/questions';

// Map our custom category IDs to The Trivia API parameters
const CATEGORY_API_MAP = {
  marvel: { tags: 'marvel', categories: 'film_and_tv' },
  indian_history: { tags: 'india', categories: 'history' },
  food: { categories: 'food_and_drink' },
  bollywood_cinema: { categories: 'film_and_tv', tags: 'bollywood' },
  ipl_cricket: null,
  indian_food: null,
  bollywood_actors: null,
  // These don't have good API matches — will use local fallback only
  bollywood: null,
  bollywood_songs: null,
  cricket: null,
};

// Map our numeric OpenTDB category IDs to The Trivia API categories
const STANDARD_CATEGORY_MAP = {
  9: 'general_knowledge',    // General Knowledge
  11: 'film_and_tv',         // Film
  12: 'music',               // Music
  14: 'film_and_tv',         // Television
  15: 'general_knowledge',   // Video Games (closest match)
  17: 'science',             // Science & Nature
  18: 'science',             // Computers (closest match)
  21: 'sport_and_leisure',   // Sports
  22: 'geography',           // Geography
  23: 'history',             // History
  27: 'science',             // Animals (closest match)
};

// Map difficulty names (ours → theirs)
const DIFFICULTY_MAP = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

function normalizeQuestion(q, index) {
  return {
    id: `trivia-api-${q.id || index}-${Date.now()}`,
    category: q.category ? q.category.replace(/_/g, ' ').replace(/\band\b/g, '&').replace(/\b\w/g, c => c.toUpperCase()) : 'General',
    difficulty: q.difficulty || 'medium',
    question: q.question?.text || q.question,
    correctAnswer: q.correctAnswer,
    allAnswers: shuffle([q.correctAnswer, ...q.incorrectAnswers]),
  };
}

/**
 * Fetch questions from The Trivia API for a custom category
 * Returns normalized questions or empty array on failure
 */
export async function fetchFromTriviaApi({ amount = 10, category = null, difficulty = 'medium' }) {
  try {
    const params = new URLSearchParams({ limit: String(amount) });

    // Handle custom string categories
    if (category && typeof category === 'string' && isNaN(Number(category))) {
      const mapping = CATEGORY_API_MAP[category];
      if (!mapping) return []; // No API match for this category
      if (mapping.categories) params.set('categories', mapping.categories);
      if (mapping.tags) params.set('tags', mapping.tags);
    }
    // Handle standard numeric categories
    else if (category) {
      const apiCategory = STANDARD_CATEGORY_MAP[category];
      if (apiCategory) params.set('categories', apiCategory);
    }

    if (difficulty && DIFFICULTY_MAP[difficulty]) {
      params.set('difficulties', DIFFICULTY_MAP[difficulty]);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${BASE_URL}?${params}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((q, i) => normalizeQuestion(q, i));
  } catch (error) {
    // Silently fail — caller will use fallback
    return [];
  }
}

/**
 * Check if a custom category has API support
 */
export function hasApiSupport(category) {
  if (typeof category === 'string' && isNaN(Number(category))) {
    return CATEGORY_API_MAP[category] !== null && CATEGORY_API_MAP[category] !== undefined;
  }
  return true; // Standard categories always have OpenTDB support
}

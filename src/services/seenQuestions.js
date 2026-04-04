// Seen Questions Tracker — prevents showing the same question twice
// Tracks question hashes per category in localStorage

const STORAGE_KEY = 'trivia_seen_questions';

/**
 * Simple hash of a question string for compact storage
 */
function hashQuestion(questionText) {
  let hash = 0;
  for (let i = 0; i < questionText.length; i++) {
    const char = questionText.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Get all seen question hashes from localStorage
 */
function getSeenData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save seen data to localStorage
 */
function saveSeenData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full — clear and retry
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Filter out questions the user has already seen in this category.
 * If all questions have been seen (or nearly all), auto-resets the category.
 *
 * @param {Array} questions - Array of question objects with `question` field
 * @param {string} category - Category name (e.g., 'Bollywood', 'Cricket')
 * @param {number} neededCount - How many questions we need
 * @returns {Array} - Filtered questions (unseen first, then reset if needed)
 */
export function filterUnseenQuestions(questions, category, neededCount) {
  const seenData = getSeenData();
  const seenHashes = new Set(seenData[category] || []);

  // Split into unseen and seen
  const unseen = questions.filter(q => !seenHashes.has(hashQuestion(q.question)));
  const seen = questions.filter(q => seenHashes.has(hashQuestion(q.question)));

  // If we have enough unseen questions, use those
  if (unseen.length >= neededCount) {
    return unseen;
  }

  // Not enough unseen — reset category and return all questions
  // This ensures the user eventually sees all questions again
  if (seenData[category]) {
    delete seenData[category];
    saveSeenData(seenData);
  }
  return questions;
}

/**
 * Mark questions as seen after a game
 *
 * @param {Array} questions - Array of question objects that were shown
 * @param {string} category - Category name
 */
export function markQuestionsAsSeen(questions, category) {
  const seenData = getSeenData();
  const existingHashes = seenData[category] || [];
  const newHashes = questions.map(q => hashQuestion(q.question));

  // Merge and deduplicate
  const merged = [...new Set([...existingHashes, ...newHashes])];
  seenData[category] = merged;
  saveSeenData(seenData);
}

/**
 * Clear seen data for a specific category or all categories
 */
export function clearSeenQuestions(category = null) {
  if (category) {
    const seenData = getSeenData();
    delete seenData[category];
    saveSeenData(seenData);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Get stats about seen questions for a category
 */
export function getSeenStats(category) {
  const seenData = getSeenData();
  return {
    seenCount: (seenData[category] || []).length,
  };
}

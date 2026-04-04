// Seen Questions Tracker — prevents showing the same question twice
// Uses ordered list (oldest-seen first) for least-recently-seen prioritization

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
 * Uses least-recently-seen ordering: unseen questions first, then
 * oldest-seen questions if not enough unseen are available.
 * Trims the seen list to keep only the most recent half, so older
 * questions gradually become available again.
 *
 * @param {Array} questions - Array of question objects with `question` field
 * @param {string} category - Category name (e.g., 'Bollywood', 'Cricket')
 * @param {number} neededCount - How many questions we need
 * @returns {Array} - Filtered questions (unseen first, then least-recently-seen)
 */
export function filterUnseenQuestions(questions, category, neededCount) {
  const seenData = getSeenData();
  const seenList = seenData[category] || []; // ordered: oldest first
  const seenSet = new Set(seenList);

  // Split into unseen and seen
  const unseen = questions.filter(q => !seenSet.has(hashQuestion(q.question)));

  // If we have enough unseen questions, use those
  if (unseen.length >= neededCount) {
    return unseen;
  }

  // Not enough unseen — supplement with least-recently-seen questions
  // Sort seen questions by their position in seenList (oldest seen = lowest index = shown first)
  const seenQuestions = questions
    .filter(q => seenSet.has(hashQuestion(q.question)))
    .sort((a, b) => {
      const idxA = seenList.indexOf(hashQuestion(a.question));
      const idxB = seenList.indexOf(hashQuestion(b.question));
      return idxA - idxB; // oldest-seen first
    });

  const combined = [...unseen, ...seenQuestions];

  // Trim the seen list: drop the oldest half so those questions
  // won't be considered "recently seen" next time
  if (unseen.length < neededCount && seenList.length > 0) {
    const keepCount = Math.floor(seenList.length / 2);
    seenData[category] = seenList.slice(seenList.length - keepCount);
    saveSeenData(seenData);
  }

  return combined;
}

/**
 * Mark questions as seen after a game.
 * Appends to the end of the list (newest = most recently seen).
 *
 * @param {Array} questions - Array of question objects that were shown
 * @param {string} category - Category name
 */
export function markQuestionsAsSeen(questions, category) {
  const seenData = getSeenData();
  const existingList = seenData[category] || [];
  const newHashes = questions.map(q => hashQuestion(q.question));

  // Remove any existing entries for these questions (they'll be re-added at the end)
  const filtered = existingList.filter(h => !newHashes.includes(h));
  // Append new hashes at end (most recently seen)
  seenData[category] = [...filtered, ...newHashes];
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

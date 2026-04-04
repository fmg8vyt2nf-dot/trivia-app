# Implementation Plan: 7 Major Features

## Implementation Order

### Phase 1 — More Categories + Sound Effects (no dependencies)
1. **Feature 7: More Categories** — Add Cricket, Marvel, Indian History, Bollywood Songs to categories.js + 48 fallback questions
2. **Feature 6: Sound Effects** — Web Audio API sound engine (soundManager.js), useSound hook, mute toggle in Header, volume slider in Settings, gameplay sound triggers

### Phase 2 — XP & Category Mastery (uses sound)
3. **Feature 2: XP & Levels** — XP earned from score, 10 levels (Novice→Trivia God), XPBar component, level badge in Header, XP animation on results
4. **Feature 3: Category Mastery** — Per-category tracking (accuracy, stars), MasteryStars component, new /mastery page, stars on setup category cards

### Phase 3 — Power-Ups & Avatars (uses sound, modifies reducer)
5. **Feature 4: Power-Ups** — 50/50, Skip, Extra Time. New reducer actions, PowerUpBar component, timer extension, answer elimination animation
6. **Feature 5: Animated Avatars** — 10 emoji avatars, AvatarPicker, animated AvatarDisplay during gameplay (reacts to correct/wrong), avatar on leaderboard

### Phase 4 — Daily Challenge (integrates everything)
7. **Feature 1: Daily Challenge** — Seeded random for same-day questions, /daily page, play-once-per-day, streak counter, gameMode in reducer

## New Files (17)
- src/services/soundManager.js, src/hooks/useSound.js
- src/utils/xpLevels.js, src/hooks/useXP.js, src/components/ui/XPBar.jsx, src/components/effects/XPAnimation.jsx
- src/hooks/useCategoryMastery.js, src/components/game/MasteryStars.jsx, src/pages/MasteryPage.jsx
- src/components/game/PowerUpBar.jsx
- src/data/avatars.js, src/hooks/useAvatar.js, src/components/game/AvatarDisplay.jsx, src/components/game/AvatarPicker.jsx
- src/utils/seededRandom.js, src/hooks/useDailyChallenge.js, src/pages/DailyChallengePage.jsx

## Modified Files (15)
- src/data/categories.js, src/data/fallbackQuestions.js
- src/context/GameContext.jsx, src/hooks/useTrivia.js, src/hooks/useTimer.js
- src/pages/ (all 6 pages), src/App.jsx
- src/components/layout/Header.jsx
- src/components/game/QuestionCard.jsx, src/components/game/AnswerOption.jsx

## New Routes: /daily, /mastery
## New localStorage: trivia_xp, trivia_mastery, trivia_avatar, trivia_daily
## New Reducer Actions: USE_FIFTY_FIFTY, USE_SKIP, USE_EXTRA_TIME, CLEAR_EXTRA_TIME_FLAG
## New State Fields: powerUps, eliminatedAnswers, extraTimeGranted, gameMode

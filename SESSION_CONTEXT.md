# Session Context — Trivia App

## Current State

The app is fully functional with **8 pages**, **18 categories**, **416+ questions**, **5 power-ups**, and a new **level-based perks system** with 4 perks. All features verified on dev server with zero console errors.

### What Was Built This Session

**Category Hint power-up** (from previous session, verified this session):
- 💡 Hint button reveals clue about the correct answer (word count + first letter)

**4 Level-Based Perks** (new this session):
1. **Extra 50/50 (Lv 3 Quizzer)** — 2 uses of 50/50 per game instead of 1
2. **Speed Round (Lv 4 Scholar)** — New game mode: 5s timer, 2x points, ⚡ banner
3. **Double Dip (Lv 5 Expert)** — New power-up: pick 2 answers, if either correct get 50% points. First wrong answer shown struck-through in red, "Try again!" banner, timer keeps running
4. **Locked Avatars (Lv 4/6/8)** — Dragon🐲=Lv4 Scholar, Unicorn🦄=Lv6 Master, Alien👽=Lv8 Legend. 🔒 overlay with grayscale+blur in avatar picker

### Architecture
- `src/data/levelPerks.js` — Central perk registry with pure utility functions (`getPlayerLevel()`, `getPerkAdjustedPowerUps()`, `isAvatarUnlocked()`)
- `src/hooks/usePerks.js` — Reactive hook wrapping `useXP()` for component-level perk queries
- Level data bridged to GameContext reducer via action payloads (not inside the reducer itself)

## Files Modified This Session

### New Files (2)
| File | Purpose |
|------|---------|
| `src/data/levelPerks.js` | Perk definitions, LOCKED_AVATARS map, getPlayerLevel(), isPerkUnlocked(), isAvatarUnlocked(), getPerkAdjustedPowerUps() |
| `src/hooks/usePerks.js` | Reactive hook: useXP() + perk checks, returns hasSpeedRound, hasDoubleDip, checkAvatar, etc. |

### Modified Files (12)
| File | Changes |
|------|---------|
| `src/context/GameContext.jsx` | Added doubleDip to powerUps, doubleDipActive/doubleDipFirstAnswer state, USE_DOUBLE_DIP + DOUBLE_DIP_FIRST_WRONG actions, speed round timer override in SET_CONFIG, 2x/0.5x scoring multipliers in SELECT_ANSWER, double dip reset in TIME_UP/NEXT_QUESTION, accept powerUps payload in LOAD_QUESTIONS |
| `src/hooks/useTrivia.js` | Import getPerkAdjustedPowerUps, pass level-adjusted powerUps in startGame/startDailyChallenge, add startSpeedRound(), add useDoubleDip(), modify submitAnswer() to intercept double dip first wrong |
| `src/utils/constants.js` | Added SPEED_ROUND_TIMER=5, SPEED_ROUND_MULTIPLIER=2 |
| `src/components/game/PowerUpBar.jsx` | Added doubleDip (🎯 Dip) to powerUpConfig array + onUseDoubleDip prop/handler |
| `src/components/game/QuestionCard.jsx` | Accept doubleDipFirstAnswer prop, pass isDoubleDipWrong to AnswerOption |
| `src/components/game/AnswerOption.jsx` | Handle isDoubleDipWrong: red-tinted disabled state with ✗, line-through, pointer-events-none |
| `src/components/game/AvatarPicker.jsx` | Accept playerLevel prop, show 🔒 overlay with level requirement for locked avatars, grayscale+blur |
| `src/hooks/useAvatar.js` | Guard: fallback to Fox if selected avatar is locked, reject locked avatar selection |
| `src/pages/GameSetupPage.jsx` | Added Game Mode section (Standard/Speed Round toggle), usePerks() for hasSpeedRound, speed round lock overlay, startSpeedRound(), updated summary text |
| `src/pages/GamePlayPage.jsx` | Added useDoubleDip, handleDoubleDip handler, ⚡ Speed Round banner, 🎯 "Try again!" feedback banner, pass doubleDipFirstAnswer to QuestionCard, pass onUseDoubleDip to PowerUpBar |
| `src/pages/SettingsPage.jsx` | Import useXP, pass playerLevel={level} to AvatarPicker |
| `src/pages/ResultsPage.jsx` | Added ⚡ Speed Round badge in results header, 🎯 Double Dip indicator in question review |

## Key Decisions

1. **Level-Perk Bridge**: Pure `getPlayerLevel()` reads localStorage directly — no hook dependency, safe for action payload construction outside the reducer
2. **Power-up counts via payload**: `LOAD_QUESTIONS` accepts `action.payload.powerUps` instead of hardcoding, so level-adjusted counts flow in from `getPerkAdjustedPowerUps()`
3. **Double Dip intermediate state**: `DOUBLE_DIP_FIRST_WRONG` keeps status as `'playing'` (timer continues), only stores the wrong answer. Second pick goes through normal `SELECT_ANSWER`
4. **Speed Round as game mode**: Uses `gameMode: 'speed'` (alongside 'standard' and 'daily'), overrides timePerQuestion in SET_CONFIG, applies 2x multiplier in SELECT_ANSWER
5. **Locked Avatars**: 3 premium avatars gated by level. Selection guard in useAvatar prevents locked avatar use even if localStorage is manipulated
6. **XP restored to 8500**: After testing at various levels, XP was set to 8500 (Level 6 Master) for the user

## Power-Ups (5 total now)
| Power-Up | Icon | Count | Description |
|----------|------|-------|-------------|
| 50/50 | ✂️ | 1 (2 at Lv3+) | Remove 2 wrong answers |
| Double Dip | 🎯 | 0 (1 at Lv5+) | Two attempts, 50% points |
| Skip | ⏭️ | 1 | Skip question without penalty |
| Extra Time | ⏱️ | 1 | Add 10 seconds |
| Category Hint | 💡 | 1 | Reveal answer length + first letter |

## localStorage State
- `trivia_xp`: `{ totalXP: 8500 }` (Level 6 Master)
- `trivia_stats`: `{ gamesPlayed: 24, questionsAnswered: 210 }`
- `trivia_seen_questions`: Per-category question hashes (repeat prevention)

## Next Steps

Potential features to work on next:
- **Perk unlock notifications**: Show a toast/modal when leveling up unlocks a new perk
- **Endless Mode (Lv 6)**: Play until 3 wrong answers, no question limit
- **Streak Shield (Lv 3)**: Protect answer streak once per game
- **Hard Mode Bonus (Lv 3)**: Extra XP multiplier for Hard difficulty
- **Score Multiplier (Lv 4+)**: Permanent scaling score bonus per level
- **Confetti Styles (Lv 5+)**: Unlock different celebration effects
- **UI polish**: Perk unlock progress display on home page, perk descriptions in settings

## How to Resume

```
Read SESSION_CONTEXT.md and resume where we left off. The app has 8 pages, 18 categories, 5 power-ups, and 4 level-based perks (Extra 50/50, Double Dip, Speed Round, Locked Avatars) all verified working. Show me the current state and suggest what to work on next.
```

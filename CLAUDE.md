# Trivia App — Claude Code Instructions

## Session Management

When asked to save progress or summarize context, create a `SESSION_CONTEXT.md` file in the project root with: current state, next steps, key decisions made, and file structure overview. Always include enough detail to resume work in a new session without re-explaining.

## Tech Stack & Conventions

This project uses React 19, Vite 8, Tailwind CSS 4, Framer Motion, and React Router 7. Do not introduce additional frameworks or build tools unless explicitly asked. For standalone prototypes or quick tools outside the main app, keep everything in single HTML files with inline JS and CSS.

## Important Rules

Do not reference Claude Code commands or skills (like /stats) unless you are certain they exist. If unsure, say so. Use `/cost` for token usage inquiries.

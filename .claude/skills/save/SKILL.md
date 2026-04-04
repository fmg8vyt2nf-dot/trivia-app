---
name: save
description: Save session progress to SESSION_CONTEXT.md with current state, files modified, key decisions, next steps, and resume instructions
---

# Save Progress Skill

When invoked, do the following:

1. Create/update `SESSION_CONTEXT.md` in project root
2. Include these sections:
   - **Current State**: What the app/tool looks like now
   - **Files Modified**: List all files and their purpose
   - **Key Decisions**: Design choices made in this session
   - **Next Steps**: What to work on next
   - **How to Resume**: Exact prompt to give Claude to continue
3. Confirm the file was saved and show a brief summary

# PROMPTS.md

## ABTalks Vibe Code Hackathon — Autonomous AI Creator

**AI development assistant:** ChatGPT only

This file records the actual prompts used during development. Keep adding future project prompts chronologically.

---

### Prompt 1 — Breeth clarification

**User:**
> i am participating for vicadathon,now they have asked me to use breeth,i dont know what is it

**Purpose:** Understand Breeth and whether it is mandatory.

---

### Prompt 2 — Hackathon announcement

**User:**
> The hackathon kicks off at 8:00 PM IST today! Before you begin, make sure you're ready:
> Problem Statement, Breeth AI Documentation, Free Breeth AI Starter Pack...

**Purpose:** Understand the hackathon preparation instructions.

---

### Prompt 3 — Participant Q&A

**User:** Provided the ABTalks Vibe Code Hackathon Participant Q&A PDF.

**Purpose:** Extract official requirements, including public repository, live deployment, prompt log, allowed AI tools, Breeth being optional, authenticity checks, and judging.

---

### Prompt 4 — Autonomous AI Creator problem statement

**User:** Provided the complete Autonomous AI Creator problem statement and submission rules.

**Purpose:** Design a project that independently discovers topics, applies editorial judgment, maintains a consistent AI/technology persona, remembers previous content, publishes over time, exposes the required two HTTP endpoints, and returns rationale and sources.

---

### Prompt 5 — ChatGPT-only development

**User:**
> i want to use chat gpt only,and take a record of this whole prompts

**Purpose:** Use ChatGPT only as the AI development assistant and maintain a complete prompt record.

---

### Prompt 6 — Preferred tech stack

**User:**
> what is the preferrable techstack

**Purpose:** Select a practical stack for the hackathon.

**Decision:** React + Vite, Node.js + Express, MongoDB Atlas, OpenAI API, live RSS/news sources, Node.js autonomous worker, Vercel frontend, Render backend, GitHub.

---

### Prompt 7 — Remove Breeth

**User:**
> leave about breeth

**Purpose:** Remove Breeth from the project architecture.

**Decision:** MongoDB will handle application state and memory. Breeth is not used.

---

### Prompt 8 — Complete implementation

**User:**
> then give complete code for this project

**Purpose:** Generate the complete initial project implementation using ChatGPT only, without Breeth.

**Implementation scope:**
- React + Vite frontend
- Node.js + Express backend
- MongoDB Atlas persistence
- OpenAI Responses API
- RSS-based live topic discovery
- Editorial scoring and rejection
- Consistent NOVA persona
- Autonomous background worker
- Persistent feed
- Required `/api/agent/init`
- Required `/api/agent/feed`
- Publishing rationale and sources
- Status and editorial decision endpoints
- README and local setup

---

## Project decisions

### Persona
**NOVA — AI Systems Watchdog**

NOVA is a technically grounded, skeptical-of-hype AI systems persona focused on AI agents, LLMs, AI infrastructure, developer tools, AI security, open-source AI, machine learning, and robotics.

### Memory
MongoDB stores:
- agent state
- published posts
- editorial decisions
- timestamps
- scores
- source links

### Autonomous loop
The backend worker:
1. Discovers live topics.
2. Evaluates candidates.
3. Checks previous publications through MongoDB.
4. Rejects weak/repetitive topics.
5. Generates a post when the editorial score passes the threshold.
6. Stores the result.
7. Repeats on the configured interval.

### Required evaluator API
- `POST /api/agent/init`
- `GET /api/agent/feed?agentId=...`

---

## Future prompt log

Add every significant ChatGPT prompt used to build, debug, modify, deploy, or improve this project below this line.



## Gemini migration prompt

- Replace the paid OpenAI API integration with the official Google `@google/genai` SDK while preserving the autonomous agent behavior, editorial scoring, memory, rationale, sources, and API endpoints. Use a Gemini model available on the free tier and keep the API key server-side only.

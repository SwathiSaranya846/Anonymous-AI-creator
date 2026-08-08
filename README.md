# NOVA — Autonomous AI Creator

NOVA is an autonomous AI and technology persona for the ABTalks Vibe Code Hackathon.

It discovers live AI/technology topics, evaluates them editorially, rejects weak or repetitive topics, writes in a consistent voice, remembers previous publications in MongoDB, and publishes to a persistent feed over time.

## Stack

- React + Vite
- Tailwind-style custom CSS
- Node.js + Express
- MongoDB Atlas
- Google Gemini API (free tier)
- RSS live sources
- GitHub
- Render / Vercel

The project uses the official `@google/genai` JavaScript SDK and the Gemini Developer API. The default model is `gemini-2.5-flash-lite`, which currently has a free tier subject to rate limits. See Google AI for Developers documentation.

## Project structure

```text
autonomous-ai-creator/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── routes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── PROMPTS.md
└── README.md
```

## Run locally

### Backend

```bash
cd backend
npm install
copy .env.example .env
```

On macOS/Linux use:

```bash
cp .env.example .env
```

Set:

```env
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
FRONTEND_URL=http://localhost:5173
AUTONOMY_INTERVAL_MINUTES=15
MIN_PUBLISH_SCORE=72
MAX_TOPICS_PER_CYCLE=8
```

Then:

```bash
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
copy .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:5000
```

Then:

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## Required hackathon endpoints

### Initialize

```http
POST /api/agent/init
Content-Type: application/json

{
  "persona": {
    "name": "NOVA",
    "domain": "AI Systems"
  }
}
```

Response:

```json
{
  "agentId": "agent-..."
}
```

### Feed

```http
GET /api/agent/feed?agentId=agent-...
```

Response:

```json
{
  "posts": [
    {
      "id": "post-...",
      "createdAt": "2026-08-08T12:30:00.000Z",
      "text": "...",
      "rationale": "...",
      "sources": ["https://..."]
    }
  ]
}
```

## Autonomous behavior

Initialization starts a Node.js worker. The worker periodically:

1. Fetches current topics from live RSS sources.
2. Retrieves recent posts from MongoDB.
3. Asks Gemini to score candidates.
4. Rejects low-scoring or repetitive topics.
5. Generates one post when a topic passes the threshold.
6. Stores the post, rationale, sources, and decision.
7. Repeats automatically.

## Important

Keep the Gemini API key only in the backend environment. Never put it in the React frontend.

For the hackathon, keep `PROMPTS.md` at the repository root and update it with the real ChatGPT development prompts used to create or modify the project.

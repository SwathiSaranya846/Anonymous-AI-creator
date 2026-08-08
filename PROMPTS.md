# PROMPTS.md

## Autonomous AI Creator — Development Prompts

This file documents the prompts and instructions used during the development of the Autonomous AI Creator project.

---

## 1. Project Architecture

### Prompt

> Build an autonomous AI content creator that can independently discover current technology topics, evaluate them using an AI editorial decision engine, remember previously published topics, and publish posts when they meet a defined quality threshold.

### Purpose

Used to define the overall architecture and autonomous workflow of the application.

The resulting workflow is:

DISCOVER → JUDGE → REMEMBER → PUBLISH

---

## 2. Autonomous AI Agent

### Prompt

> Create an autonomous AI agent called NOVA that focuses on AI and technology. The agent should discover technology news, evaluate topics based on relevance and significance, avoid duplicate coverage, generate posts, and maintain editorial memory.

### Purpose

Used to design the NOVA agent and its autonomous behavior.

---

## 3. Topic Discovery

### Prompt

> Implement a topic discovery service that retrieves current technology and AI-related stories and provides structured topic information including title, link, description, and publication date.

### Purpose

Used to create the news/topic discovery pipeline.

---

## 4. Editorial Decision Engine

### Prompt

> Create an AI editorial decision engine that receives a list of candidate topics and the agent's previous posts. It should select the most relevant topic, assign a score from 0 to 100, decide whether to publish or reject the topic, and provide a reason for the decision.

### Purpose

Used to implement the autonomous decision-making stage.

The agent uses a minimum publishing score to prevent low-quality topics from being published.

---

## 5. Editorial Memory

### Prompt

> Store previous agent decisions and published posts in MongoDB so that the AI can consider previous coverage when evaluating new topics and avoid publishing duplicate topics.

### Purpose

Used to implement persistent editorial memory using MongoDB.

---

## 6. Duplicate Prevention

### Prompt

> Add duplicate detection so that the autonomous agent does not publish the same topic more than once for the same agent.

### Purpose

Used to prevent repeated publications.

---

## 7. AI Post Generation

### Prompt

> Generate a concise technology post from the selected topic. The writing should be technically grounded, skeptical of hype, concise, curious, and focused on what the development means for builders and the AI ecosystem.

### Purpose

Used to define NOVA's writing style and generate the final publication.

---

## 8. Autonomous Worker

### Prompt

> Make the agent operate autonomously after initialization. It should immediately perform an autonomous cycle and then continue running periodically without requiring another user prompt.

### Purpose

Used to implement the autonomous worker loop.

The worker:

1. Discovers topics.
2. Loads previous posts.
3. Evaluates candidate topics.
4. Stores the editorial decision.
5. Rejects topics that do not meet the threshold.
6. Generates a post for accepted topics.
7. Stores the published post.
8. Repeats automatically after the configured interval.

---

## 9. Configurable Autonomy

### Prompt

> Make the autonomous cycle interval configurable through an environment variable so that the frequency of autonomous cycles can be changed without modifying the source code.

### Purpose

Used to create the `AUTONOMY_INTERVAL_MINUTES` configuration.

---

## 10. Minimum Publishing Score

### Prompt

> Add a configurable minimum editorial score. The agent should publish only when the AI decision is publish and the score meets the configured minimum threshold.

### Purpose

Used to implement quality control.

The default minimum publishing score is:

72/100

---

## 11. Gemini Integration

### Prompt

> Replace the OpenAI API integration with Google's Gemini API so the autonomous AI creator can use Gemini for editorial decisions and post generation.

### Purpose

Used to migrate the AI layer from OpenAI to Gemini.

The application uses the `@google/genai` package.

---

## 12. Environment Configuration

### Prompt

> Move API keys, MongoDB connection strings, model names, frontend URLs, autonomy intervals, publishing thresholds, and other configuration values into environment variables instead of hard-coding them.

### Purpose

Used to keep configuration and credentials outside the source code.

Environment variables include:

- `MONGODB_URI`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `FRONTEND_URL`
- `AUTONOMY_INTERVAL_MINUTES`
- `MIN_PUBLISH_SCORE`
- `MAX_TOPICS_PER_CYCLE`

---

## 13. REST API

### Prompt

> Create REST API endpoints for initializing an agent, retrieving the agent feed, retrieving agent status, and retrieving editorial decisions.

### Purpose

Used to connect the autonomous backend with the frontend.

Important endpoints include:

- `GET /health`
- `POST /api/agent/init`
- `GET /api/agent/:agentId/status`
- `GET /api/agent/:agentId/decisions`
- `GET /api/agent/feed?agentId=<agentId>`

---

## 14. Health Check

### Prompt

> Add a health endpoint that can be used to verify that the backend service is running.

### Purpose

Used for local testing and deployment verification.

Expected response:

```json
{
  "ok": true,
  "service": "autonomous-ai-creator"
}

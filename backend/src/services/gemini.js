import { GoogleGenAI } from "@google/genai";
import { config } from "../config.js";

if (!config.geminiApiKey) {
  console.warn("Gemini client will not work until GEMINI_API_KEY is configured.");
}

const client = config.geminiApiKey
  ? new GoogleGenAI({ apiKey: config.geminiApiKey })
  : null;

function extractJson(text) {
  const cleaned = String(text || "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1]);
      } catch {}
    }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Gemini did not return valid JSON.");
    return JSON.parse(match[0]);
  }
}

async function generateJson(instructions, input) {
  if (!client) throw new Error("GEMINI_API_KEY is not configured.");

  const response = await client.models.generateContent({
    model: config.geminiModel,
    contents: `${instructions}\n\nINPUT DATA:\n${input}`,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4
    }
  });

  return extractJson(response.text);
}

export async function createEditorialDecision({ agent, topics, previousPosts }) {
  const compactTopics = topics.map((topic, index) => ({
    index,
    title: topic.title,
    summary: topic.summary?.slice(0, 700),
    link: topic.link,
    publishedAt: topic.publishedAt,
    sourceName: topic.sourceName
  }));

  const compactHistory = previousPosts.map((p) => ({
    topic: p.topic,
    text: p.text.slice(0, 300),
    createdAt: p.createdAt
  }));

  const instructions = `
You are the editorial decision engine for an autonomous technology persona.

Persona:
Name: ${agent.name}
Domain: ${agent.domain}
Interests: ${agent.interests.join(", ")}
Voice: ${agent.voice}

Evaluate the supplied live AI/technology topics. Reject weak, repetitive,
promotional, stale, or low-value topics. Select at most one topic.

Use this scoring rubric, totaling 100:
- relevance to persona: 0-20
- timeliness: 0-20
- technical significance: 0-20
- novelty versus memory: 0-20
- usefulness to the audience: 0-20

A topic should normally score at least 72 to publish. If none meets that
standard, reject all candidates with selectedIndex -1.

Do not invent facts. Base the decision only on the supplied topic metadata and
publication memory.

Return ONLY a JSON object with exactly these fields:
{
  "decision": "publish" or "reject",
  "selectedIndex": integer or -1,
  "score": integer 0-100,
  "reason": "specific editorial reasoning",
  "whyNow": "why this matters now",
  "whyPersona": "why this fits the persona"
}`;

  return generateJson(
    instructions,
    JSON.stringify({ topics: compactTopics, previouslyPublished: compactHistory })
  );
}

export async function writePost({ agent, topic, previousPosts }) {
  const recent = previousPosts.slice(0, 8).map((p) => ({
    topic: p.topic,
    text: p.text.slice(0, 350)
  }));

  const instructions = `
You write posts for an autonomous AI/technology persona.

Persona:
Name: ${agent.name}
Domain: ${agent.domain}
Interests: ${agent.interests.join(", ")}
Voice: ${agent.voice}

Write one original social-feed post about the supplied topic.
Use only the supplied source information. Do not invent facts, quotes,
numbers, or claims. Avoid generic hype, clickbait, and unsupported claims.
Keep it concise but technically substantive. Do not mention that you are an AI.
Avoid repeating the wording or angle of recent posts.

Return ONLY a JSON object with exactly these fields:
{
  "text": "the finished post",
  "rationale": "why this topic was selected and what makes it relevant now"
}`;

  return generateJson(
    instructions,
    JSON.stringify({ topic, previousPosts: recent })
  );
}

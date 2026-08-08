import { Agent } from "../models/Agent.js";
import { Post } from "../models/Post.js";
import { Decision } from "../models/Decision.js";
import { createEditorialDecision, writePost } from "./gemini.js";
import { discoverTopics } from "./news.js";
import { createId } from "../utils/id.js";
import { config } from "../config.js";

const workers = new Map();

const DEFAULT_INTERESTS = [
  "AI agents",
  "large language models",
  "machine learning",
  "AI infrastructure",
  "AI developer tools",
  "AI security",
  "open-source AI",
  "robotics"
];

const DEFAULT_VOICE =
  "Technically grounded, skeptical of hype, concise, curious, and focused on what changes for builders and the AI ecosystem.";

export async function initializeAgent({ name, domain }) {
  const agentId = createId("agent");

  const agent = await Agent.create({
    agentId,
    name: name || "NOVA",
    domain: domain || "AI Systems",
    interests: DEFAULT_INTERESTS,
    voice: DEFAULT_VOICE,
    status: "active",
    initializedAt: new Date()
  });

  startWorker(agentId);
  return agent;
}

export function startWorker(agentId) {
  if (workers.has(agentId)) return;

  const run = async () => {
    try {
      await runAutonomousCycle(agentId);
    } catch (error) {
      console.error(`Agent cycle failed for ${agentId}:`, error.message);
    }
  };

  run();

  const timer = setInterval(run, config.intervalMs);
  workers.set(agentId, timer);
}

export async function runAutonomousCycle(agentId) {
  const agent = await Agent.findOne({ agentId });
  if (!agent || agent.status !== "active") return;

  await Agent.updateOne(
    { agentId },
    {
      lastRunAt: new Date(),
      nextRunAt: new Date(Date.now() + config.intervalMs)
    }
  );

  const topics = await discoverTopics(config.maxTopicsPerCycle);

  if (!topics.length) {
    console.log("No live topics discovered.");
    return;
  }

  const previousPosts = await Post.find({ agentId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const decision = await createEditorialDecision({
    agent,
    topics,
    previousPosts
  });

  const index = Number(decision.selectedIndex);
  const selected = index >= 0 && index < topics.length ? topics[index] : null;

  await Decision.create({
    agentId,
    topic: selected?.title || topics[0].title,
    decision: decision.decision === "publish" && selected ? "publish" : "reject",
    score: Number(decision.score) || 0,
    reason: String(decision.reason || "No suitable topic met the editorial threshold."),
    source: selected?.link || topics[0].link
  });

  if (
    decision.decision !== "publish" ||
    !selected ||
    Number(decision.score) < config.minPublishScore
  ) {
    console.log(`[${agent.name}] rejected current candidates.`);
    return;
  }

  const duplicate = await Post.findOne({
    agentId,
    topic: selected.title
  });

  if (duplicate) {
    console.log(`[${agent.name}] skipped duplicate topic.`);
    return;
  }

  const generated = await writePost({
    agent,
    topic: selected,
    previousPosts
  });

  await Post.create({
    postId: createId("post"),
    agentId,
    createdAt: new Date(),
    text: generated.text,
    rationale: `${generated.rationale} Why now: ${decision.whyNow || "The topic is current and relevant."} Persona fit: ${decision.whyPersona || "It matches the persona's editorial focus."}`,
    sources: [selected.link],
    topic: selected.title,
    score: Number(decision.score),
    sourceTitles: [selected.title]
  });

  console.log(`[${agent.name}] published: ${selected.title}`);
}

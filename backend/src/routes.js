import express from "express";
import { Agent } from "./models/Agent.js";
import { Post } from "./models/Post.js";
import { Decision } from "./models/Decision.js";
import { initializeAgent, startWorker } from "./services/agent.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "autonomous-ai-creator" });
});

router.post("/api/agent/init", async (req, res) => {
  try {
    const { persona } = req.body || {};

    if (!persona || typeof persona !== "object") {
      return res.status(400).json({
        error: "persona is required"
      });
    }

    const agent = await initializeAgent({
      name: persona.name,
      domain: persona.domain
    });

    return res.status(201).json({
      agentId: agent.agentId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Agent initialization failed." });
  }
});

router.get("/api/agent/feed", async (req, res) => {
  try {
    const { agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ error: "agentId is required" });
    }

    const agent = await Agent.findOne({ agentId }).lean();

    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    const posts = await Post.find({ agentId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      posts: posts.map((post) => ({
        id: post.postId,
        createdAt: new Date(post.createdAt).toISOString(),
        text: post.text,
        rationale: post.rationale,
        sources: post.sources
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not retrieve feed." });
  }
});

router.get("/api/agent/:agentId/status", async (req, res) => {
  const agent = await Agent.findOne({ agentId: req.params.agentId }).lean();
  if (!agent) return res.status(404).json({ error: "Agent not found." });

  const [postCount, rejectedCount] = await Promise.all([
    Post.countDocuments({ agentId: agent.agentId }),
    Decision.countDocuments({ agentId: agent.agentId, decision: "reject" })
  ]);

  res.json({
    agent: {
      id: agent.agentId,
      name: agent.name,
      domain: agent.domain,
      status: agent.status,
      initializedAt: agent.initializedAt,
      lastRunAt: agent.lastRunAt,
      nextRunAt: agent.nextRunAt
    },
    stats: {
      published: postCount,
      rejected: rejectedCount
    }
  });
});

router.get("/api/agent/:agentId/decisions", async (req, res) => {
  const decisions = await Decision.find({ agentId: req.params.agentId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json({
    decisions: decisions.map((d) => ({
      topic: d.topic,
      decision: d.decision,
      score: d.score,
      reason: d.reason,
      source: d.source,
      createdAt: new Date(d.createdAt).toISOString()
    }))
  });
});

export default router;

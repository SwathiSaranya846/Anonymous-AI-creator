import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  intervalMs: Math.max(5, Number(process.env.AUTONOMY_INTERVAL_MINUTES || 15)) * 60 * 1000,
  minPublishScore: Number(process.env.MIN_PUBLISH_SCORE || 72),
  maxTopicsPerCycle: Number(process.env.MAX_TOPICS_PER_CYCLE || 8)
};

if (!config.mongodbUri) {
  console.warn("MONGODB_URI is not set.");
}
if (!config.geminiApiKey) {
  console.warn("GEMINI_API_KEY is not set.");
}

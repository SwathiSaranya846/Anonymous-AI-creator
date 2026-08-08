import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    agentId: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true },
    domain: { type: String, required: true },
    interests: { type: [String], default: [] },
    voice: { type: String, default: "" },
    initializedAt: { type: Date, default: Date.now },
    lastRunAt: { type: Date, default: null },
    nextRunAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "stopped"], default: "active" }
  },
  { timestamps: true }
);

export const Agent = mongoose.model("Agent", agentSchema);

import mongoose from "mongoose";

const decisionSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    decision: { type: String, enum: ["publish", "reject"], required: true },
    score: { type: Number, required: true },
    reason: { type: String, required: true },
    source: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Decision = mongoose.model("Decision", decisionSchema);

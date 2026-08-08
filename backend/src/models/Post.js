import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postId: { type: String, unique: true, required: true, index: true },
    agentId: { type: String, required: true, index: true },
    createdAt: { type: Date, required: true, default: Date.now, index: true },
    text: { type: String, required: true },
    rationale: { type: String, required: true },
    sources: { type: [String], default: [] },
    topic: { type: String, required: true },
    score: { type: Number, required: true },
    sourceTitles: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);

import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: String,
    githubUrl: String,
    username: String,

    githubData: {
      type: Object,
      default: null,
    },

    analysis: {
      score: Number,
      verdict: String,
      matchLevel: String,

      strengths: [String],
      gaps: [String],

      skillMatch: {
        frontend: Number,
        backend: Number,
        database: Number,
        problemSolving: Number,
        consistency: Number,
      },

      summary: String,
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    requirements: [String],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    candidates: [candidateSchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export { Project };
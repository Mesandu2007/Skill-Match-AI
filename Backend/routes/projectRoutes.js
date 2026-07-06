import express from "express";

import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectById,
} from "../controllers/projectController.js";

import { runAnalysis } from "../controllers/analysisController.js";

import { protect as authMiddleware } from "../middleware/authMiddleware.js";


import candidateRoutes from "./candidateRoutes.js";

const router = express.Router();

router.post("/run-analysis", authMiddleware, runAnalysis);

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getProjectById);

router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);

router.use("/:projectId/candidate", candidateRoutes);

export default router;
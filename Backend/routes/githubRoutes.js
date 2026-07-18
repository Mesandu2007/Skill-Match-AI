import express from "express";
import {
  previewGitHub,
  analyzeGitHubOnly,
} from "../controllers/githubController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/preview", protect, previewGitHub);
router.post("/analyze", protect, analyzeGitHubOnly);

export default router;
import express from "express";
import {
  addCandidate,
  addCandidatesBulk,
  getCandidates,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import { protect as authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.route("/").post(addCandidate).get(getCandidates);

router.route("/bulk").post(addCandidatesBulk);

router.route("/:candidateId").put(updateCandidate).delete(deleteCandidate);

export default router;
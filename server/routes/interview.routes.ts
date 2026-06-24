import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  generateQuestions,
  gradeAnswers,
} from "../controllers/interview.controller.js";

const router = Router();

// POST /api/interview/generate
router.post("/generate", authenticate, generateQuestions);

// POST /api/interview/grade
router.post("/grade", authenticate, gradeAnswers);

export default router;


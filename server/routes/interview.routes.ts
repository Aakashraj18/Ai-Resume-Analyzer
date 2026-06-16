import { Router } from "express";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { generatePersonalizedQuestions, gradeInterviewAnswers } from "../services/gemini.js";

const router = Router();

// POST /api/interview/generate
router.post("/generate", authenticate, async (req: AuthRequest, res) => {
  try {
    const { companyName, jobTitle, resumeText } = req.body;

    if (!companyName || !jobTitle || !resumeText) {
      res.status(400).json({ error: "companyName, jobTitle, and resumeText are required." });
      return;
    }

    const questions = await generatePersonalizedQuestions(companyName, jobTitle, resumeText);
    res.json({ questions });
  } catch (error: any) {
    console.error("Generate questions error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate interview questions.",
    });
  }
});

// POST /api/interview/grade
router.post("/grade", authenticate, async (req: AuthRequest, res) => {
  try {
    const { companyName, jobTitle, qaPairs } = req.body;

    if (!companyName || !jobTitle || !Array.isArray(qaPairs)) {
      res.status(400).json({ error: "companyName, jobTitle, and qaPairs (array) are required." });
      return;
    }

    const gradedAnswers = await gradeInterviewAnswers(companyName, jobTitle, qaPairs);
    res.json({ results: gradedAnswers });
  } catch (error: any) {
    console.error("Grade answers error:", error);
    res.status(500).json({
      error: error.message || "Failed to grade answers.",
    });
  }
});

export default router;

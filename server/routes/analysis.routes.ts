import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/analysis.controller.js";

const router = Router();

// POST /api/analyses — Run AI analysis
router.post("/", authenticate, createAnalysis);

// GET /api/analyses — List all analyses for current user
router.get("/", authenticate, getAnalyses);

// GET /api/analyses/:id — Get single analysis
router.get("/:id", authenticate, getAnalysisById);

// DELETE /api/analyses/:id — Delete analysis + GridFS file
router.delete("/:id", authenticate, deleteAnalysis);

export default router;

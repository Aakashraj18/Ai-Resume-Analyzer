import { Router } from "express";
import mongoose from "mongoose";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { Analysis } from "../models/Analysis.js";
import { getGridFSBucket } from "../config/db.js";
import { analyzeResume } from "../services/gemini.js";

const router = Router();

// POST /api/analyses — Run AI analysis
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { companyName, jobTitle, jobDescription, resumeText, fileId, fileName } =
      req.body;

    if (!companyName || !jobTitle || !jobDescription || !resumeText || !fileId) {
      res
        .status(400)
        .json({ error: "All fields are required (companyName, jobTitle, jobDescription, resumeText, fileId)." });
      return;
    }

    // Call Gemini AI with 45s timeout
    const result = await analyzeResume(resumeText, jobTitle, jobDescription);

    // Save to database
    const analysis = await Analysis.create({
      userId: req.user!.id,
      companyName,
      jobTitle,
      jobDescription,
      resumeText,
      pdfFileId: new mongoose.mongo.ObjectId(fileId as string),
      pdfFileName: fileName || "resume.pdf",
      result,
    });

    res.status(201).json({
      id: analysis._id,
      companyName: analysis.companyName,
      jobTitle: analysis.jobTitle,
      result: analysis.result,
      createdAt: analysis.createdAt,
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: error.message || "Analysis failed. Please try again.",
    });
  }
});

// GET /api/analyses — List all analyses for current user
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user!.id })
      .select("companyName jobTitle result.atsScore createdAt pdfFileId")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ analyses });
  } catch (error) {
    console.error("List analyses error:", error);
    res.status(500).json({ error: "Failed to load analyses." });
  }
});

// GET /api/analyses/:id — Get single analysis
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    }).lean();

    if (!analysis) {
      res.status(404).json({ error: "Analysis not found." });
      return;
    }

    res.json({ analysis });
  } catch (error) {
    console.error("Get analysis error:", error);
    res.status(500).json({ error: "Failed to load analysis." });
  }
});

// DELETE /api/analyses/:id — Delete analysis + GridFS file
router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!analysis) {
      res.status(404).json({ error: "Analysis not found." });
      return;
    }

    // Delete GridFS file
    try {
      const bucket = getGridFSBucket();
      await bucket.delete(analysis.pdfFileId);
    } catch {
      // File might already be deleted — continue
      console.warn("GridFS file not found, continuing delete.");
    }

    await Analysis.deleteOne({ _id: analysis._id });
    res.json({ message: "Analysis deleted successfully." });
  } catch (error) {
    console.error("Delete analysis error:", error);
    res.status(500).json({ error: "Failed to delete analysis." });
  }
});

export default router;

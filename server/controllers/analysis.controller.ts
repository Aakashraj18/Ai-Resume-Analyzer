import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { Analysis } from "../models/Analysis.js";
import cloudinary from "../config/cloudinary.js";
import { analyzeResume } from "../services/gemini.js";

export const createAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
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
      pdfFileId: fileId as string,
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
};

export const getAnalyses = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const getAnalysisById = async (req: AuthRequest, res: Response): Promise<void> => {
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
};

export const deleteAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user!.id,
    });

    if (!analysis) {
      res.status(404).json({ error: "Analysis not found." });
      return;
    }

    // Delete Cloudinary file
    try {
      await cloudinary.uploader.destroy(analysis.pdfFileId, { resource_type: "raw" });
    } catch {
      console.warn("Cloudinary file not found or deletion failed, continuing delete.");
    }

    await Analysis.deleteOne({ _id: analysis._id });
    res.json({ message: "Analysis deleted successfully." });
  } catch (error) {
    console.error("Delete analysis error:", error);
    res.status(500).json({ error: "Failed to delete analysis." });
  }
};


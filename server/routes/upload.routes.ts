import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { getGridFSBucket } from "../config/db.js";

const router = Router();

// Multer stores file in memory so we can pipe to GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

// POST /api/upload — Upload PDF to GridFS
router.post(
  "/",
  authenticate,
  upload.single("pdf"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No PDF file provided." });
        return;
      }

      const bucket = getGridFSBucket();
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        metadata: { userId: req.user!.id, contentType: "application/pdf" },
      });

      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", () => {
        res.status(201).json({
          fileId: uploadStream.id.toString(),
          fileName: req.file!.originalname,
          size: req.file!.size,
        });
      });

      uploadStream.on("error", (error: any) => {
        console.error("GridFS upload error:", error);
        res.status(500).json({ error: "Failed to upload file." });
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  }
);

// GET /api/upload/:id — Stream PDF from GridFS
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const fileId = new mongoose.mongo.ObjectId(req.params.id as string);
    const bucket = getGridFSBucket();

    // Check file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (files.length === 0) {
      res.status(404).json({ error: "File not found." });
      return;
    }

    res.set("Content-Type", "application/pdf");
    res.set(
      "Content-Disposition",
      `inline; filename="${files[0].filename}"`
    );

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(500).json({ error: "Failed to download file." });
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file." });
  }
});

export default router;

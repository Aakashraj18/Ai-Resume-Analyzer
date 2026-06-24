import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import { uploadPdf, streamPdf } from "../controllers/upload.controller.js";

const router = Router();

// Multer stores file in memory
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

// POST /api/upload — Upload PDF to Cloudinary
router.post("/", authenticate, upload.single("pdf"), uploadPdf);

// GET /api/upload/:folder/:id — Stream/Redirect PDF from Cloudinary
router.get("/:folder/:id", authenticate, streamPdf);

export default router;


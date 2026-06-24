import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import type { UploadApiResponse } from "cloudinary";

// Helper: wraps Cloudinary's callback-based upload_stream in a Promise
function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "ats_genius_resumes",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

export const uploadPdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No PDF file provided." });
      return;
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(201).json({
      fileId: result.public_id,
      fileName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary." });
  }
};

export const streamPdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fileId = `${req.params.folder}/${req.params.id}`;

    // Cloudinary can serve raw files via their CDN. 
    // We generate the URL and redirect the client to download it.
    const url = cloudinary.url(fileId, { resource_type: "raw", secure: true });

    res.redirect(url);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file." });
  }
};

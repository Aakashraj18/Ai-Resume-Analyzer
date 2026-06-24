import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const uploadPdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No PDF file provided." });
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // Needed for non-image/video files like PDF
        folder: "ats_genius_resumes",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          res.status(500).json({ error: "Failed to upload file to Cloudinary." });
          return;
        }

        res.status(201).json({
          fileId: result!.public_id,
          fileName: req.file!.originalname,
          size: req.file!.size,
        });
      }
    );

    Readable.from(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file." });
  }
};

export const streamPdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fileId = req.params.id;
    
    // Cloudinary can serve raw files via their CDN. 
    // We generate the URL and redirect the client to download it.
    const url = cloudinary.url(fileId, { resource_type: "raw", secure: true });
    
    res.redirect(url);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file." });
  }
};

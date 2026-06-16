import mongoose, { Schema, type Document } from "mongoose";

export interface IATSResult {
  atsScore: number;
  matchSummary: string;
  missingKeywords: string[];
  formattingFeedback: string;
  actionableTips: string[];
  hrQuestions?: string[];
  rewrittenBullets?: { original: string; improved: string }[];
}

export interface IAnalysis extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  pdfFileId: mongoose.Types.ObjectId;
  pdfFileName: string;
  result: IATSResult;
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resumeText: {
      type: String,
      required: true,
    },
    pdfFileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    pdfFileName: {
      type: String,
      required: true,
    },
    result: {
      atsScore: { type: Number, required: true, min: 0, max: 100 },
      matchSummary: { type: String, required: true },
      missingKeywords: [{ type: String }],
      formattingFeedback: { type: String, required: true },
      actionableTips: [{ type: String }],
      hrQuestions: [{ type: String }],
      rewrittenBullets: [
        {
          original: { type: String },
          improved: { type: String },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Analysis = mongoose.model<IAnalysis>("Analysis", analysisSchema);

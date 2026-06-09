import { GoogleGenAI } from "@google/genai";
import type { IATSResult } from "../models/Analysis.js";

let genAI: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst and career coach.
Your job is to compare a candidate's resume text against a specific job description and provide a detailed ATS compatibility analysis.

You MUST return ONLY a valid JSON object — no markdown, no backticks, no extra text.
The first character of your response must be { and the last must be }.

Return this exact JSON structure:
{
  "atsScore": <number 0-100>,
  "matchSummary": "<2-3 sentence summary of how well the resume matches the job>",
  "missingKeywords": ["<keyword1>", "<keyword2>", ...],
  "formattingFeedback": "<1-2 sentences about resume formatting for ATS>",
  "actionableTips": ["<tip1>", "<tip2>", "<tip3>", ...]
}

Scoring guidelines:
- 90-100: Excellent match, strong keyword alignment, great formatting
- 70-89: Good match, some missing keywords or minor formatting issues
- 50-69: Moderate match, several important keywords missing
- 30-49: Weak match, significant gaps between resume and job requirements
- 0-29: Poor match, resume needs major revision for this role

Be honest, specific, and actionable. Reference actual keywords from the job description.`;

export async function analyzeResume(
  resumeText: string,
  jobTitle: string,
  jobDescription: string
): Promise<IATSResult> {
  const client = getClient();

  const userPrompt = `RESUME TEXT:
---
${resumeText.slice(0, 15000)}
---

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
---
${jobDescription.slice(0, 5000)}
---

Analyze this resume against the job description and return the JSON result.`;

  // Race the AI call against a 45-second timeout
  const aiPromise = client.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("AI analysis timed out after 45 seconds.")),
      45_000
    )
  );

  const response = await Promise.race([aiPromise, timeoutPromise]);

  // Extract text from response
  let text = response.text ?? "";

  // Strip markdown code fences if AI wraps response despite instructions
  text = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  // Parse and validate
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      "AI returned invalid JSON. Please try again."
    );
  }

  // Validate required fields
  if (
    typeof parsed.atsScore !== "number" ||
    typeof parsed.matchSummary !== "string" ||
    !Array.isArray(parsed.missingKeywords) ||
    typeof parsed.formattingFeedback !== "string" ||
    !Array.isArray(parsed.actionableTips)
  ) {
    throw new Error(
      "AI response missing required fields. Please try again."
    );
  }

  return {
    atsScore: Math.min(100, Math.max(0, Math.round(parsed.atsScore))),
    matchSummary: parsed.matchSummary,
    missingKeywords: parsed.missingKeywords.map(String),
    formattingFeedback: parsed.formattingFeedback,
    actionableTips: parsed.actionableTips.map(String),
  };
}

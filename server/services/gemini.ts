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
Your job is to compare a candidate's resume text against a specific job description and provide a detailed, HONEST ATS compatibility analysis.

You MUST return ONLY a valid JSON object — no markdown, no backticks, no extra text.
The first character of your response must be { and the last must be }.

Return this exact JSON structure:
{
  "subScores": {
    "keywordMatch": <number 0-100>,
    "quantitativeImpact": <number 0-100>,
    "formatting": <number 0-100>,
    "experienceRelevance": <number 0-100>,
    "skillsCoverage": <number 0-100>
  },
  "matchSummary": "<2-3 sentence summary of how well the resume matches the job>",
  "missingKeywords": ["<keyword1>", "<keyword2>", ...],
  "formattingFeedback": "<1-2 sentences about resume formatting for ATS>",
  "actionableTips": ["<tip1>", "<tip2>", "<tip3>", ...],
  "hrQuestions": [
    { "question": "<interview question>", "answer": "<model answer the candidate should give>" }
  ],
  "rewrittenBullets": [
    { "original": "<weak resume bullet>", "improved": "<STAR-method rewritten bullet with metrics if possible>" }
  ]
}

SUB-SCORE RUBRIC (be strict and honest — do NOT inflate):

1. keywordMatch (0-100): What percentage of the important keywords/phrases from the JD appear in the resume?
   - Count the critical hard skills, tools, technologies, and domain terms in the JD.
   - Calculate how many the resume explicitly mentions.
   - If the resume has < 30% of JD keywords → score 0-30. 50% → 40-55. 70% → 60-75. 90%+ → 80-100.

2. quantitativeImpact (0-100): Does the resume use numbers, percentages, and measurable results?
   - 0-20: Zero or almost no metrics/numbers anywhere in the resume.
   - 21-50: 1-2 vague metrics, most bullet points lack quantification.
   - 51-75: Some bullet points have numbers but many are still vague.
   - 76-100: Most bullet points include specific metrics (%, $, counts, time saved, etc.).

3. formatting (0-100): How ATS-friendly is the formatting?
   - Check for: standard section headers, single-column layout, no tables/graphics, consistent date formats, proper use of bullet points.
   - Penalize heavily for non-standard sections, walls of text, or mixed formatting.

4. experienceRelevance (0-100): How directly relevant is the candidate's experience to this specific role?
   - Consider job title alignment, industry match, seniority level match.
   - A backend engineer applying for a frontend role should score low here.

5. skillsCoverage (0-100): What percentage of the required/preferred skills from the JD does the resume demonstrate?
   - Count required skills vs demonstrated skills. Be literal.

CRITICAL RULES:
- If there are MORE than 5 missing keywords, keywordMatch CANNOT be above 60.
- If there are MORE than 8 missing keywords, keywordMatch CANNOT be above 40.
- If NO quantifiable metrics exist in the resume, quantitativeImpact MUST be below 25.
- Be HARSH. Real ATS systems are harsh. An average resume with gaps should score 45-65, not 75-90.

Provide 10-12 tailored HR and technical interview questions in 'hrQuestions'. Each must include a 'question' and a detailed 'answer' that demonstrates the ideal response (using STAR method for behavioral questions). Base questions on gaps between the resume and JD. Rewrite 2-3 weak bullets in 'rewrittenBullets'.`;

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
      temperature: 0.2,
      maxOutputTokens: 4096,
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
    !parsed.subScores ||
    typeof parsed.subScores.keywordMatch !== "number" ||
    typeof parsed.subScores.quantitativeImpact !== "number" ||
    typeof parsed.subScores.formatting !== "number" ||
    typeof parsed.subScores.experienceRelevance !== "number" ||
    typeof parsed.subScores.skillsCoverage !== "number" ||
    typeof parsed.matchSummary !== "string" ||
    !Array.isArray(parsed.missingKeywords) ||
    typeof parsed.formattingFeedback !== "string" ||
    !Array.isArray(parsed.actionableTips)
  ) {
    throw new Error(
      "AI response missing required fields. Please try again."
    );
  }

  // Clamp all sub-scores to 0-100
  const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
  const sub = {
    keywordMatch: clamp(parsed.subScores.keywordMatch),
    quantitativeImpact: clamp(parsed.subScores.quantitativeImpact),
    formatting: clamp(parsed.subScores.formatting),
    experienceRelevance: clamp(parsed.subScores.experienceRelevance),
    skillsCoverage: clamp(parsed.subScores.skillsCoverage),
  };

  // --- SERVER-SIDE SCORE CALCULATION (weighted formula) ---
  // Weights: keywords 30%, skills 25%, experience 20%, quantitative 15%, formatting 10%
  const rawScore =
    sub.keywordMatch * 0.30 +
    sub.skillsCoverage * 0.25 +
    sub.experienceRelevance * 0.20 +
    sub.quantitativeImpact * 0.15 +
    sub.formatting * 0.10;

  // Apply penalty based on number of missing keywords
  const missingCount = parsed.missingKeywords.length;
  let penalty = 0;
  if (missingCount >= 10) penalty = 15;
  else if (missingCount >= 7) penalty = 10;
  else if (missingCount >= 4) penalty = 5;

  const finalScore = clamp(Math.round(rawScore - penalty));

  return {
    atsScore: finalScore,
    matchSummary: parsed.matchSummary,
    missingKeywords: parsed.missingKeywords.map(String),
    formattingFeedback: parsed.formattingFeedback,
    actionableTips: parsed.actionableTips.map(String),
    hrQuestions: Array.isArray(parsed.hrQuestions)
      ? parsed.hrQuestions.map((q: any) => ({
          question: String(q?.question || q || ""),
          answer: String(q?.answer || ""),
        }))
      : [],
    rewrittenBullets: Array.isArray(parsed.rewrittenBullets) 
      ? parsed.rewrittenBullets.map((b: any) => ({
          original: String(b?.original || ""),
          improved: String(b?.improved || "")
        }))
      : [],
  };
}



export async function generateInterviewQuestions(
  company: string,
  role: string
): Promise<string[]> {
  const client = getClient();
  const prompt = `You are an expert technical recruiter and HR manager.
Generate exactly 5 highly relevant interview questions (a mix of behavioral, cultural, and role-specific/technical) for a candidate applying for the position of "${role}" at "${company}".

You MUST return ONLY a valid JSON array of strings — no markdown, no backticks, no extra text.
The first character of your response must be [ and the last must be ].
Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`;

  const response = await client.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: { temperature: 0.7, maxOutputTokens: 1024 },
  });

  let text = response.text ?? "[]";
  text = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
    return parsed.map(String);
  } catch {
    throw new Error("Failed to parse interview questions from AI.");
  }
}

export interface IGradedAnswer {
  score: number;
  feedback: string;
  strengths: string;
  weaknesses: string;
}

export async function gradeInterviewAnswers(
  company: string,
  role: string,
  qaPairs: { question: string; answer: string }[]
): Promise<IGradedAnswer[]> {
  const client = getClient();
  
  const formattedPairs = qaPairs.map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join("\n\n");
  
  const prompt = `You are an expert technical recruiter and HR manager.
Evaluate the candidate's answers to the following interview questions for the role of "${role}" at "${company}".

CANDIDATE ANSWERS:
${formattedPairs}

You MUST return ONLY a valid JSON array of objects — no markdown, no backticks, no extra text.
The array must have exactly the same number of elements as the number of questions.
Each object must match this structure:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentences of overall feedback>",
  "strengths": "<1-2 sentences highlighting what they did well>",
  "weaknesses": "<1-2 sentences highlighting what they missed or could improve>"
}`;

  const response = await client.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: { temperature: 0.3, maxOutputTokens: 2048 },
  });

  let text = response.text ?? "[]";
  text = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("Not an array");
    return parsed.map((item: any) => ({
      score: Number(item.score) || 0,
      feedback: String(item.feedback || ""),
      strengths: String(item.strengths || ""),
      weaknesses: String(item.weaknesses || ""),
    }));
  } catch {
    throw new Error("Failed to parse grading results from AI.");
  }
}

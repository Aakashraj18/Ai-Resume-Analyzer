import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import LoadingSpinner, { type LoadingStep } from "~/components/LoadingSpinner";
import AtsGuidelines from "~/components/AtsGuidelines";
import { apiFetch } from "~/lib/api";
import { extractTextFromPdf } from "~/lib/pdfExtractor";

export function meta() {
  return [
    { title: "ATS Genius | Upload Resume" },
    { name: "description", content: "Upload your resume for AI analysis." },
  ];
}

const INITIAL_STEPS: LoadingStep[] = [
  { id: "extract", label: "Extracting text from PDF...", status: "pending" },
  { id: "upload", label: "Uploading file securely...", status: "pending" },
  { id: "analyze", label: "Running Gemini AI analysis...", status: "pending" },
  { id: "done", label: "Analysis complete! Redirecting...", status: "pending" },
];

export default function Upload() {
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<LoadingStep[]>(INITIAL_STEPS);
  const [currentStepId, setCurrentStepId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const updateStep = (id: string, status: "pending" | "active" | "done") => {
    setCurrentStepId(id);
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, status } : step
      )
    );
  };

  const completeStep = (id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, status: "done" } : step
      )
    );
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF resume to upload.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSteps(INITIAL_STEPS);

    try {
      // Step 1: Extract Text locally
      updateStep("extract", "active");
      const resumeText = await extractTextFromPdf(file);
      completeStep("extract");

      if (!resumeText.trim()) {
        throw new Error("No text could be extracted from this PDF. Please ensure it is a text-based PDF, not an image scan.");
      }

      // Step 2: Upload PDF
      updateStep("upload", "active");
      const formData = new FormData();
      formData.append("pdf", file);
      
      const uploadRes = await apiFetch<{ fileId: string; fileName: string }>("/upload", {
        method: "POST",
        body: formData,
      });
      completeStep("upload");

      // Step 3: Run AI Analysis
      updateStep("analyze", "active");
      const analysisRes = await apiFetch<{ id: string }>("/analyses", {
        method: "POST",
        body: JSON.stringify({
          companyName,
          jobTitle,
          jobDescription,
          resumeText,
          fileId: uploadRes.fileId,
          fileName: uploadRes.fileName,
        }),
      });
      completeStep("analyze");

      // Step 4: Done
      updateStep("done", "active");
      completeStep("done");
      
      // Navigate to results
      setTimeout(() => {
        navigate(`/resume/${analysisRes.id}`);
      }, 1000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 page-container flex flex-col w-full max-w-4xl">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl mb-4">Analyze Your Resume</h1>
          <p className="text-lg text-slate-400">Provide the job details to see how well you match.</p>
        </div>

        {isProcessing ? (
          <div className="my-auto animate-fade-in-up">
            <LoadingSpinner steps={steps} currentStepId={currentStepId} />
          </div>
        ) : (
          <form 
            onSubmit={handleAnalyze} 
            className="glass-card p-6 md:p-8 flex flex-col gap-8 animate-fade-in-up w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="companyName">Target Company</label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Stripe, Local Startup"
                />
              </div>

              <div className="form-group">
                <label htmlFor="jobTitle">Job Title</label>
                <input
                  id="jobTitle"
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                required
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
              />
            </div>

            <div className="form-group">
              <label>Resume (PDF)</label>
              <FileUploader onFileSelect={setFile} />
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                <svg className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-rose-400 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || !companyName || !jobTitle || !jobDescription}
              className="primary-button text-lg py-4 w-full"
            >
              Start Analysis
            </button>
          </form>
        )}

        <AtsGuidelines />
      </main>
    </div>
  );
}

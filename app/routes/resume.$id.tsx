import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ATSResultCard from "~/components/ATSResultCard";
import { apiFetch } from "~/lib/api";

interface AnalysisDetail {
  _id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  pdfFileId: string;
  createdAt: string;
  result: {
    atsScore: number;
    matchSummary: string;
    missingKeywords: string[];
    formattingFeedback: string;
    actionableTips: string[];
  };
}

export function meta() {
  return [
    { title: "ATS Genius | Analysis Result" },
  ];
}

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchAnalysis = async () => {
      try {
        const data = await apiFetch<{ analysis: AnalysisDetail }>(`/analyses/${id}`);
        setAnalysis(data.analysis);
      } catch (err: any) {
        setError(err.message || "Failed to load analysis details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this analysis? The PDF will also be permanently deleted.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiFetch(`/analyses/${id}`, { method: "DELETE" });
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to delete analysis.");
      setIsDeleting(false);
    }
  };

  // Use a token-authenticated URL for the iframe if needed, or pass the token via cookie.
  // For simplicity in this protected app, we'll fetch the PDF blob and create an object URL.
  // This ensures the Authorization header is sent.
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (!analysis) return;
    
    let objectUrl = "";
    
    const fetchPdf = async () => {
      try {
        const token = localStorage.getItem("ats-genius-token");
        const res = await fetch(`/api/upload/${analysis.pdfFileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const blob = await res.blob();
          const pdfBlob = new Blob([blob], { type: "application/pdf" });
          objectUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(objectUrl);
        }
      } catch (err) {
        console.error("Failed to load PDF iframe", err);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Not Found</h2>
          <p className="text-slate-400 mb-6">{error || "This analysis may have been deleted."}</p>
          <Link to="/dashboard" className="primary-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 page-container flex flex-col lg:flex-row gap-8 w-full max-w-[1600px] py-4 lg:py-8">
        
        {/* Left Column: PDF Viewer */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          <div className="glass-card h-[600px] lg:h-[calc(100vh-140px)] sticky top-[88px] overflow-hidden rounded-2xl flex flex-col">
            <div className="p-4 border-b border-white/5 bg-slate-900/50">
              <h3 className="font-semibold text-white truncate">{analysis.companyName}</h3>
              <p className="text-sm text-slate-400 truncate">{analysis.jobTitle}</p>
            </div>
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full flex-1 bg-white"
                title="Resume PDF"
              />
            ) : (
              <div className="w-full flex-1 flex flex-col items-center justify-center bg-slate-900/20">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 text-sm">Loading PDF...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Results */}
        <div className="w-full lg:w-2/3 flex flex-col animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl mb-2">Analysis Results</h1>
            <p className="text-slate-400">Detailed ATS compatibility breakdown and feedback.</p>
          </div>
          
          <ATSResultCard result={analysis.result} />
        </div>
      </main>
    </div>
  );
}

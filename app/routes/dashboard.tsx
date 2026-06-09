import { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import ScoreRing from "~/components/ScoreRing";
import { apiFetch } from "~/lib/api";
import { formatDate } from "~/lib/utils";

interface AnalysisSummary {
  _id: string;
  companyName: string;
  jobTitle: string;
  pdfFileId: string;
  createdAt: string;
  result: {
    atsScore: number;
  };
}

export function meta() {
  return [
    { title: "ATS Genius | Dashboard" },
  ];
}

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await apiFetch<{ analyses: AnalysisSummary[] }>("/analyses");
        setAnalyses(data.analyses);
      } catch (err: any) {
        setError(err.message || "Failed to load your analyses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 page-container flex flex-col w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl mb-2">Dashboard</h1>
            <p className="text-slate-400">Track your resume applications and ATS scores.</p>
          </div>
          <Link to="/upload" className="primary-button">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-rose-400 font-medium">{error}</p>
            </div>
            <button onClick={() => window.location.reload()} className="text-sm font-medium text-rose-300 hover:text-white">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 h-48 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 w-1/2">
                    <div className="h-6 w-3/4 skeleton" />
                    <div className="h-4 w-1/2 skeleton" />
                  </div>
                  <div className="w-16 h-16 rounded-full skeleton" />
                </div>
                <div className="h-10 w-full skeleton mt-4" />
              </div>
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-fade-in-up mt-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No analyses yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              Upload your first resume and job description to get a detailed ATS compatibility score.
            </p>
            <Link to="/upload" className="primary-button">
              Start Your First Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {analyses.map((analysis, index) => (
              <Link 
                key={analysis._id} 
                to={`/resume/${analysis._id}`}
                className="glass-card-hover p-6 animate-fade-in-up group flex flex-col h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {analysis.companyName}
                    </h3>
                    <p className="text-slate-400 text-sm truncate mt-1">
                      {analysis.jobTitle}
                    </p>
                    <p className="text-slate-500 text-xs mt-3 font-medium">
                      {formatDate(analysis.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <ScoreRing score={analysis.result.atsScore} size={70} strokeWidth={6} />
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm font-medium">
                  <span className="text-slate-400 group-hover:text-emerald-400 transition-colors">View Details</span>
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

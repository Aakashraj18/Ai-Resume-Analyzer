import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import { useAuth } from "~/lib/auth";

export function meta() {
  return [
    { title: "ATS Genius | Smart Resume Analyzer" },
    { name: "description", content: "Optimize your resume for Applicant Tracking Systems using AI." },
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center page-container relative z-10">
        <div className="text-center max-w-4xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Powered by Gemini AI
          </div>
          
          <h1 className="mb-6">
            Beat the bots.<br />
            Land your <span className="text-gradient">dream job.</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and a job description. Our AI analyzes your fit,
            identifies missing keywords, and gives you actionable feedback to get
            past the Applicant Tracking System.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/upload" className="primary-button text-lg px-8 py-4 w-full sm:w-auto">
                Analyze Resume Now
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="primary-button text-lg px-8 py-4 w-full sm:w-auto">
                  Get Started for Free
                </Link>
                <Link to="/auth?tab=login" className="secondary-button text-lg px-8 py-4 w-full sm:w-auto">
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Scoring</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get an immediate ATS compatibility score based on how well your resume matches the target job description.
            </p>
          </div>

          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Keyword Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identify exactly which critical keywords and skills you're missing from the job description to optimize your resume.
            </p>
          </div>

          <div className="glass-card p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Actionable Tips</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive specific, actionable feedback on formatting, structure, and content to improve your chances of landing an interview.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

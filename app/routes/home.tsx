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

        {/* ATS Educational Section */}
        <div className="mt-32 max-w-5xl w-full animate-fade-in-up flex flex-col gap-16 pb-24 z-10" style={{ animationDelay: "0.3s" }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why ATS Optimization Matters</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Over 90% of large companies use an Applicant Tracking System (ATS) to filter resumes. 
              If your resume isn't optimized, human eyes might never see it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">How do I make sure my resume is ATS-compliant?</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Stick to standard section headers (Experience, Education, Skills), use a simple, single-column layout, and avoid complex formatting like tables, images, or text boxes that confuse parsers. Our analyzer checks these strict structural requirements automatically.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Readable by ATS & Human Scanners</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                An ATS doesn't "read" a resume; it parses text into a database. We ensure your bullet points use standard fonts and predictable formatting so both the software and the recruiter see exactly what you intend to show.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">The Importance of Resume Keywords</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Recruiters search their ATS databases for specific hard skills, tool names, and industry jargon. We extract exactly what keywords the job description requires and cross-reference them with your resume to identify critical gaps.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Unlimited ATS Resume Scans</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Tailoring your resume for each application shouldn't cost you extra. Enjoy unlimited resume and job description pairings, allowing you to perfect your match score for every single job you apply to.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

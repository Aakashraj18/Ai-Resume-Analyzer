import ScoreRing from "./ScoreRing";

interface ATSResult {
  atsScore: number;
  matchSummary: string;
  missingKeywords: string[];
  formattingFeedback: string;
  actionableTips: string[];
  hrQuestions?: string[];
  rewrittenBullets?: { original: string; improved: string }[];
}

export default function ATSResultCard({ result }: { result: ATSResult }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Section: Score & Summary */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="shrink-0">
          <ScoreRing score={result.atsScore} size={160} strokeWidth={12} />
        </div>
        <div className="flex flex-col gap-3 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">Overall ATS Match</h2>
          <p className="text-slate-300 leading-relaxed">
            {result.matchSummary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Missing Keywords */}
          <div className="glass-card p-6 flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Missing Keywords</h3>
            </div>
            
            {result.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {result.missingKeywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/5 text-slate-300 text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm mt-2">
                Great job! You have included all major keywords from the job description.
              </p>
            )}
          </div>

          {/* Formatting Feedback */}
          <div className="glass-card p-6 flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Formatting</h3>
            </div>
            <p className="text-slate-300 mt-2 leading-relaxed">
              {result.formattingFeedback}
            </p>
          </div>
        </div>

        {/* Right Column: Actionable Tips */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Actionable Tips</h3>
          </div>
          
          <ul className="flex flex-col gap-4 mt-2">
            {result.actionableTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-800/40 border border-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Bullet Point Enhancer */}
      {result.rewrittenBullets && result.rewrittenBullets.length > 0 && (
        <div className="glass-card p-6 flex flex-col gap-6 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">AI Bullet Point Enhancer</h3>
          </div>
          <p className="text-slate-400 text-sm">We rewrote some of your weak bullet points using the STAR method and quantitative metrics to increase your ATS score.</p>
          
          <div className="flex flex-col gap-4">
            {result.rewrittenBullets.map((bullet, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Original</span>
                  <p className="text-slate-300 text-sm italic">"{bullet.original}"</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Improved</span>
                  <p className="text-slate-200 text-sm font-medium">"{bullet.improved}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HR Interview Portal */}
      {result.hrQuestions && result.hrQuestions.length > 0 && (
        <div className="glass-card p-6 flex flex-col gap-6 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Interview Preparation</h3>
          </div>
          <p className="text-slate-400 text-sm">Based on the gap between your resume and the job description, prepare for these tailored HR and technical questions.</p>
          
          <ul className="flex flex-col gap-3">
            {result.hrQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-800/40 border border-white/5 rounded-xl p-4 transition-all hover:bg-slate-800/60">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                <span className="text-slate-200 text-sm leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

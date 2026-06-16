export default function AtsGuidelines() {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col gap-6 animate-fade-in-up mt-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white">ATS Best Practices</h2>
        <p className="text-slate-400 mt-2">How to ensure your resume passes the automated scan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Readable Templates</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Avoid complex multi-column layouts, tables, and charts. ATS bots parse text linearly. Stick to standard, single-column formats.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Exact Keywords</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Use the exact phrasing from the job description. If they ask for "React.js", don't just write "React". Contextual matching is limited.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Quantitative Impact</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Don't just list responsibilities. Show your impact with numbers. Mention scale, team size, budget, or percentage improvements.
          </p>
        </div>
      </div>
    </div>
  );
}

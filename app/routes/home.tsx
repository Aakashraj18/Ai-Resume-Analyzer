import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import { useAuth } from "~/lib/auth";
import { useTheme } from "~/lib/theme";

export function meta() {
  return [
    { title: "ATS Genius | Smart Resume Analyzer" },
    { name: "description", content: "Optimize your resume for Applicant Tracking Systems using AI." },
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-slate-950 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="text-center max-w-4xl animate-fade-in-up relative z-10">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full animate-fade-in-up relative z-10" style={{ animationDelay: "0.2s" }}>
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
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="w-full border-y border-white/5 bg-white/[0.02] py-16 px-4 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">90%+</div>
            <p className="text-slate-500 text-sm">Fortune 500 companies use ATS</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">75%</div>
            <p className="text-slate-500 text-sm">Resumes rejected before a human sees them</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">5 min</div>
            <p className="text-slate-500 text-sm">Average time to optimize your resume</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">∞</div>
            <p className="text-slate-500 text-sm">Unlimited free scans, no paywall</p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">Optimize Your Resume in 3 Simple Steps</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Our AI-powered pipeline extracts, analyzes, and scores your resume against any job description in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-indigo-500/30"></div>

            <div className="flex flex-col items-center text-center px-6 relative">
              <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative z-10">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Step 1</span>
              <h3 className="text-xl font-bold text-white mb-3">Upload Your Resume</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Upload your PDF resume along with the company name, job title, and full job description you're targeting.</p>
            </div>

            <div className="flex flex-col items-center text-center px-6 relative mt-8 md:mt-0">
              <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 relative z-10">
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Step 2</span>
              <h3 className="text-xl font-bold text-white mb-3">AI Analyzes Everything</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Gemini AI scans your resume against the JD, evaluating keyword match, skills coverage, quantitative metrics, formatting, and experience relevance.</p>
            </div>

            <div className="flex flex-col items-center text-center px-6 relative mt-8 md:mt-0">
              <div className="w-24 h-24 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 relative z-10">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Step 3</span>
              <h3 className="text-xl font-bold text-white mb-3">Get Your Score & Tips</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Receive a detailed breakdown: ATS score, missing keywords, formatting fixes, rewritten bullet points, and 10+ interview prep questions with answers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW WE CALCULATE YOUR SCORE ─── */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Transparent Scoring</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">How We Calculate Your ATS Score</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg">Unlike other tools that give you a random number, our score is computed using a <strong className="text-white">weighted, multi-factor formula</strong> — the same criteria real ATS systems use to rank candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { label: "Keyword Match", weight: "30%", color: "emerald", desc: "How many important keywords from the job description appear in your resume — hard skills, tools, technologies, and industry terms.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { label: "Skills Coverage", weight: "25%", color: "cyan", desc: "What percentage of the required and preferred skills listed in the JD does your resume explicitly demonstrate?", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Experience Relevance", weight: "20%", color: "indigo", desc: "Is your job title, industry, and seniority aligned with the role? A backend engineer applying for a frontend role will score lower.", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { label: "Quantitative Impact", weight: "15%", color: "purple", desc: "Does your resume use hard numbers? Percentages, dollar amounts, team sizes, and time saved are what make bullet points powerful.", icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" },
              { label: "Formatting", weight: "10%", color: "amber", desc: "Standard section headers, single-column layout, no tables or images, consistent date formats — the basics that ATS parsers need.", icon: "M4 6h16M4 12h16M4 18h7" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-6 flex flex-col items-center text-center gap-3 group hover:bg-white/[0.08] transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center`}>
                  <svg className={`w-6 h-6 text-${item.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div className={`text-2xl font-bold text-${item.color}-400`}>{item.weight}</div>
                <h3 className="text-sm font-bold text-white">{item.label}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 mt-8 text-center">
            <p className="text-slate-400 text-sm">
              <strong className="text-white">Final Score</strong> = (Keyword × 0.30) + (Skills × 0.25) + (Experience × 0.20) + (Quantitative × 0.15) + (Formatting × 0.10) — <span className="text-rose-400">Penalty for missing keywords</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── ATS COMPLIANCE DEEP DIVE ─── */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">ATS Deep Dive</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">Everything You Need to Know About ATS</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg">Applicant Tracking Systems are the gatekeepers of modern hiring. Understanding how they work is the first step to getting past them.</p>
          </div>

          {/* Alternating Full-Width Sections */}
          <div className="flex flex-col gap-16">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider w-fit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  ATS Compliance
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">How Do I Make Sure My Resume Is ATS-Compliant?</h3>
                <p className="text-slate-400 leading-relaxed">
                  An ATS-compliant resume follows strict structural rules. Use <strong className="text-slate-200">standard section headers</strong> like "Experience", "Education", and "Skills" — creative labels like "My Journey" confuse parsers. Stick to a <strong className="text-slate-200">single-column layout</strong> and avoid tables, text boxes, headers/footers, and embedded images. Use a common font (Arial, Calibri, Times New Roman) and save as PDF or .docx.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Our analyzer automatically checks for these structural issues and flags anything that could cause parsing errors, so you can fix problems before you hit submit.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-80">
                <div className="glass-card p-6 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">ATS Compliance Checklist</h4>
                  {["Standard section headers", "Single-column layout", "No tables or text boxes", "No images or graphics", "Standard fonts (10-12pt)", "Consistent date formats", "PDF or .docx format", "No headers / footers"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-slate-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="flex-1 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider w-fit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Readability
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Readable by ATS & Resume Scanners</h3>
                <p className="text-slate-400 leading-relaxed">
                  An ATS doesn't "read" your resume the way a person does — it <strong className="text-slate-200">parses raw text into structured data fields</strong> in a database. If your formatting confuses the parser, your work experience might end up in the education field, or your skills might be completely lost.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  That's why <strong className="text-slate-200">simplicity wins</strong>. Clean bullet points, chronological order, and predictable formatting ensure both the ATS software and the human recruiter see exactly what you intend. Our tool simulates this parsing process and shows you what the ATS actually "sees."
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-80">
                <div className="glass-card p-6 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">What ATS Sees vs. What You See</h4>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">❌ Bad Format</span>
                    <p className="text-slate-400 text-xs mt-1 font-mono">Name: [EMPTY] | Skills: "Managed a team" | Education: "Python, React"</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✓ Good Format</span>
                    <p className="text-slate-400 text-xs mt-1 font-mono">Name: "John Doe" | Skills: "Python, React" | Experience: "Managed a team of 8"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider w-fit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                  Keywords
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">The Importance of Resume Keywords</h3>
                <p className="text-slate-400 leading-relaxed">
                  When a recruiter searches their ATS database, they type in <strong className="text-slate-200">specific keywords</strong> — tool names ("Figma"), frameworks ("React"), certifications ("PMP"), and methodologies ("Agile"). If those exact terms aren't in your resume, <strong className="text-slate-200">you won't appear in the search results</strong>. Period.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  But keyword stuffing doesn't work either — modern systems detect it. The key is to <strong className="text-slate-200">naturally weave JD-specific terms</strong> into your bullet points. Our analyzer cross-references every keyword in the job description against your resume and shows you exactly what's missing so you can add them organically.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-80">
                <div className="glass-card p-6 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Keyword Strategy</h4>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { do: true, text: "Use exact terms from the JD" },
                      { do: true, text: "Include both acronyms & full names" },
                      { do: true, text: "Mirror the JD's language naturally" },
                      { do: false, text: "Don't stuff keywords in white text" },
                      { do: false, text: "Don't list skills you don't have" },
                      { do: false, text: "Don't use synonyms the ATS won't match" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {item.do ? (
                          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                        <span className="text-slate-400 text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="flex-1 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider w-fit">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Metrics
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Quantitative Impact: The Secret Weapon</h3>
                <p className="text-slate-400 leading-relaxed">
                  Vague bullet points like "Improved team performance" tell recruiters nothing. But <strong className="text-slate-200">"Increased team output by 35% over 6 months by implementing daily standups and sprint retrospectives"</strong> shows real, measurable impact.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Our scoring engine gives <strong className="text-slate-200">15% weight to quantitative metrics</strong>. If your resume lacks numbers — percentages, dollar values, team sizes, time saved — your score will drop significantly. Our AI Bullet Point Enhancer even rewrites your weak bullets with suggested metrics using the STAR method.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-80">
                <div className="glass-card p-6 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Before → After</h4>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                    <span className="text-xs font-bold text-rose-400">Weak</span>
                    <p className="text-slate-400 text-xs mt-1 italic">"Helped improve company revenue"</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <span className="text-xs font-bold text-emerald-400">Strong</span>
                    <p className="text-slate-300 text-xs mt-1">"Drove $2.4M in new revenue by redesigning the onboarding funnel, increasing conversion by 18%"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── UNLIMITED SCANS ─── */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Unlimited ATS Resume Scans</h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-4">
            You shouldn't have to pay every time you tailor your resume for a new job. With ATS Genius, every scan is <strong className="text-white">completely free</strong> — upload as many resume + job description combos as you want.
          </p>
          <p className="text-slate-500 text-sm">No credit card. No paywall. No limits.</p>
        </div>
      </section>

      {/* ─── HR PREP PORTAL CTA ─── */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto glass-card p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium w-fit mx-auto md:mx-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              New Feature
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Interactive HR Prep Portal</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Don't just fix your resume — ace the interview. Enter any company and job role to instantly generate tailored HR and technical questions. Practice your answers in real-time and get them graded by our AI.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/hr-portal" className="primary-button text-lg px-8 py-5 flex items-center gap-3 group bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 border-none shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <span>Try the HR Portal</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full border-t border-white/5 bg-slate-950">
        {/* Top Footer — Link Columns */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Get Started</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/upload" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">Scan Your Resume</Link></li>
              <li><Link to="/hr-portal" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">Practice Interviews</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">Your Dashboard</Link></li>
              <li><Link to="/auth" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">Create Account</Link></li>
              <li><Link to="/auth?tab=login" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Resume Help</h4>
            <ul className="flex flex-col gap-3">
              <li><span className="text-slate-400 text-sm">ATS Resume Checker</span></li>
              <li><span className="text-slate-400 text-sm">Keyword Optimizer</span></li>
              <li><span className="text-slate-400 text-sm">Bullet Point Enhancer</span></li>
              <li><span className="text-slate-400 text-sm">Resume Formatting Guide</span></li>
              <li><span className="text-slate-400 text-sm">STAR Method Examples</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Interview Prep</h4>
            <ul className="flex flex-col gap-3">
              <li><span className="text-slate-400 text-sm">HR Interview Questions</span></li>
              <li><span className="text-slate-400 text-sm">Technical Questions</span></li>
              <li><span className="text-slate-400 text-sm">Behavioral Questions</span></li>
              <li><span className="text-slate-400 text-sm">Answer Grading AI</span></li>
              <li><span className="text-slate-400 text-sm">Company-Specific Prep</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Resources</h4>
            <ul className="flex flex-col gap-3">
              <li><span className="text-slate-400 text-sm">How ATS Systems Work</span></li>
              <li><span className="text-slate-400 text-sm">Resume Keywords Guide</span></li>
              <li><span className="text-slate-400 text-sm">Quantitative Impact Tips</span></li>
              <li><span className="text-slate-400 text-sm">Job Search Strategies</span></li>
              <li><span className="text-slate-400 text-sm">Career Resources</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer — Copyright */}
        <div className="border-t border-white/5 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-sm font-bold text-gradient">ATS GENIUS</span>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all duration-300 cursor-pointer ml-2"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-slate-600 text-sm">© {new Date().getFullYear()} ATS Genius. Powered by Gemini AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-slate-500 text-sm hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-slate-500 text-sm hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

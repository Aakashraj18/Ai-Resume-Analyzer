import { useState } from "react";
import Navbar from "~/components/Navbar";
import { apiFetch } from "~/lib/api";

export function meta() {
  return [
    { title: "ATS Genius | Practice Interviews" },
    { name: "description", content: "Practice for your upcoming interview with AI." },
  ];
}

export default function HRPortal() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<any[] | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !jobTitle) return;

    setIsGenerating(true);
    setError(null);
    setQuestions([]);
    setAnswers([]);
    setResults(null);

    try {
      const res = await apiFetch<{ questions: string[] }>("/interview/generate", {
        method: "POST",
        body: JSON.stringify({ companyName, jobTitle }),
      });
      setQuestions(res.questions);
      setAnswers(new Array(res.questions.length).fill(""));
    } catch (err: any) {
      setError(err.message || "Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (index: number, val: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = val;
    setAnswers(newAnswers);
  };

  const handleGrade = async () => {
    // Basic validation to ensure at least some answers are provided
    if (answers.every(a => !a.trim())) {
      setError("Please answer at least one question before grading.");
      return;
    }

    setIsGrading(true);
    setError(null);

    try {
      const qaPairs = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || "No answer provided.",
      }));

      const res = await apiFetch<{ results: any[] }>("/interview/grade", {
        method: "POST",
        body: JSON.stringify({ companyName, jobTitle, qaPairs }),
      });
      setResults(res.results);
    } catch (err: any) {
      setError(err.message || "Failed to grade answers. Please try again.");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 page-container flex flex-col w-full max-w-4xl pb-24">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl mb-4 text-gradient">Interactive HR Prep Portal</h1>
          <p className="text-lg text-slate-400">Generate tailored interview questions, practice your answers, and get AI feedback.</p>
        </div>

        {/* Form Phase */}
        {questions.length === 0 && (
          <form 
            onSubmit={handleGenerate} 
            className="glass-card p-6 md:p-8 flex flex-col gap-8 animate-fade-in-up w-full max-w-2xl mx-auto"
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
                  placeholder="e.g. Meta, Stripe"
                  disabled={isGenerating}
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
                  placeholder="e.g. Product Manager"
                  disabled={isGenerating}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-rose-400 font-medium text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !companyName || !jobTitle}
              className="primary-button text-lg py-4 w-full flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Questions...
                </>
              ) : "Generate Questions"}
            </button>
          </form>
        )}

        {/* Questions Phase */}
        {questions.length > 0 && !results && (
          <div className="flex flex-col gap-8 animate-fade-in-up">
            <div className="glass-card p-6 flex flex-col gap-2">
              <h2 className="text-xl font-bold text-white">Interview for {jobTitle} at {companyName}</h2>
              <p className="text-slate-400 text-sm">Type your answers in the text boxes below, then click Grade My Answers when you're ready.</p>
            </div>

            {questions.map((q, i) => (
              <div key={i} className="glass-card p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold mt-1">Q{i + 1}</span>
                  <p className="text-lg text-white font-medium leading-relaxed">{q}</p>
                </div>
                <div className="form-group mt-2">
                  <textarea
                    rows={4}
                    value={answers[i]}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            ))}

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-rose-400 font-medium text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleGrade}
              disabled={isGrading}
              className="primary-button text-lg py-4 w-full md:w-auto md:px-12 mx-auto flex items-center justify-center"
            >
              {isGrading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Grading...
                </>
              ) : "Grade My Answers"}
            </button>
          </div>
        )}

        {/* Results Phase */}
        {results && (
          <div className="flex flex-col gap-8 animate-fade-in-up">
            <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Grading Complete</h2>
                <p className="text-slate-400">Review your feedback below to improve your interview skills.</p>
              </div>
              <button
                onClick={() => {
                  setQuestions([]);
                  setAnswers([]);
                  setResults(null);
                  setCompanyName("");
                  setJobTitle("");
                }}
                className="secondary-button whitespace-nowrap"
              >
                Practice Another Role
              </button>
            </div>

            {results.map((res, i) => (
              <div key={i} className="glass-card flex flex-col overflow-hidden">
                <div className="p-6 bg-slate-800/40 border-b border-white/5 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold mt-1">Q{i + 1}</span>
                    <p className="text-lg text-white font-medium leading-relaxed">{questions[i]}</p>
                  </div>
                  <div className="ml-11">
                    <p className="text-slate-400 text-sm italic">"{answers[i]}"</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Score</span>
                      <div className="flex items-end gap-1">
                        <span className={`text-3xl font-bold ${res.score >= 8 ? 'text-emerald-400' : res.score >= 5 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {res.score}
                        </span>
                        <span className="text-slate-500 mb-1">/10</span>
                      </div>
                    </div>
                    <div className="flex-1 ml-4 border-l border-white/10 pl-6">
                      <p className="text-slate-300 text-sm leading-relaxed">{res.feedback}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Strengths</span>
                      <p className="text-slate-300 text-sm">{res.strengths}</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Areas for Improvement</span>
                      <p className="text-slate-300 text-sm">{res.weaknesses}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

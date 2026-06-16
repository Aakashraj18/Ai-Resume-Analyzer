import { useState, useRef } from "react";
import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import { apiFetch } from "~/lib/api";
import { extractTextFromPdf } from "~/lib/pdfExtractor";

export function meta() {
  return [
    { title: "ATS Genius | Interactive Preparation Portal" },
    { name: "description", content: "Practice for your upcoming interview with AI." },
  ];
}

interface IPersonalizedQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  suggestedAnswer: string;
}

export default function HRPortal() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [questions, setQuestions] = useState<IPersonalizedQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<any[] | null>(null);
  
  const [currentPage, setCurrentPage] = useState(0); // 0 for questions 1-10, 1 for 11-20
  const [showAnswerFor, setShowAnswerFor] = useState<number | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !jobTitle || !resumeFile) return;

    setIsGenerating(true);
    setError(null);
    setQuestions([]);
    setAnswers([]);
    setResults(null);
    setCurrentPage(0);
    setShowAnswerFor(null);

    try {
      const resumeText = await extractTextFromPdf(resumeFile);

      const res = await apiFetch<{ questions: IPersonalizedQuestion[] }>("/interview/generate", {
        method: "POST",
        body: JSON.stringify({ companyName, jobTitle, resumeText }),
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
    if (answers.every(a => !a.trim())) {
      setError("Please answer at least one question before grading.");
      return;
    }

    setIsGrading(true);
    setError(null);

    try {
      const qaPairs = questions.map((q, i) => ({
        question: q.question,
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

  const visibleQuestions = questions.slice(currentPage * 10, (currentPage + 1) * 10);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full px-6 md:px-10 mt-6">
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-colors" title="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      <main className="flex-1 page-container pt-2 flex flex-col w-full max-w-4xl pb-24">
        <div className="relative mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl mb-4 text-white font-bold">Interactive Preparation Portal</h1>
          <p className="text-lg text-slate-400">Upload your resume to generate 20 personalized interview questions based on your experience.</p>
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

            <div className="form-group">
              <label>Upload Resume (PDF)</label>
              <div 
                className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  resumeFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30 bg-slate-800/40'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  required
                />
                {resumeFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-emerald-400 font-medium">{resumeFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-slate-400">Click to browse or drag PDF here</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-rose-400 font-medium text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !companyName || !jobTitle || !resumeFile}
              className="primary-button text-lg py-4 w-full flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Resume & Generating...
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
              <p className="text-slate-400 text-sm">
                Part {currentPage + 1} of 2. Type your answers below. You can view the suggested answer if you get stuck.
              </p>
            </div>

            {visibleQuestions.map((q, localIndex) => {
              const globalIndex = currentPage * 10 + localIndex;
              const isShowingAnswer = showAnswerFor === globalIndex;
              
              return (
                <div key={globalIndex} className="glass-card p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center mt-1 ${
                        q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' : 
                        q.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        Q{globalIndex + 1}
                      </span>
                      <p className="text-lg text-white font-medium leading-relaxed">{q.question}</p>
                    </div>
                    <span className={`text-xs uppercase tracking-wider font-bold px-2 py-1 rounded ${
                      q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' : 
                      q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' : 
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  
                  <div className="form-group mt-2 relative">
                    <textarea
                      rows={4}
                      value={answers[globalIndex]}
                      onChange={(e) => handleAnswerChange(globalIndex, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAnswerFor(isShowingAnswer ? null : globalIndex)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 self-start transition-colors font-medium flex items-center gap-1"
                    >
                      {isShowingAnswer ? "Hide Suggested Answer" : "Show Suggested Answer"}
                    </button>
                    
                    {isShowingAnswer && (
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Ideal Answer Approach</span>
                        <p className="text-slate-300 text-sm leading-relaxed">{q.suggestedAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-rose-400 font-medium text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              {currentPage === 0 ? (
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="primary-button text-lg py-4 px-12 flex items-center justify-center"
                >
                  Next 10 Questions
                </button>
              ) : (
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setCurrentPage(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="secondary-button text-lg py-4 px-8 flex items-center justify-center"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGrade}
                    disabled={isGrading}
                    className="primary-button text-lg py-4 px-12 flex items-center justify-center flex-1 md:flex-none"
                  >
                    {isGrading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Grading...
                      </>
                    ) : "Grade All 20 Answers"}
                  </button>
                </div>
              )}
            </div>
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
                  setResumeFile(null);
                }}
                className="secondary-button whitespace-nowrap"
              >
                Practice Another Role
              </button>
            </div>

            {results.map((res, i) => (
              <div key={i} className="glass-card flex flex-col overflow-hidden">
                <div className="p-6 bg-slate-800/40 border-b border-white/5 flex flex-col gap-4">
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center mt-1 ${
                        questions[i].difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' : 
                        questions[i].difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        Q{i + 1}
                      </span>
                      <p className="text-lg text-white font-medium leading-relaxed">{questions[i].question}</p>
                    </div>
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

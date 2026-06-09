export interface LoadingStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
}

export default function LoadingSpinner({
  steps,
  currentStepId,
}: {
  steps: LoadingStep[];
  currentStepId: string;
}) {
  return (
    <div className="flex flex-col items-center max-w-md w-full mx-auto p-8 glass-card">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse-glow" />
        
        {/* Spinning gradient ring */}
        <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-emerald-400 border-r-indigo-400 animate-spin-slow" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {steps.map((step) => {
          const isActive = step.id === currentStepId;
          const isDone = step.status === "done";
          
          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 transition-all duration-500 ${
                isActive ? "opacity-100 scale-105" : "opacity-50 scale-100"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isDone
                    ? "bg-emerald-500"
                    : isActive
                    ? "bg-indigo-500"
                    : "bg-slate-800"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                ) : (
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-500 ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

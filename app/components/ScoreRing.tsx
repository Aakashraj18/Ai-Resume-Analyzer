import { useMemo } from "react";
import { getScoreRingColor } from "~/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  className = "",
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - score / 100);
  const { stroke, bg } = getScoreRingColor(score);

  // Unique gradient ID per instance
  const gradientId = useMemo(
    () => `score-ring-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.8} />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Glow background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bg}
          strokeWidth={strokeWidth + 4}
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          strokeLinecap="round"
          style={
            {
              "--circumference": circumference,
              "--target-offset": targetOffset,
            } as React.CSSProperties
          }
          className="animate-score-fill"
        />

        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={targetOffset}
          strokeLinecap="round"
          style={
            {
              "--circumference": circumference,
              "--target-offset": targetOffset,
            } as React.CSSProperties
          }
          className="animate-score-fill"
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold tabular-nums"
            style={{ fontSize: size * 0.22, color: stroke }}
          >
            {score}
          </span>
          <span
            className="text-slate-500 font-medium"
            style={{ fontSize: size * 0.1 }}
          >
            / 100
          </span>
        </div>
      )}
    </div>
  );
}

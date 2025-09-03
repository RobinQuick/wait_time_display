import React, { useEffect, useState } from 'react';

interface CountdownRingProps {
  minutes: number;
  className?: string;
}

export default function CountdownRing({ minutes, className = '' }: CountdownRingProps) {
  const [progress, setProgress] = useState(1);
  const totalSeconds = minutes * 60;
  const circumference = 264; // 2 * π * 42

  useEffect(() => {
    if (minutes <= 0) return;

    let remaining = totalSeconds;
    const timer = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      const ratio = remaining / totalSeconds;
      setProgress(ratio);
      
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, totalSeconds]);

  if (minutes > 3 || minutes <= 0) return null;

  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full transform scale-125"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="3"
          strokeDasharray={circumference}
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 linear"
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  );
}
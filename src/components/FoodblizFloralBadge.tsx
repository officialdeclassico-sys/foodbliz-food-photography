import React from 'react';

interface FoodblizFloralBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FoodblizFloralBadge: React.FC<FoodblizFloralBadgeProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'
  }[size];

  const tickSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      aria-label="Payment Verified by Foodbliz"
    >
      {/* Soft Ambient Red Glow behind badge */}
      <div
        className="absolute inset-0 rounded-full bg-[#E50914] blur-xl opacity-35 animate-floral-aura pointer-events-none"
        aria-hidden="true"
      />

      {/* Continuously Blooming Scalloped Floral Rosette Badge */}
      <svg
        viewBox="0 0 100 100"
        className={`${sizeClasses} relative z-10 animate-floral-bloom drop-shadow-md`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="foodblizFloralGrad"
            cx="50%"
            cy="40%"
            r="60%"
            fx="45%"
            fy="35%"
          >
            <stop offset="0%" stopColor="#ff1e27" />
            <stop offset="65%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#b30009" />
          </radialGradient>
          <filter id="badgeShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#900" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 16-Lobe Scalloped Floral Rosette Badge */}
        <path
          d="M 92.00 50.00 Q 97.08 59.36 88.80 66.07 Q 89.91 76.67 79.70 79.70 Q 76.67 89.91 66.07 88.80 Q 59.36 97.08 50.00 92.00 Q 40.64 97.08 33.93 88.80 Q 23.33 89.91 20.30 79.70 Q 10.09 76.67 11.20 66.07 Q 2.92 59.36 8.00 50.00 Q 2.92 40.64 11.20 33.93 Q 10.09 23.33 20.30 20.30 Q 23.33 10.09 33.93 11.20 Q 40.64 2.92 50.00 8.00 Q 59.36 2.92 66.07 11.20 Q 76.67 10.09 79.70 20.30 Q 89.91 23.33 88.80 33.93 Q 97.08 40.64 92.00 50.00 Z"
          fill="url(#foodblizFloralGrad)"
          stroke="#ff4a52"
          strokeWidth="1.2"
          filter="url(#badgeShadow)"
        />

        {/* Inner subtle concentric highlight ring */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      </svg>

      {/* Clean White Tick Mark in the Center */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 24 24"
          className={`${tickSize} text-white fill-none stroke-white`}
          style={{ strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
};

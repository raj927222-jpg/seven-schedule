import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', isDark = false, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Clean Mindly-Style Modernist Glyph */}
      <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center shadow-xs overflow-hidden shrink-0 transition-transform duration-300 hover:scale-105 ${
        isDark ? 'bg-white text-black' : 'bg-[#111111] text-white'
      }`}>
        <svg
          viewBox="0 0 32 32"
          className="w-4 h-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 7H26V11L14 25H8L18 13H6V7Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-heading font-extrabold text-sm sm:text-base tracking-[0.16em] uppercase transition-colors ${
            isDark ? 'text-white' : 'text-[#111111]'
          }`}
        >
          SEVEN SCHEDULE
        </span>
      )}
    </div>
  );
};

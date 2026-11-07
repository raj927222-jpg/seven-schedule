import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ChevronDown } from 'lucide-react';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreWork }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Smooth trigger on mount for cinematic ease-in
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-[#FAF9F5]"
    >
      {/* Soft breathing ambient light: hardware-accelerated pure CSS floating glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[500px] bg-gradient-to-b from-[#E2EDE2]/60 via-[#F3ECE0]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-0 animate-pulse duration-[8000ms]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Step 1: Top Freelancer Duo Badge with ultra-smooth soft glide */}
        <div
          className={`text-center mb-6 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            mounted ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-neutral-200/90 shadow-2xs text-xs font-mono font-medium text-neutral-700 transition-colors duration-300 hover:border-emerald-600/40">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.6)]" />
            <span>Freelance Duo · Raj & Vaibhav</span>
            <span className="text-neutral-300">|</span>
            <span>Surat, Gujarat · Est. 2026</span>
          </div>
        </div>

        {/* Step 2: Masked Typography Reveal: Smooth upward emergence */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] text-[#111111] tracking-tight leading-[1.08] mb-6">
            <span className="block overflow-hidden py-1">
              <span
                className={`block transition-all duration-1000 delay-150 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                Web experiences.
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span
                className={`block transition-all duration-1000 delay-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                Motion that moves.
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span
                className={`block italic font-normal text-neutral-800 transition-all duration-1000 delay-450 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                Design that connects.
              </span>
            </span>
          </h1>

          {/* Step 3: Subtitle paragraph with gentle fade-up */}
          <p
            className={`text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal mb-8 transition-all duration-1000 delay-600 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            We are two independent freelancers — <strong className="text-[#111111] font-semibold">Raj</strong> and <strong className="text-[#111111] font-semibold">Vaibhav</strong>. No agency overhead, no account managers, and no middlemen. You work directly with us to build high-converting websites, produce cinematic motion graphics, and design memorable brand identities.
          </p>

          {/* Step 4: Action Buttons with gentle ease */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 delay-750 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <button
              onClick={onStartProject}
              className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-xs sm:text-sm font-semibold bg-[#111111] hover:bg-neutral-800 text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95 group"
            >
              <span>Work With Us</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300 ease-out" />
            </button>

            <button
              onClick={onExploreWork}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-xs sm:text-sm font-medium bg-white/90 hover:bg-white text-neutral-800 border border-neutral-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer active:scale-95 group"
            >
              <span>Explore Selected Works</span>
              <ArrowDown className="w-4 h-4 text-neutral-500 group-hover:text-[#111111] transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Step 5: Founder Direct Access Pill Bar with silky smooth reveal */}
        <div
          className={`max-w-3xl mx-auto p-4 sm:px-6 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/90 shadow-xs hover:shadow-sm transition-all duration-1000 delay-900 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col md:flex-row items-center justify-between gap-4 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                R
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-700 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                V
              </div>
            </div>
            <div className="text-left text-xs">
              <span className="font-semibold text-[#111111] block">Direct Freelancer Collaboration</span>
              <span className="text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                Raj (+91 9725917116) · Vaibhav (+91 7016451067)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_6px_rgba(5,150,105,0.5)]" />
            <span>Available for Freelance Projects</span>
          </div>
        </div>

        {/* Subtle scroll indicator cue */}
        <div
          onClick={onExploreWork}
          className={`mt-14 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-neutral-400 hover:text-neutral-700 transition-all duration-1000 delay-1050 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Scroll to discover</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-neutral-400" />
        </div>

      </div>
    </section>
  );
};

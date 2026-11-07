import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, MessageCircle, FileText, Cpu, CheckCircle } from 'lucide-react';

export const Workflow: React.FC = () => {
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Typewriter effect state for Section Header title & paragraph
  const fullTitle = 'FROM IDEA TO EXECUTION.';
  const fullDesc = 'A lean, transparent five-step process designed for rapid turnaround, zero ambiguity, and high craft.';
  const totalUnits = fullTitle.length + fullDesc.length;

  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedDesc, setDisplayedDesc] = useState('');
  const charFloatRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const updateProgress = () => {
      const vh = window.innerHeight || 800;
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      // 1. Scroll-scrubbed typing & untyping for title and paragraph
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        
        if (rect.top > vh * 0.85) {
          charFloatRef.current = 0;
          setDisplayedTitle('');
          setDisplayedDesc('');
        } else if (rect.bottom < -40) {
          charFloatRef.current = totalUnits;
          setDisplayedTitle(fullTitle);
          setDisplayedDesc(fullDesc);
        } else {
          // Responsive brisk typing pace for title + description
          const pixelsPerUnit = 3.2;

          if (scrollDelta > 0) {
            charFloatRef.current = Math.min(
              totalUnits,
              charFloatRef.current + scrollDelta / pixelsPerUnit
            );
          } else if (scrollDelta < 0) {
            charFloatRef.current = Math.max(
              0,
              charFloatRef.current - Math.abs(scrollDelta) / pixelsPerUnit
            );
          }

          const currentUnit = Math.round(charFloatRef.current);
          const titleCount = Math.min(fullTitle.length, currentUnit);
          setDisplayedTitle(fullTitle.slice(0, titleCount));

          const descCount = Math.max(0, currentUnit - fullTitle.length);
          setDisplayedDesc(fullDesc.slice(0, descCount));
        }
      }

      // 2. Step cards emergence progress
      if (cardsContainerRef.current) {
        const rect = cardsContainerRef.current.getBoundingClientRect();
        const startY = vh * 0.78;
        const endY = vh * 0.15;

        let p = (startY - rect.top) / (startY - endY);
        p = Math.max(0, Math.min(1, p));
        setScrollProgress(p);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    updateProgress();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Discovery',
      desc: 'The client shares their idea, requirements, and project goals.',
      icon: Lightbulb,
    },
    {
      num: '02',
      title: 'Discussion',
      desc: 'The team reviews the request and discusses scope, timeline, and budget.',
      icon: MessageCircle,
    },
    {
      num: '03',
      title: 'Planning',
      desc: 'The team finalizes deliverables, design direction, and the project plan.',
      icon: FileText,
    },
    {
      num: '04',
      title: 'Creation',
      desc: 'The assigned partner or partners work on the project.',
      icon: Cpu,
    },
    {
      num: '05',
      title: 'Delivery',
      desc: 'The finished work is reviewed, approved, and delivered to the client.',
      icon: CheckCircle,
    },
  ];

  // Helper to calculate progressive emergence for each step from its circle
  const getStepProgress = (index: number) => {
    // Stagger across the scroll progress so cards unfold smoothly in a natural wave
    const stepStart = index * 0.13;
    const stepEnd = Math.min(1, stepStart + 0.48);
    let p = (scrollProgress - stepStart) / (stepEnd - stepStart);
    return Math.max(0, Math.min(1, p));
  };

  return (
    <section id="process" className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header with Editorial Index - Typing Animation */}
        <div 
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20 pb-8 border-b border-neutral-100"
        >
          <div className="lg:col-span-2 flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-[#111111]">06</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold">
              [ METHOD ]
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#111111] tracking-tight leading-tight min-h-[1.2em] flex items-center flex-wrap">
              <span>{displayedTitle}</span>
              {displayedDesc.length === 0 && (
                <span 
                  className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-[#3F5E4D] ml-1.5 align-middle rounded-full animate-pulse"
                  style={{
                    animationDuration: '0.75s',
                  }}
                />
              )}
            </h2>
            <p className="text-sm text-neutral-500 mt-3 font-normal max-w-xl min-h-[2.5rem] flex items-center flex-wrap">
              <span>{displayedDesc}</span>
              {displayedDesc.length > 0 && (
                <span 
                  className="inline-block w-[2px] h-[0.9em] bg-[#3F5E4D] ml-1 align-baseline rounded-full animate-pulse"
                  style={{
                    animationDuration: '0.7s',
                  }}
                />
              )}
            </p>
          </div>

          <div className="lg:col-span-2 text-right hidden lg:block font-mono text-xs text-neutral-400">
            5 PHASES
          </div>
        </div>

        {/* Timeline Container: Ref attached directly here so animation triggers when cards are visible */}
        <div ref={cardsContainerRef}>
          {/* Desktop Horizontal Editorial Timeline */}
          <div className="hidden lg:grid grid-cols-5 gap-6 relative">
            {/* Connecting line aligned with the vertical center of the circles (y = 48px) */}
            <div className="absolute top-12 left-10 right-10 h-0.5 bg-neutral-200/80 -z-0 rounded-full" />
            
            {/* Active progress beam that links the circles as user scrolls */}
            <div
              className="absolute top-12 left-10 h-0.5 bg-[#3F5E4D] -z-0 rounded-full transition-all duration-150 ease-out"
              style={{
                width: `calc(${Math.min(1, scrollProgress * 1.05)} * (100% - 5rem))`,
              }}
            />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const stepP = getStepProgress(idx);
              
              // Circle center is at (48px, 48px) inside the card (p-7 = 28px + 20px radius)
              // Starts at 22px (clipping exactly to the number circle) and expands to full card reveal
              const radius = stepP <= 0.01 
                ? 22 
                : stepP >= 0.98 
                  ? 600 
                  : 22 + Math.pow(stepP, 1.2) * 550;
              
              const isComplete = stepP >= 0.85;

              return (
                <div
                  key={step.num}
                  className="relative z-10 flex flex-col justify-between p-7 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 hover:border-[#3F5E4D] transition-all duration-300 group will-change-transform"
                  style={{
                    clipPath: stepP >= 0.98 ? 'none' : `circle(${radius}px at 48px 48px)`,
                    WebkitClipPath: stepP >= 0.98 ? 'none' : `circle(${radius}px at 48px 48px)`,
                    transformOrigin: '48px 48px',
                    transform: `scale(${0.92 + stepP * 0.08})`,
                    backgroundColor: isComplete ? 'rgba(250, 249, 245, 0.95)' : 'rgba(245, 245, 245, 0.7)',
                    borderColor: isComplete ? 'rgba(63, 94, 77, 0.5)' : 'rgba(229, 229, 229, 0.9)',
                    boxShadow: isComplete ? '0 10px 25px -5px rgba(63, 94, 77, 0.12)' : 'none',
                    transition: 'clip-path 0.12s cubic-bezier(0.16, 1, 0.3, 1), transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      {/* The number circle: stays crystal clear at the origin */}
                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shadow-2xs z-20 ${
                          isComplete
                            ? 'bg-[#3F5E4D] text-white border border-[#3F5E4D]'
                            : 'bg-white border border-neutral-300 text-[#111111]'
                        }`}
                      >
                        {step.num}
                      </span>
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isComplete ? 'text-[#3F5E4D]' : 'text-neutral-400'
                        }`}
                        style={{ opacity: Math.max(0, (stepP - 0.15) / 0.85) }}
                      />
                    </div>

                    {/* Card content emerging from the circle */}
                    <div
                      style={{ opacity: Math.max(0, (stepP - 0.1) / 0.9) }}
                      className="transition-opacity duration-200"
                    >
                      <h3 className="font-display font-bold text-lg text-[#111111] mb-2.5">
                        {step.title}
                      </h3>

                      <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{ opacity: Math.max(0, (stepP - 0.2) / 0.8) }}
                    className={`mt-8 pt-3 border-t text-[10px] font-mono uppercase tracking-widest font-bold transition-all duration-300 ${
                      isComplete ? 'border-[#3F5E4D]/25 text-[#3F5E4D]' : 'border-neutral-200/60 text-neutral-400'
                    }`}
                  >
                    Phase {step.num}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile / Tablet Vertical Timeline */}
          <div className="lg:hidden space-y-4 relative">
            <div className="absolute top-6 bottom-6 left-11 w-0.5 bg-neutral-200 -z-0" />
            
            <div
              className="absolute top-6 left-11 w-0.5 bg-[#3F5E4D] -z-0 transition-all duration-150 ease-out"
              style={{
                height: `calc(${scrollProgress} * (100% - 3rem))`,
              }}
            />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const stepP = getStepProgress(idx);
              
              // On mobile, circle is at (44px, 44px)
              const radius = stepP <= 0.01 
                ? 22 
                : stepP >= 0.98 
                  ? 600 
                  : 22 + Math.pow(stepP, 1.2) * 550;
              
              const isComplete = stepP >= 0.85;

              return (
                <div
                  key={step.num}
                  className="relative z-10 flex items-start gap-4 p-6 bg-neutral-50/80 rounded-2xl border border-neutral-200 will-change-transform"
                  style={{
                    clipPath: stepP >= 0.98 ? 'none' : `circle(${radius}px at 44px 44px)`,
                    WebkitClipPath: stepP >= 0.98 ? 'none' : `circle(${radius}px at 44px 44px)`,
                    transformOrigin: '44px 44px',
                    transform: `scale(${0.94 + stepP * 0.06})`,
                    backgroundColor: isComplete ? 'rgba(255, 255, 255, 0.95)' : 'rgba(245, 245, 245, 0.7)',
                    borderColor: isComplete ? 'rgba(63, 94, 77, 0.4)' : 'rgba(229, 229, 229, 0.8)',
                    transition: 'clip-path 0.12s cubic-bezier(0.16, 1, 0.3, 1), transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all duration-300 ${
                      isComplete ? 'bg-[#3F5E4D] text-white' : 'bg-[#111111] text-white'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div
                    className="flex-1 transition-opacity duration-200"
                    style={{ opacity: Math.max(0, (stepP - 0.1) / 0.9) }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base text-[#111111]">
                        {step.title}
                      </h3>
                      <Icon className={`w-4 h-4 transition-colors duration-300 ${
                        isComplete ? 'text-[#3F5E4D]' : 'text-neutral-400'
                      }`} />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

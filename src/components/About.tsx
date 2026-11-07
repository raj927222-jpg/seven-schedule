import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const firstCardSlotRef = useRef<HTMLDivElement>(null);
  const secondCardSlotRef = useRef<HTMLDivElement>(null);
  const thirdCardSlotRef = useRef<HTMLDivElement>(null);

  const [typeProgress, setTypeProgress] = useState(0);
  const [firstProgress, setFirstProgress] = useState(0);
  const [secondProgress, setSecondProgress] = useState(0);
  const [thirdProgress, setThirdProgress] = useState(0);
  const [firstOffset, setFirstOffset] = useState(600);
  const [secondOffset, setSecondOffset] = useState(180);
  const [thirdOffset, setThirdOffset] = useState(600);

  useEffect(() => {
    let ticking = false;

    const updateScrollAnimation = () => {
      const vh = window.innerHeight || 800;
      const vw = window.innerWidth || 1200;

      // Section Header (Typewriter effect on scroll)
      if (headerRef.current) {
        const rectH = headerRef.current.getBoundingClientRect();
        // Start typing when header enters lower part of viewport
        const startYH = vh * 0.88;
        // Complete typing as the section header scrolls through the viewport
        const endYH = vh * 0.18;
        let pH = (startYH - rectH.top) / (startYH - endYH);
        pH = Math.max(0, Math.min(1, pH));
        setTypeProgress(pH);
      }

      // Card 1 (left side card - enters from left)
      if (firstCardSlotRef.current) {
        const rect1 = firstCardSlotRef.current.getBoundingClientRect();
        // Distance needed to completely exit the left of the viewport
        const offset1 = Math.max(rect1.right + 40, 400);
        setFirstOffset(offset1);

        const startY1 = vh * 1.05;
        const endY1 = vh * 0.42;
        let p1 = (startY1 - rect1.top) / (startY1 - endY1);
        p1 = Math.max(0, Math.min(1, p1));
        setFirstProgress(p1);
      }

      // Card 2 (center card - rises from bottom)
      if (secondCardSlotRef.current) {
        const rect2 = secondCardSlotRef.current.getBoundingClientRect();
        const offset2 = Math.min(vh * 0.22, 180);
        setSecondOffset(offset2);

        const startY2 = vh * 1.05;
        const endY2 = vh * 0.42;
        let p2 = (startY2 - rect2.top) / (startY2 - endY2);
        p2 = Math.max(0, Math.min(1, p2));
        setSecondProgress(p2);
      }

      // Card 3 (right side card - enters from right)
      if (thirdCardSlotRef.current) {
        const rect3 = thirdCardSlotRef.current.getBoundingClientRect();
        // Distance needed to completely exit the right of the viewport
        const offset3 = Math.max(vw - rect3.left + 40, 400);
        setThirdOffset(offset3);

        const startY3 = vh * 1.05;
        const endY3 = vh * 0.42;
        let p3 = (startY3 - rect3.top) / (startY3 - endY3);
        p3 = Math.max(0, Math.min(1, p3));
        setThirdProgress(p3);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollAnimation);
        ticking = true;
      }
    };

    // Calculate initial position on load/mount
    updateScrollAnimation();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const responsibilities = [
    {
      domain: 'Web Development',
      leads: 'Raj & Vaibhav',
      description: 'Modern architecture, responsive frontends, interactive platforms, and scalable database integrations.',
      code: 'DEV / 01',
    },
    {
      domain: 'Motion Graphics',
      leads: 'Raj',
      description: '3D motion visuals, procedural animations, promotional reels, and brand introduction films.',
      code: 'MOT / 02',
    },
    {
      domain: 'Graphic Design',
      leads: 'Raj',
      description: 'Complete visual identity systems, typographic guidelines, logos, and high-impact brand collateral.',
      code: 'DES / 03',
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-neutral-600 bg-white border border-neutral-200/80 shadow-2xs">
              <span className="text-[#111111]">✦</span>
              <span>Two Freelancers · Surat</span>
            </span>
          </div>

          {/* Header Text Block: Typewriter effect on scroll */}
          <div ref={headerRef} className="lg:col-span-9">
            {(() => {
              const line1Text = "Just two freelancers.";
              const line2Text = "Direct work, zero agency fluff.";
              const totalChars = line1Text.length + line2Text.length; // 52
              const headlineP = Math.min(1, typeProgress / 0.28);
              const typedChars = Math.round(headlineP * totalChars);

              const line1Shown = Math.min(line1Text.length, typedChars);
              const line2Shown = Math.max(0, typedChars - line1Text.length);
              const isTypingLine1 = typedChars <= line1Text.length && typedChars > 0;
              const isTypingLine2 = typedChars > line1Text.length && typedChars < totalChars;
              const isAtStart = typedChars === 0;

              // Text segments for Paragraph 1 (main description)
              const para1Segments = [
                { text: "Seven Schedule isn't a corporate company or a bloated agency — it's just the two of us: " },
                { text: "Raj", isBold: true },
                { text: " and " },
                { text: "Vaibhav", isBold: true },
                { text: ", two independent freelancers based in Surat, Gujarat. We collaborate directly with businesses and creators to build high-performance websites, cinematic motion graphics, and distinct visual identities. No sales reps, no account managers, and no runarounds — just two dedicated craftsmen taking full ownership of your project from start to finish." }
              ];
              const totalPara1Length = para1Segments.reduce((sum, s) => sum + s.text.length, 0);
              const para1P = Math.max(0, Math.min(1, (typeProgress - 0.25) / 0.52));
              const typedPara1 = Math.round(para1P * totalPara1Length);

              // Text segments for Paragraph 2 (sidebar summary)
              const para2Segments = [
                { text: "Direct freelance collaboration with " },
                { text: "Raj", isBold: true },
                { text: " and " },
                { text: "Vaibhav", isBold: true },
                { text: ". Honest pricing, direct WhatsApp communication, fast delivery, and personal responsibility on every single deliverable." }
              ];
              const totalPara2Length = para2Segments.reduce((sum, s) => sum + s.text.length, 0);
              const para2P = Math.max(0, Math.min(1, (typeProgress - 0.55) / 0.42));
              const typedPara2 = Math.round(para2P * totalPara2Length);

              // Helper to render letter-by-letter typing with bold preservation and zero layout shift
              const renderSegments = (
                segments: { text: string; isBold?: boolean }[],
                typedCount: number,
                totalLength: number,
                isActiveTyping: boolean
              ) => {
                let remaining = typedCount;
                let cursorPlaced = false;

                return segments.map((seg, idx) => {
                  const segLen = seg.text.length;
                  const count = Math.max(0, Math.min(segLen, remaining));
                  const typed = seg.text.slice(0, count);
                  const untyped = seg.text.slice(count);
                  remaining -= count;

                  const shouldShowCursor =
                    isActiveTyping &&
                    !cursorPlaced &&
                    (remaining <= 0 || (idx === segments.length - 1 && count === segLen));

                  if (shouldShowCursor) {
                    cursorPlaced = true;
                  }

                  const Element = seg.isBold ? 'strong' : 'span';

                  return (
                    <React.Fragment key={idx}>
                      <Element>{typed}</Element>
                      {shouldShowCursor && (
                        <span className="inline-block w-[2px] h-[0.8em] bg-[#111111] mx-0.5 align-baseline animate-pulse shadow-xs" />
                      )}
                      <Element className="opacity-0 select-none pointer-events-none">
                        {untyped}
                      </Element>
                    </React.Fragment>
                  );
                });
              };

              return (
                <>
                  <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-6">
                    {/* Line 1 */}
                    <span className="block min-h-[1.15em]">
                      <span>{line1Text.slice(0, line1Shown)}</span>
                      {(isTypingLine1 || isAtStart) && (
                        <span className="inline-block w-[2.5px] sm:w-[3px] h-[0.78em] bg-[#111111] ml-1 align-baseline animate-pulse shadow-xs" />
                      )}
                      <span className="opacity-0 select-none pointer-events-none">
                        {line1Text.slice(line1Shown)}
                      </span>
                    </span>

                    {/* Line 2 */}
                    <span className="italic font-normal block min-h-[1.15em]">
                      <span>{line2Text.slice(0, line2Shown)}</span>
                      {isTypingLine2 && (
                        <span className="inline-block w-[2.5px] sm:w-[3px] h-[0.78em] bg-[#111111] ml-1 align-baseline animate-pulse shadow-xs" />
                      )}
                      <span className="opacity-0 select-none pointer-events-none">
                        {line2Text.slice(line2Shown)}
                      </span>
                    </span>
                  </h2>

                  {/* Paragraphs Grid: NO fade/transform animation, pure typewriter typing on scroll */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-neutral-200/60">
                    <div className="md:col-span-8">
                      <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                        {renderSegments(
                          para1Segments,
                          typedPara1,
                          totalPara1Length,
                          typedPara1 > 0 && typedPara1 < totalPara1Length
                        )}
                      </p>
                    </div>
                    <div className="md:col-span-4 text-xs text-neutral-500 leading-relaxed">
                      <p>
                        {renderSegments(
                          para2Segments,
                          typedPara2,
                          totalPara2Length,
                          typedPara2 > 0 && typedPara2 < totalPara2Length
                        )}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* 3 Soft Floating Glass Cards for Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {responsibilities.map((item, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            if (isFirst) {
              const currentTranslateX = -(1 - firstProgress) * firstOffset;
              return (
                <div
                  key={item.code}
                  ref={firstCardSlotRef}
                  className="h-full relative"
                >
                  <div
                    className="glass-card rounded-3xl p-8 h-full flex flex-col justify-between will-change-transform hover:-translate-y-1"
                    style={{
                      transform: `translateX(${currentTranslateX}px)`,
                      opacity: Math.max(0.05, Math.min(1, firstProgress * 1.25)),
                      transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease-out',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-6">
                        <span>{item.code}</span>
                        <span className="text-neutral-700 font-medium">Lead: {item.leads}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-[#111111] mb-3">
                        {item.domain}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-black/[0.04] flex items-center justify-between text-xs text-neutral-500">
                      <span>Surat, Gujarat</span>
                      <span className="font-mono text-[11px] text-[#111111]">Est. 2026</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (isSecond) {
              const currentTranslateY = (1 - secondProgress) * secondOffset;
              return (
                <div
                  key={item.code}
                  ref={secondCardSlotRef}
                  className="h-full relative"
                >
                  <div
                    className="glass-card rounded-3xl p-8 h-full flex flex-col justify-between will-change-transform hover:-translate-y-1"
                    style={{
                      transform: `translateY(${currentTranslateY}px)`,
                      opacity: Math.max(0.05, Math.min(1, secondProgress * 1.25)),
                      transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease-out',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-6">
                        <span>{item.code}</span>
                        <span className="text-neutral-700 font-medium">Lead: {item.leads}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-[#111111] mb-3">
                        {item.domain}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-black/[0.04] flex items-center justify-between text-xs text-neutral-500">
                      <span>Surat, Gujarat</span>
                      <span className="font-mono text-[11px] text-[#111111]">Est. 2026</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (isThird) {
              const currentTranslateX = (1 - thirdProgress) * thirdOffset;
              return (
                <div
                  key={item.code}
                  ref={thirdCardSlotRef}
                  className="h-full relative"
                >
                  <div
                    className="glass-card rounded-3xl p-8 h-full flex flex-col justify-between will-change-transform hover:-translate-y-1"
                    style={{
                      transform: `translateX(${currentTranslateX}px)`,
                      opacity: Math.max(0.05, Math.min(1, thirdProgress * 1.25)),
                      transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease-out',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-6">
                        <span>{item.code}</span>
                        <span className="text-neutral-700 font-medium">Lead: {item.leads}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-[#111111] mb-3">
                        {item.domain}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-black/[0.04] flex items-center justify-between text-xs text-neutral-500">
                      <span>Surat, Gujarat</span>
                      <span className="font-mono text-[11px] text-[#111111]">Est. 2026</span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

      </div>
    </section>
  );
};

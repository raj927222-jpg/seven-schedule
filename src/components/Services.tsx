import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, Video, Palette, Check } from 'lucide-react';
import { ServiceType } from '../types/index.ts';

interface ServicesProps {
  onSelectService: (service: ServiceType) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [brushProgress, setBrushProgress] = useState(0);
  const [cardProgresses, setCardProgresses] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    let ticking = false;

    const updateOnScroll = () => {
      const vh = window.innerHeight || 800;
      const isDesktop = window.innerWidth >= 1024;

      // 1. Header brush scrub
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const plateauTop = vh * 0.28;
        const plateauBottom = vh * 0.58;

        let p = 1;
        if (center > plateauBottom) {
          const bottomThreshold = vh * 0.92;
          p = (bottomThreshold - center) / (bottomThreshold - plateauBottom);
        } else if (center < plateauTop) {
          const topThreshold = -30;
          p = (center - topThreshold) / (plateauTop - topThreshold);
        } else {
          p = 1;
        }

        setBrushProgress(Math.max(0, Math.min(1, p)));
      }

      // 2. Paper roll unroll scrub for service cards (responsive for mobile vs desktop)
      if (cardRefs.current && cardRefs.current.length > 0) {
        const newProgresses = [0, 1, 2].map((idx) => {
          const cardEl = cardRefs.current[idx];
          if (!cardEl) return 0;
          const rect = cardEl.getBoundingClientRect();

          if (isDesktop) {
            // Desktop (horizontal row): staggered unroll as section comes into view
            const startY = vh * 0.98;
            const endY = vh * 0.12;
            let r = (startY - rect.top) / (startY - endY);
            r = Math.max(0, Math.min(1, r));

            const start = idx * 0.15;
            const duration = idx === 0 ? 0.80 : 0.70;
            return Math.max(0, Math.min(1, (r - start) / duration));
          } else {
            // Mobile (stacked column): starts when card is well inside view and unrolls slowly across the screen
            const startY = vh * 0.84;
            const endY = idx === 0 ? vh * 0.08 : vh * 0.14;
            let r = (startY - rect.top) / (startY - endY);
            return Math.max(0, Math.min(1, r));
          }
        });

        setCardProgresses(newProgresses);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    // Initial check
    updateOnScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const services = [
    {
      id: 'web-dev',
      type: 'Web Development' as ServiceType,
      num: '01',
      title: 'Web Development',
      badge: 'Architecture',
      description:
        'We design and build high-converting landing pages, interactive portfolios, and modern websites crafted to showcase your business and drive growth.',
      partners: 'Raj & Vaibhav',
      ctaText: 'Discuss a Website Project',
      icon: Code,
      deliverables: [
        'High-converting landing pages',
        'Interactive portfolio websites',
        'Restaurant & cafe websites',
        'Website redesigns & speed upgrades',
        'Admin dashboards & database integrations',
      ],
    },
    {
      id: 'motion-graphics',
      type: 'Motion Graphics' as ServiceType,
      num: '02',
      title: 'Motion Graphics',
      badge: 'Visual Motion',
      description:
        'We transform ideas into engaging motion visuals, promotional launch videos, 3D kinetic reels, and cinematic digital content.',
      partners: 'Raj',
      ctaText: 'Discuss a Motion Project',
      icon: Video,
      deliverables: [
        'Brand introduction videos',
        'Social media advertisement reels',
        'Product promotional videos',
        'Kinetic typography animations',
        'Cinematic motion graphics',
        'Short-form reels & story ads',
      ],
    },
    {
      id: 'graphic-design',
      type: 'Graphic Design' as ServiceType,
      num: '03',
      title: 'Graphic Design',
      badge: 'Brand Identity',
      description:
        'We create visually consistent designs that help brands communicate their identity with clarity, distinction, and impact.',
      partners: 'Raj',
      ctaText: 'Discuss a Design Project',
      icon: Palette,
      deliverables: [
        'Logo design & visual marks',
        'Brand identity guidelines',
        'Social media creatives & post sets',
        'Posters, billboards & banners',
        'Premium business cards & stationery',
        'Promotional graphics & pitch decks',
      ],
    },
  ];

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header with Brush Paint Reveal */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 relative">
          {/* Masked content that is revealed as the brush sweeps across */}
          <div
            className="transition-all duration-100 will-change-transform"
            style={{
              maskImage: brushProgress >= 0.98
                ? 'none'
                : `linear-gradient(105deg, black 0%, black ${brushProgress * 115}%, transparent ${brushProgress * 115 + 14}%)`,
              WebkitMaskImage: brushProgress >= 0.98
                ? 'none'
                : `linear-gradient(105deg, black 0%, black ${brushProgress * 115}%, transparent ${brushProgress * 115 + 14}%)`,
              opacity: Math.max(0.04, Math.min(1, brushProgress * 1.5)),
            }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-neutral-600 bg-white border border-neutral-200/80 shadow-2xs mb-4">
              <span className="text-[#111111]">✦</span>
              <span>Disciplines</span>
            </span>

            <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-4">
              <span>Services designed</span><br />
              <span className="italic font-normal">
                to move your brand forward.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-normal">
              Three core domains. Direct founder collaboration. Crafted with precision from Surat, Gujarat.
            </p>
          </div>
        </div>

        {/* 3 Mindly Glass Service Cards - Paper Roll Unroll Animation */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const p = cardProgresses[idx] ?? 0;
            const isRolling = p > 0.02 && p < 0.98;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="relative flex flex-col"
              >
                <div
                  className="glass-card rounded-3xl p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 relative group will-change-transform h-full"
                  style={{
                    clipPath: p >= 0.99 ? 'none' : `inset(0 0 ${Math.max(0, (1 - p) * 100)}% 0 round 24px)`,
                    opacity: p >= 0.99 ? 1 : Math.max(0.2, Math.min(1, p * 1.8)),
                    transition: idx === 0
                      ? 'clip-path 0.70s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.70s cubic-bezier(0.16, 1, 0.3, 1)'
                      : 'clip-path 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono text-neutral-400">
                        SERVICE {service.num}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 transition-transform group-hover:scale-105">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-600 bg-neutral-100 mb-3">
                      {service.badge}
                    </span>

                    <h3 className="font-display font-bold text-2xl text-[#111111] mb-2">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-2 mb-8 pt-4 border-t border-black/[0.04]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                        Deliverables Scope
                      </span>
                      {service.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-neutral-700">
                          <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/[0.04]">
                    <div className="text-[11px] text-neutral-400 mb-3">
                      Direct Lead: <strong className="text-neutral-800">{service.partners}</strong>
                    </div>
                    <button
                      onClick={() => onSelectService(service.type)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <span>{service.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cylindrical paper roll bottom curl that unfurls downward */}
                {isRolling && (
                  <div
                    className="absolute left-3 right-3 pointer-events-none z-30 -translate-y-1/2"
                    style={{
                      top: `${p * 100}%`,
                      transition: idx === 0
                        ? 'top 0.70s cubic-bezier(0.16, 1, 0.3, 1)'
                        : 'top 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div
                      className="w-full h-3.5 rounded-full shadow-[0_8px_18px_rgba(40,30,20,0.3)] border-b border-black/15"
                      style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F3EB 35%, #DDD6C5 75%, #A89E88 100%)',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MessageSquare, Check, ArrowRight } from 'lucide-react';

export const PartnerProfiles: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [brushProgress, setBrushProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateBrushOnScroll = () => {
      const vh = window.innerHeight || 800;

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

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBrushOnScroll);
        ticking = true;
      }
    };

    updateBrushOnScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const partners = [
    {
      name: 'Raj',
      title: 'Freelance Creator',
      role: 'Web Developer · Motion Graphics Artist · Graphic Designer',
      phone: '+91 9725917116',
      cleanPhone: '919725917116',
      email: 'raj927222@gmail.com',
      avatarText: 'R',
      responsibilities: [
        'Website development & architecture',
        '3D kinetic motion graphics',
        'Graphic design & identity systems',
        'Creative direction & visual presentation',
        'Direct project execution without delegation',
      ],
      whatsappPrefill: 'Hello Raj, I would like to discuss a project with Seven Schedule.',
    },
    {
      name: 'Vaibhav',
      title: 'Freelance Developer',
      role: 'Web Developer · Client Operations',
      phone: '+91 7016451067',
      cleanPhone: '917016451067',
      email: 'vaibhavyadav271204@gmail.com',
      avatarText: 'V',
      responsibilities: [
        'High-performance website development',
        'Client coordination & workflow tracking',
        'Project planning and delivery timelines',
        'Database integrations & deployment ops',
      ],
      whatsappPrefill: 'Hello Vaibhav, I would like to discuss a project with Seven Schedule.',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header with Brush Paint Reveal */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 relative">
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
              <span>The Freelancers</span>
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-4">
              Meet the freelancers.<br />
              <span className="italic font-normal">Direct collaboration, zero friction.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-normal">
              Direct access to the two freelancers executing your website architecture, animations, and brand assets from Surat, Gujarat.
            </p>
          </div>
        </div>

        {/* Partners Grid (Mindly Glass Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-5xl mx-auto">
          {partners.map((partner) => {
            const waUrl = `https://wa.me/${partner.cleanPhone}?text=${encodeURIComponent(partner.whatsappPrefill)}`;
            return (
              <div
                key={partner.name}
                className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                      {partner.avatarText}
                    </div>
                    <div>
                      <h3 className="font-serif-display font-medium text-3xl text-[#111111] mb-1">
                        {partner.name}
                      </h3>
                      <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-1">
                        {partner.title}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono text-neutral-600 bg-neutral-100 border border-neutral-200/60">
                        {partner.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-8 pt-4 border-t border-black/[0.04]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                      Core Responsibilities
                    </span>
                    {partner.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs text-neutral-600 font-mono mb-8 p-4 bg-white/60 rounded-2xl border border-neutral-200/60">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{partner.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="truncate">{partner.email}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-black/[0.04]">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${partner.phone}`}
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

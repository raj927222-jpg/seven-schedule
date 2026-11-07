import React, { useEffect, useState } from 'react';
import { AgencyStats } from '../types/index.ts';

interface StatisticsProps {
  stats: AgencyStats | null;
  loading?: boolean;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats, loading }) => {
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    web: 0,
    motion: 0,
    design: 0,
    clients: 0,
  });

  useEffect(() => {
    if (!stats) return;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const factor = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimatedCounts({
        total: Math.round(factor * (stats.total_completed || 0)),
        web: Math.round(factor * (stats.websites_developed || 0)),
        motion: Math.round(factor * (stats.motion_graphics_projects || 0)),
        design: Math.round(factor * (stats.graphic_design_projects || 0)),
        clients: Math.round(factor * (stats.happy_clients || 0)),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [stats]);

  const hasCompletedProjects = stats && stats.total_completed > 0;

  return (
    <section className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header with Editorial Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 pb-8 border-b border-neutral-100">
          <div className="lg:col-span-2 flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-[#111111]">05</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold">
              [ VERIFIED METRICS ]
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#111111] tracking-tight">
              DATA-BACKED PROGRESSION.
            </h2>
            <p className="text-xs text-neutral-400 mt-2 font-mono">
              Metrics calculated directly from live database project records.
            </p>
          </div>

          <div className="lg:col-span-2 text-right hidden lg:block font-mono text-xs text-neutral-400">
            AUDITED 2026
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs font-mono text-neutral-400">
            Calculating database metrics...
          </div>
        ) : !hasCompletedProjects ? (
          <div className="p-10 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
            <h3 className="font-display font-bold text-lg text-[#111111] mb-2">Building Our Portfolio</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Completed client projects are currently in staging and will reflect in this verified tally once finalized.
            </p>
          </div>
        ) : (
          /* Editorial Sculptural Numerals Grid */
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            
            {/* Metric 1 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col justify-between group hover:border-[#3F5E4D] transition-colors">
              <span className="text-[10px] font-mono text-[#3F5E4D] uppercase tracking-widest block mb-4 font-bold">
                01 · COMPLETED
              </span>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-[#111111] tracking-tight tabular-nums">
                  {animatedCounts.total}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-medium">Finished Works</div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col justify-between group hover:border-[#3F5E4D] transition-colors">
              <span className="text-[10px] font-mono text-[#3F5E4D] uppercase tracking-widest block mb-4 font-bold">
                02 · WEB
              </span>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-[#111111] tracking-tight tabular-nums">
                  {animatedCounts.web}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-medium">Websites Built</div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col justify-between group hover:border-[#3F5E4D] transition-colors">
              <span className="text-[10px] font-mono text-[#3F5E4D] uppercase tracking-widest block mb-4 font-bold">
                03 · MOTION
              </span>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-[#111111] tracking-tight tabular-nums">
                  {animatedCounts.motion}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-medium">Motion & Reels</div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col justify-between group hover:border-[#3F5E4D] transition-colors">
              <span className="text-[10px] font-mono text-[#3F5E4D] uppercase tracking-widest block mb-4 font-bold">
                04 · DESIGN
              </span>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-[#111111] tracking-tight tabular-nums">
                  {animatedCounts.design}
                </div>
                <div className="text-xs text-neutral-500 mt-2 font-medium">Visual Identities</div>
              </div>
            </div>

            {/* Metric 5 */}
            <div className="col-span-2 md:col-span-1 p-6 rounded-2xl bg-[#2A4034] text-white flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-mono text-emerald-200 uppercase tracking-widest block mb-4 font-bold">
                05 · CLIENTS
              </span>
              <div>
                <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                  {animatedCounts.clients}
                </div>
                <div className="text-xs text-emerald-100/80 mt-2 font-medium">Direct Partnerships</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  X, 
  Film,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PortfolioProject, ServiceType } from '../types/index.ts';

interface PortfolioProps {
  projects?: PortfolioProject[];
  loading?: boolean;
  onSelectService?: (service: ServiceType) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ 
  projects = [], 
  loading = false,
  onSelectService 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProjectModal, setActiveProjectModal] = useState<PortfolioProject | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const [slideDistance, setSlideDistance] = useState(90);

  useEffect(() => {
    let ticking = false;

    const updateOnScroll = () => {
      const vh = window.innerHeight || 800;
      setSlideDistance(window.innerWidth < 768 ? 45 : 90);

      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const plateauTop = vh * 0.20;
        const plateauBottom = vh * 0.72;

        let p = 1;
        if (center > plateauBottom) {
          // Entering or leaving from bottom
          const bottomThreshold = vh * 0.98;
          p = (bottomThreshold - center) / (bottomThreshold - plateauBottom);
        } else if (center < plateauTop) {
          // Entering or leaving from top (when scrolling up into it from below or leaving off top)
          const topThreshold = -40;
          p = (center - topThreshold) / (plateauTop - topThreshold);
        } else {
          // In comfortable central reading zone
          p = 1;
        }

        setSlideProgress(Math.max(0, Math.min(1, p)));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    updateOnScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const categories = ['All', 'Web Development', 'Motion Graphics', 'Graphic Design'];

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === 'All') return true;
    return project.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return projects.length;
    return projects.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();

    let targetScroll = el.scrollLeft;
    let animId: number | null = null;

    const smoothStep = () => {
      const diff = targetScroll - el.scrollLeft;
      if (Math.abs(diff) > 0.5) {
        el.scrollLeft += diff * 0.25;
        checkScroll();
        animId = requestAnimationFrame(smoothStep);
      } else {
        el.scrollLeft = targetScroll;
        checkScroll();
        animId = null;
      }
    };

    const onScroll = () => {
      if (!animId) {
        targetScroll = el.scrollLeft;
      }
      checkScroll();
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    // Enable fluid damped horizontal wheel scrolling
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) return;

        const isAtStart = el.scrollLeft <= 2 && e.deltaY < 0;
        const isAtEnd = el.scrollLeft >= maxScroll - 2 && e.deltaY > 0;

        if (!isAtStart && !isAtEnd) {
          e.preventDefault();
          if (!animId) {
            targetScroll = el.scrollLeft;
          }
          targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY * 0.95));
          if (!animId) {
            animId = requestAnimationFrame(smoothStep);
          }
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    // Drag to scroll on desktop
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let hasDragged = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      startX = e.pageX - el.offsetLeft;
      startScroll = el.scrollLeft;
      targetScroll = el.scrollLeft;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const onWindowMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 4) {
        hasDragged = true;
      }
      el.scrollLeft = startScroll - walk;
      targetScroll = el.scrollLeft;
      checkScroll();
    };

    const onClickCapture = (e: MouseEvent) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onWindowMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onWindowMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, [filteredProjects]);

  const handleRequestSimilar = (project: PortfolioProject) => {
    if (onSelectService) {
      onSelectService(project.category);
    }
    const formEl = document.getElementById('contact-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveProjectModal(null);
  };

  const getInstagramEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (!match) return null;
    const kind = match[1].toLowerCase() === 'reels' ? 'reel' : match[1].toLowerCase();
    return `https://www.instagram.com/${kind}/${match[2]}/embed/`;
  };

  return (
    <section id="projects" className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div
            style={{
              transform: `translateX(${(1 - slideProgress) * -slideDistance}px)`,
              opacity: Math.max(0, Math.min(1, slideProgress * 1.5)),
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity',
            }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-neutral-600 bg-white border border-neutral-200/80 shadow-2xs mb-4">
              <span className="text-[#111111]">✦</span>
              <span>Portfolio Archive</span>
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl text-[#111111] tracking-tight leading-[1.08]">
              Selected works<br />
              <span className="italic font-normal">crafted with precision.</span>
            </h2>
          </div>

          <p
            className="text-xs sm:text-sm text-neutral-500 max-w-md font-normal leading-relaxed"
            style={{
              transform: `translateX(${(1 - slideProgress) * slideDistance}px)`,
              opacity: Math.max(0, Math.min(1, slideProgress * 1.5)),
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity',
            }}
          >
            Explore bespoke digital architectures, kinetic motion graphics, and editorial brand systems crafted by Seven Schedule.
          </p>
        </div>

        {/* Filter Navigation (Mindly Segmented Glass Pill) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-neutral-200/60">
          <div className="inline-flex items-center p-1 rounded-full bg-neutral-200/60 backdrop-blur-md border border-white/70 shadow-2xs">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#111111] font-semibold shadow-xs'
                      : 'text-neutral-600 hover:text-[#111111]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`ml-1.5 text-[10px] ${isSelected ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-500 hidden sm:block">
              Showing {filteredProjects.length} of {projects.length} works
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous works"
                className={`w-8 h-8 rounded-full border border-neutral-200/90 bg-white flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'text-neutral-800 hover:bg-neutral-100 shadow-2xs cursor-pointer'
                    : 'text-neutral-300 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next works"
                className={`w-8 h-8 rounded-full border border-neutral-200/90 bg-white flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'text-neutral-800 hover:bg-neutral-100 shadow-2xs cursor-pointer'
                    : 'text-neutral-300 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex gap-6 sm:gap-8 overflow-x-hidden pb-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-[85vw] sm:w-[420px] lg:w-[460px] shrink-0 bg-white rounded-3xl border border-neutral-200 overflow-hidden animate-pulse">
                <div className="aspect-16/10 bg-neutral-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                  <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs">
            <Layers className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-serif-display font-medium text-xl text-[#111111] mb-1">
              {projects.length === 0 ? 'Portfolio Showcase Updating' : 'No Projects in this Category'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              {projects.length === 0
                ? 'Our curated works are being updated directly by the studio. Reach out below to discuss your project or request private case studies.'
                : 'New project archives are uploaded regularly by the studio. Check another category or request a bespoke commission.'}
            </p>
            {projects.length > 0 && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-5 py-2.5 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Show All Works
              </button>
            )}
          </div>
        )}

        {/* Projects Horizontal Reel */}
        {!loading && filteredProjects.length > 0 && (
          <div className="relative -mx-6 sm:-mx-10 lg:-mx-12 px-6 sm:px-10 lg:px-12">
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-6 w-12 bg-linear-to-r from-[#FAF9F5] to-transparent pointer-events-none z-10 hidden sm:block" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-6 w-12 bg-linear-to-l from-[#FAF9F5] to-transparent pointer-events-none z-10 hidden sm:block" />
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 overscroll-x-contain cursor-grab active:cursor-grabbing select-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredProjects.map((project) => {
                const hasVideo = Boolean(project.video_url);
                const hasLive = Boolean(project.live_url);

                return (
                  <article
                    key={project.id}
                    className="w-[85vw] sm:w-[420px] lg:w-[460px] shrink-0 glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-white"
                  >
                    <div>
                      {/* Media Container */}
                      <div 
                        onClick={() => setActiveProjectModal(project)}
                        className="aspect-16/10 bg-neutral-100 relative overflow-hidden cursor-pointer"
                      >
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="w-full h-full object-cover pointer-events-none select-none"
                          draggable={false}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/75 backdrop-blur-xs text-white">
                            {project.category}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {project.featured && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white text-neutral-800 flex items-center gap-1 shadow-xs">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Featured</span>
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-xs text-white">
                              {project.created_at ? new Date(project.created_at).getFullYear() : '2026'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 
                          onClick={() => setActiveProjectModal(project)}
                          className="font-serif-display font-medium text-xl text-[#111111] hover:text-neutral-600 transition-colors cursor-pointer mb-2"
                        >
                          {project.title}
                        </h3>

                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {project.deliverables && project.deliverables.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.deliverables.slice(0, 3).map((d, i) => (
                              <span 
                                key={i}
                                className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-neutral-100 text-neutral-600 border border-neutral-200/60"
                              >
                                {d}
                              </span>
                            ))}
                            {project.deliverables.length > 3 && (
                              <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-neutral-100 text-neutral-400">
                                +{project.deliverables.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="px-6 py-4 bg-white/40 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {hasLive && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-800 hover:underline"
                          >
                            <span>Live Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {hasVideo && (
                          <button
                            onClick={() => setActiveProjectModal(project)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-800 hover:underline cursor-pointer"
                          >
                            <Film className="w-3 h-3" />
                            <span>Reel</span>
                          </button>
                        )}
                        {hasVideo && getInstagramEmbedUrl(project.video_url) && (
                          <a
                            href={project.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
                          >
                            <span>Instagram</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => handleRequestSimilar(project)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111111] hover:text-neutral-600 transition-colors ml-auto cursor-pointer"
                      >
                        <span>Inquire</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Custom Requirements Banner */}
        <div className="mt-16 glass-card rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs border border-white">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Custom Requirements
            </span>
            <h3 className="font-serif-display font-medium text-xl sm:text-2xl text-[#111111]">
              Need a bespoke project tailored specifically for your brand?
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Every production by Seven Schedule is engineered from scratch for optimal performance and conversion.
            </p>
          </div>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#111111] hover:bg-neutral-800 rounded-full transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Interactive Project Details Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-200 w-full max-w-3xl overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-[#111111] text-white">
                  {activeProjectModal.category}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  Status: <strong className="text-[#111111]">{activeProjectModal.project_status}</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 text-neutral-400 hover:text-[#111111] rounded-full transition-colors cursor-pointer"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              {(() => {
                const igEmbedUrl = getInstagramEmbedUrl(activeProjectModal.video_url);
                if (igEmbedUrl) {
                  return (
                    <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 flex items-center justify-center">
                      <iframe
                        src={igEmbedUrl}
                        title={activeProjectModal.title}
                        className="w-full max-w-[420px] h-[520px] bg-white"
                        frameBorder="0"
                        scrolling="no"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                return (
                  <div className="aspect-16/9 rounded-2xl overflow-hidden bg-neutral-900 relative">
                    {activeProjectModal.video_url ? (
                      <video
                        src={activeProjectModal.video_url}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support video playback.
                      </video>
                    ) : (
                      <img
                        src={activeProjectModal.cover_image_url}
                        alt={activeProjectModal.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                );
              })()}

              <div>
                <h3 className="font-serif-display font-medium text-2xl sm:text-3xl text-[#111111] mb-3">
                  {activeProjectModal.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  {activeProjectModal.description}
                </p>
              </div>

              {activeProjectModal.deliverables && activeProjectModal.deliverables.length > 0 && (
                <div className="p-5 bg-neutral-50/80 rounded-2xl border border-neutral-200/80">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111] mb-3">
                    Project Deliverables & Scope
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeProjectModal.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeProjectModal.live_url && (
                    <a
                      href={activeProjectModal.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] rounded-full text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {activeProjectModal.video_url && getInstagramEmbedUrl(activeProjectModal.video_url) && (
                    <a
                      href={activeProjectModal.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] rounded-full text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Watch Reel on Instagram</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleRequestSimilar(activeProjectModal)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-colors ml-auto shadow-xs cursor-pointer"
                >
                  <span>Request Similar Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};

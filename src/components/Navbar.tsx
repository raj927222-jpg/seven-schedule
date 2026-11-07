import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
import { Logo } from './Logo.tsx';

interface NavbarProps {
  onOpenRequestForm: (preselectedService?: string) => void;
  onOpenClientDashboard: () => void;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRequestForm,
  onOpenClientDashboard,
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'projects', 'contact-form'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Works' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
    { id: 'contact-form', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F5]/90 backdrop-blur-md border-b border-black/[0.05] py-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between gap-6">
            
            {/* Left: Brand Logo */}
            <div 
              onClick={() => scrollToSection('home')}
              className="cursor-pointer"
            >
              <Logo />
            </div>

            {/* Center: Mindly Frosted Glass Segmented Pill */}
            <nav className="hidden md:flex items-center p-1 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-100 text-[#111111] font-semibold shadow-2xs'
                        : 'text-neutral-600 hover:text-[#111111] font-normal'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={onOpenClientDashboard}
                className="px-4 py-1.5 rounded-full text-xs text-neutral-600 hover:text-[#111111] font-normal transition-colors cursor-pointer"
              >
                Track Project
              </button>
            </nav>

            {/* Right: Black Pill Action Button */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => onOpenRequestForm()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#111111] hover:bg-neutral-800 text-white shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Start a project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/80 border border-neutral-200 text-neutral-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-150">
          <div className="bg-[#FAF9F5] border-b border-neutral-200 px-6 pt-24 pb-8 space-y-4 shadow-xl">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 text-base font-semibold text-[#111111] hover:text-neutral-600"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClientDashboard();
              }}
              className="block w-full text-left py-2 text-base font-semibold text-[#111111] hover:text-neutral-600"
            >
              Track Project Status
            </button>

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRequestForm();
                }}
                className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Start a project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

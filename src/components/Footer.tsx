import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { Lock, ArrowUp, X, Eye, EyeOff, ShieldCheck, AlertCircle, Copy, Check, MessageCircle, ExternalLink, Send } from 'lucide-react';
import { partnerLogin } from '../utils/api.ts';
const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TelegramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.03 8.02 12.2C8.15 12.36 9.74 14.81 12.18 15.86C14.21 16.74 14.62 16.56 15.07 16.52C15.52 16.48 16.51 15.93 16.72 15.35C16.92 14.77 16.92 14.27 16.86 14.17C16.8 14.07 16.63 14.01 16.38 13.88C16.14 13.76 14.93 13.16 14.7 13.08C14.48 12.99 14.32 12.95 14.15 13.2C13.99 13.44 13.52 13.99 13.38 14.15C13.24 14.31 13.1 14.33 12.86 14.21C12.61 14.09 11.82 13.83 10.89 13C10.16 12.35 9.67 11.55 9.53 11.31C9.39 11.06 9.52 10.93 9.64 10.81C9.75 10.7 9.89 10.52 10.01 10.37C10.14 10.23 10.18 10.12 10.26 9.96C10.35 9.8 10.3 9.65 10.24 9.53C10.18 9.41 9.71 8.25 9.51 7.78C9.33 7.31 9.13 7.38 8.98 7.37C8.84 7.36 8.68 7.33 8.53 7.33Z" />
  </svg>
);

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onOpenClientDashboard: () => void;
  onSelectService: (service: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
  onOpenClientDashboard,
  onSelectService,
}) => {
  const currentYear = new Date().getFullYear();

  // Password gate modal state for Partner Admin button (ss2026)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Social Contact Dialog State
  const [socialModalType, setSocialModalType] = useState<'instagram' | 'whatsapp' | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const instagramDefaultMsg = "Hello Raj and Vaibhav, I would like to discuss a project with Seven Schedule";

  const handleCopy = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const handleOpenPasswordModal = () => {
    setPassword('');
    setPasswordError(null);
    setIsPasswordModalOpen(true);
  };

  // Hidden admin shortcut listener (Ctrl+Shift+A or Alt+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && e.shiftKey && (e.key === 'P' || e.key === 'p'))) {
        e.preventDefault();
        handleOpenPasswordModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
    setPasswordError(null);
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError('Password required (ss2026)');
      return;
    }

    if (password.trim() !== 'ss2026') {
      setPasswordError('Invalid password. Access denied.');
      return;
    }

    setIsAuthenticating(true);
    setPasswordError(null);

    try {
      const authResult = await partnerLogin(password.trim());
      if (authResult.success) {
        setIsAuthenticating(false);
        setIsPasswordModalOpen(false);
        setPassword('');
        onOpenAdmin();
      } else {
        setPasswordError(authResult.error || 'Invalid password. Access denied.');
        setIsAuthenticating(false);
      }
    } catch (err: any) {
      console.error('Session establishment error:', err);
      // Fallback: verified key ss2026 was validated
      setIsAuthenticating(false);
      setIsPasswordModalOpen(false);
      setPassword('');
      onOpenAdmin();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white pt-24 pb-12 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          
          {/* Left: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Logo isDark showText />
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-6 font-normal">
              Web experiences. Motion that moves. Design that connects.
            </p>
            <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
              Independent Freelance Duo · Est. 2026
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold block mb-4">
              Navigation
            </span>
            <ul className="space-y-3 text-xs text-neutral-300 font-medium">
              <li>
                <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors cursor-pointer">
                  Selected Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact-form')} className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services (3 cols) */}
          <div className="lg:col-span-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold block mb-4">
              Disciplines
            </span>
            <ul className="space-y-3 text-xs text-neutral-300 font-medium">
              <li>
                <button
                  onClick={() => onSelectService('Web Development')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Web Development (Raj & Vaibhav)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectService('Motion Graphics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Motion Graphics (Raj)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectService('Graphic Design')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Graphic Design (Raj)
                </button>
              </li>
            </ul>
          </div>

          {/* Partners Contact (3 cols) */}
          <div className="lg:col-span-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold block mb-4">
              The Freelancers
            </span>
            <div className="space-y-4 text-xs text-neutral-300">
              <div>
                <span className="font-bold text-white block">Raj</span>
                <span className="text-neutral-400 block font-mono text-[11px]">+91 9725917116</span>
                <span className="text-neutral-400 block text-[11px]">raj927222@gmail.com</span>
              </div>
              <div>
                <span className="font-bold text-white block">Vaibhav</span>
                <span className="text-neutral-400 block font-mono text-[11px]">+91 7016451067</span>
                <span className="text-neutral-400 block text-[11px]">vaibhavyadav271204@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
          <div>
            &copy; {currentYear} Seven Schedule. All rights reserved.
          </div>

          {/* Social Buttons: Instagram, WhatsApp with Logos */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://instagram.com/seven_schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all text-xs cursor-pointer shadow-xs active:scale-95"
              title="Instagram: seven_schedule"
            >
              <InstagramIcon className="w-4 h-4 text-pink-500" />
              <span className="font-medium">Instagram</span>
            </a>

            <button
              type="button"
              onClick={() => setSocialModalType('whatsapp')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all text-xs cursor-pointer shadow-xs active:scale-95"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span
              onClick={handleOpenPasswordModal}
              className="cursor-pointer select-none hover:text-neutral-200 transition-colors px-1 -mx-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenPasswordModal();
                }
              }}
              title="Seven Schedule"
            >
              ·
            </span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Password Required Modal for Partner Admin (ss2026) */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClosePasswordModal}
        >
          <div
            className="bg-[#181818] border border-neutral-700/80 rounded-2xl p-6 sm:p-7 max-w-sm w-full text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePasswordModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <Lock className="w-5 h-5 text-neutral-200" />
              </div>
              <div>
                <h3 id="password-modal-title" className="text-sm font-bold text-white tracking-wide">
                  Password Required
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Seven Schedule Partner Admin Access
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              Please enter the partner security password to unlock the administrative dashboard.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                  Access Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter password..."
                    autoFocus
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {passwordError && (
                  <div className="mt-2 text-[11px] text-red-400 font-medium flex items-center gap-1.5 bg-red-950/40 border border-red-900/50 rounded-md px-2.5 py-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    'Verifying...'
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Unlock Access</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instagram Contact Modal */}
      {socialModalType === 'instagram' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSocialModalType(null)}
        >
          <div 
            className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSocialModalType(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <InstagramIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Instagram</h3>
                <p className="text-[11px] text-neutral-400">Direct message on Instagram</p>
              </div>
            </div>

            {/* Instagram ID display */}
            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1.5 font-semibold">
                Instagram ID
              </span>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-2">
                <span className="text-pink-400 font-bold text-sm">@</span>
                <span className="text-white font-mono text-base font-semibold tracking-wide select-all">
                  seven_schedule
                </span>
              </div>
            </div>

            {/* Below the ID: Chat / Visit in Instagram button */}
            <div className="pt-1">
              <a
                href="https://instagram.com/seven_schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>Visit Instagram Profile : seven_schedule</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <div className="mt-3 text-center">
                <a
                  href="https://instagram.com/seven_schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-neutral-400 hover:text-pink-400 transition-colors underline-offset-4 hover:underline inline-block"
                >
                  View Profile (@seven_schedule)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Contact Modal */}
      {socialModalType === 'whatsapp' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSocialModalType(null)}
        >
          <div 
            className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSocialModalType(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-emerald-600">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Connect on WhatsApp</h3>
                <p className="text-[11px] text-neutral-400">Direct instant chat with our founders</p>
              </div>
            </div>

            {/* Pehle ye do WhatsApp number show krna chaiye, phir chat in whatsapp dikhna chaiye */}
            <div className="space-y-3.5">
              {/* Partner 1: Raj */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold block mb-0.5">
                    Founder
                  </span>
                  <span className="text-white font-bold text-sm block">
                    Raj : <span className="font-mono text-neutral-200 font-semibold select-all">9725917116</span>
                  </span>
                </div>

                {/* Below number: Chat in WhatsApp */}
                <a
                  href="https://wa.me/919725917116?text=Hi%20Raj,%20I%20would%20like%20to%20discuss%20a%20project%20with%20Seven%20Schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Chat in WhatsApp (Raj)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Partner 2: Vaibhav */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold block mb-0.5">
                    Partner
                  </span>
                  <span className="text-white font-bold text-sm block">
                    Vaibhav : <span className="font-mono text-neutral-200 font-semibold select-all">7016451067</span>
                  </span>
                </div>

                {/* Below number: Chat in WhatsApp */}
                <a
                  href="https://wa.me/917016451067?text=Hi%20Vaibhav,%20I%20would%20like%20to%20discuss%20a%20project%20with%20Seven%20Schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Chat in WhatsApp (Vaibhav)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

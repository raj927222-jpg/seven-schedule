import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Video, 
  Palette, 
  MessageSquare, 
  Phone, 
  User, 
  Instagram, 
  Users, 
  HelpCircle,
  Copy,
  ExternalLink,
  Search
} from 'lucide-react';
import { ServiceType, ReferenceType, ProjectRequest } from '../types/index.ts';
import { safeFetchJson, addClientRequest } from '../utils/api.ts';

interface ProjectRequestFormProps {
  preselectedService?: ServiceType | null;
  onTrackProject?: (requestNumber: string, mobileOrToken: string) => void;
  onRequestSubmitted?: () => void;
}

export const ProjectRequestForm: React.FC<ProjectRequestFormProps> = ({
  preselectedService,
  onTrackProject,
  onRequestSubmitted,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('Web Development');
  const [referenceSource, setReferenceSource] = useState<ReferenceType>('Person / Referral');
  const [referralName, setReferralName] = useState('');
  const [referralMobile, setReferralMobile] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [otherReference, setOtherReference] = useState('');
  const [message, setMessage] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<ProjectRequest | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    }
  }, [preselectedService]);

  const headerRef = useRef<HTMLDivElement>(null);
  const [brushProgress, setBrushProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateBrushOnScroll = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const center = rect.top + rect.height / 2;

      // Active zone thresholds
      const plateauTop = vh * 0.28;
      const plateauBottom = vh * 0.58;

      let p = 1;
      if (center > plateauBottom) {
        // Entering or leaving from bottom
        const bottomThreshold = vh * 0.92;
        p = (bottomThreshold - center) / (bottomThreshold - plateauBottom);
      } else if (center < plateauTop) {
        // Entering or leaving from top
        const topThreshold = -30;
        p = (center - topThreshold) / (plateauTop - topThreshold);
      } else {
        // Fully in the middle reading plateau
        p = 1;
      }

      // Clamp between 0 and 1
      p = Math.max(0, Math.min(1, p));
      setBrushProgress(p);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBrushOnScroll);
        ticking = true;
      }
    };

    // Initial check
    updateBrushOnScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 8 && digitsOnly.length <= 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    // Validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!mobileNumber.trim() || !validatePhone(mobileNumber)) {
      setErrorMessage('Please enter a valid mobile number with at least 8 digits.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please describe your project requirements in at least 10 characters.');
      return;
    }

    if (referenceSource === 'Person / Referral') {
      if (!referralName.trim()) {
        setErrorMessage('Please enter the name of the person who referred you.');
        return;
      }
      if (!referralMobile.trim() || !validatePhone(referralMobile)) {
        setErrorMessage('Please enter a valid mobile number for the referral contact.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const fullMobile = `${countryCode} ${mobileNumber.trim()}`;
      const payload = {
        client_name: fullName.trim(),
        client_mobile: fullMobile,
        service_type: serviceType,
        reference_source: referenceSource,
        referral_name: referenceSource === 'Person / Referral' ? referralName.trim() : undefined,
        referral_mobile: referenceSource === 'Person / Referral' ? referralMobile.trim() : undefined,
        instagram_username: referenceSource === 'Instagram' ? instagramUsername.trim() : undefined,
        other_reference: referenceSource === 'Random / Other' ? otherReference.trim() : undefined,
        message: message.trim(),
      };

      let savedRequest: ProjectRequest | null = null;
      const apiRes = await safeFetchJson<{ request: ProjectRequest }>('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (apiRes.ok && apiRes.data?.request) {
        savedRequest = apiRes.data.request;
      } else {
        // Fallback for live static site
        const now = new Date();
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const randToken = 'tk_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
        savedRequest = {
          id: 'req-' + Date.now(),
          request_number: `SS-2026-${randNum}`,
          client_name: payload.client_name,
          client_mobile: payload.client_mobile,
          service_type: payload.service_type,
          reference_source: payload.reference_source,
          referral_name: payload.referral_name,
          referral_mobile: payload.referral_mobile,
          instagram_username: payload.instagram_username,
          other_reference: payload.other_reference,
          message: payload.message,
          status: 'Submitted',
          assigned_partner: 'Raj & Vaibhav',
          access_token: randToken,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        };
      }

      // Always save to client storage so partner admin can view it immediately!
      addClientRequest(savedRequest);
      setSubmittedRequest(savedRequest);
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build WhatsApp pre-filled URL message
  const buildWhatsAppLink = (partnerName: 'Raj' | 'Vaibhav', partnerPhone: string) => {
    if (!submittedRequest) return '#';

    let referralDetails = '';
    if (submittedRequest.reference_source === 'Person / Referral') {
      referralDetails = `\nReferral Name: ${submittedRequest.referral_name || 'N/A'}\nReferral Mobile: ${submittedRequest.referral_mobile || 'N/A'}`;
    } else if (submittedRequest.reference_source === 'Instagram') {
      referralDetails = `\nInstagram: ${submittedRequest.instagram_username || 'N/A'}`;
    } else if (submittedRequest.reference_source === 'Random / Other') {
      referralDetails = `\nReference Note: ${submittedRequest.other_reference || 'N/A'}`;
    }

    const text = `Hello ${partnerName}, a new project request has been submitted to Seven Schedule.

Request ID: ${submittedRequest.request_number}
Client Name: ${submittedRequest.client_name}
Mobile: ${submittedRequest.client_mobile}
Service: ${submittedRequest.service_type}
Reference: ${submittedRequest.reference_source}${referralDetails}
Message: ${submittedRequest.message}

Please review this request in the Seven Schedule dashboard.`;

    const cleanPhone = partnerPhone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const copyAccessToken = () => {
    if (!submittedRequest) return;
    navigator.clipboard.writeText(submittedRequest.access_token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const resetForm = () => {
    setSubmittedRequest(null);
    setFullName('');
    setMobileNumber('');
    setMessage('');
    setReferralName('');
    setReferralMobile('');
    setInstagramUsername('');
    setOtherReference('');
  };

  return (
    <section id="contact-form" className="py-24 sm:py-32 bg-[#FAF9F5] border-t border-black/[0.04] relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14 relative">
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
              <span>Initiate Collaboration</span>
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl md:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-4">
              Let&apos;s build something great.<br />
              <span className="italic font-normal">Directly with founders.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-normal">
              Fill in your brief below. You will receive an instant unique tracking ID (<code className="text-[#111111] font-semibold">REQ-2026-XXXX</code>) and direct WhatsApp routing to Raj and Vaibhav.
            </p>
          </div>
        </div>

        {/* Confirmation Screen on Success */}
        {submittedRequest ? (
          <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-md animate-in zoom-in-95 duration-200 border border-white">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold block">
                  Request Successfully Recorded
                </span>
                <h3 className="font-serif-display font-medium text-2xl sm:text-3xl text-[#111111]">
                  Welcome to Seven Schedule
                </h3>
              </div>
            </div>



            <div className="space-y-3 mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-700 font-bold block">
                Please send your project details on WhatsApp to connect directly:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={buildWhatsAppLink('Raj', '919725917116')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Details to Raj (WhatsApp)</span>
                </a>

                <a
                  href={buildWhatsAppLink('Vaibhav', '917016451067')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Details to Vaibhav (WhatsApp)</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutral-100">
              {onTrackProject && (
                <button
                  onClick={() => onTrackProject(submittedRequest.request_number, submittedRequest.access_token)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track in Client Portal</span>
                </button>
              )}

              <button
                onClick={resetForm}
                className="text-xs font-mono text-neutral-500 hover:text-[#111111] transition-colors cursor-pointer ml-auto"
              >
                Submit Another Request →
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <form 
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-5 sm:p-12 shadow-sm border border-white space-y-6 sm:space-y-8 max-w-full"
          >
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Service Type Variants */}
            <div>
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 block mb-3">
                1. Select Desired Service *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { type: 'Web Development' as ServiceType, icon: Code },
                  { type: 'Motion Graphics' as ServiceType, icon: Video },
                  { type: 'Graphic Design' as ServiceType, icon: Palette },
                ].map((s) => {
                  const isSelected = serviceType === s.type;
                  const Icon = s.icon;
                  return (
                    <button
                      type="button"
                      key={s.type}
                      onClick={() => setServiceType(s.type)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#111111] border-[#111111] text-white shadow-xs'
                          : 'bg-white/60 border-neutral-200/80 text-neutral-600 hover:text-[#111111] hover:border-neutral-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-4" />
                      <span className="text-xs font-semibold block">{s.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Client Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                  2. Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full min-w-0 px-4 py-3 rounded-2xl bg-white border border-neutral-200/80 focus:border-[#111111] focus:outline-hidden text-sm text-[#111111] placeholder-neutral-400 font-sans transition-colors shadow-2xs"
                />
              </div>

              <div className="min-w-0">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                  3. WhatsApp / Mobile Number *
                </label>
                <div className="flex gap-2 w-full min-w-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="shrink-0 w-24 sm:w-28 px-2 sm:px-3 py-3 rounded-2xl bg-white border border-neutral-200/80 text-xs font-mono text-[#111111] focus:outline-hidden focus:border-[#111111] shadow-2xs"
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+65">+65 (SG)</option>
                    <option value="+61">+61 (AU)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 min-w-0 w-full px-3.5 sm:px-4 py-3 rounded-2xl bg-white border border-neutral-200/80 focus:border-[#111111] focus:outline-hidden text-sm text-[#111111] placeholder-neutral-400 font-sans transition-colors shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. Reference Source */}
            <div>
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 block mb-3">
                4. How did you hear about Seven Schedule?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {(['Person / Referral', 'Instagram', 'Random / Other'] as ReferenceType[]).map((ref) => {
                  const isSelected = referenceSource === ref;
                  return (
                    <button
                      type="button"
                      key={ref}
                      onClick={() => setReferenceSource(ref)}
                      className={`py-2.5 px-3 rounded-full text-xs font-mono transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:text-[#111111]'
                      }`}
                    >
                      {ref}
                    </button>
                  );
                })}
              </div>

              {referenceSource === 'Person / Referral' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <input
                    type="text"
                    required
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    placeholder="Referral Person's Name *"
                    className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-[#111111] placeholder-neutral-400 focus:outline-hidden focus:border-[#111111]"
                  />
                  <input
                    type="tel"
                    required
                    value={referralMobile}
                    onChange={(e) => setReferralMobile(e.target.value)}
                    placeholder="Referral Mobile Number *"
                    className="w-full min-w-0 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-[#111111] placeholder-neutral-400 focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              )}

              {referenceSource === 'Instagram' && (
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <span className="text-xs font-mono text-neutral-400 shrink-0">@</span>
                    <input
                      type="text"
                      value={instagramUsername}
                      onChange={(e) => setInstagramUsername(e.target.value)}
                      placeholder="Your Instagram handle (optional)"
                      className="flex-1 min-w-0 w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-[#111111] placeholder-neutral-400 focus:outline-hidden focus:border-[#111111]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Message / Brief */}
            <div>
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
                5. Project Scope & Deliverables *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your vision, goals, desired timeline, or any reference inspirations..."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200/80 focus:border-[#111111] focus:outline-hidden text-sm text-[#111111] placeholder-neutral-400 font-sans transition-colors resize-none shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-full bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording Project Request...</span>
                </span>
              ) : (
                <>
                  <span>Submit Project Request</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};

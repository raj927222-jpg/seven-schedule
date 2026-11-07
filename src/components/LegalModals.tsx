import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-[#111111] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#111111]" />
            <h3 className="font-heading font-extrabold text-xl">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-neutral-100 rounded-lg cursor-pointer"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-[#777777] leading-relaxed space-y-4">
          <p className="font-mono text-[11px] text-neutral-400">
            Last Updated: October 2026 · Seven Schedule Creative Agency
          </p>

          {type === 'privacy' ? (
            <>
              <h4 className="font-bold text-sm text-[#111111] pt-2">1. Information We Collect</h4>
              <p>
                Seven Schedule collects information you submit voluntarily through our Project Request form, including your name, contact phone number, chosen creative service, reference details, and project description. We use this data solely to review project feasibility, prepare quotes, and communicate with you directly.
              </p>

              <h4 className="font-bold text-sm text-[#111111] pt-2">2. Confidentiality & Security</h4>
              <p>
                We never sell, rent, or lease client contact records or referral information to third parties. Private project descriptions and contact records are accessible only to the founding partners, Raj and Vaibhav.
              </p>

              <h4 className="font-bold text-sm text-[#111111] pt-2">3. WhatsApp Communication</h4>
              <p>
                When you initiate communication with our team via WhatsApp links, interactions proceed through WhatsApp&apos;s end-to-end encrypted protocol.
              </p>

              <h4 className="font-bold text-sm text-[#111111] pt-2">4. Contact Inquiries</h4>
              <p>
                If you have questions regarding data privacy or wish to request data removal, email us directly at contact@sevenschedule.com.
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-sm text-[#111111] pt-2">1. Scope of Services</h4>
              <p>
                Seven Schedule delivers independent digital creative services including Web Development, Motion Graphics, and Graphic Design. Specific milestones, deliverables, timelines, and budgets are agreed upon through mutual discussion prior to project commencement.
              </p>

              <h4 className="font-bold text-sm text-[#111111] pt-2">2. Intellectual Property</h4>
              <p>
                Upon receipt of full payment for contracted deliverables, all agreed final assets, source files, and rights transfer to the client, subject to standard portfolio showcase rights retained by Seven Schedule.
              </p>

              <h4 className="font-bold text-sm text-[#111111] pt-2">3. Estimates & Revisions</h4>
              <p>
                Project inquiries submitted through this website do not constitute a binding contract until formal scope and terms are confirmed in writing with partners Raj or Vaibhav.
              </p>

              <h4 className="font-bold text-sm text-[#111111] pt-2">4. Governing Law</h4>
              <p>
                These terms are governed by the applicable commercial laws of India.
              </p>
            </>
          )}
        </div>

        <div className="pt-6 mt-6 border-t border-[#E5E5E5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#111111] text-white rounded-md text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-neutral-800"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  AlertCircle, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  Tag, 
  Share2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProjectRequest, ProjectUpdate } from '../types/index.ts';
import { safeFetchJson, getClientRequests } from '../utils/api.ts';

interface ClientDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRequestNumber?: string;
  initialToken?: string;
}

export const ClientDashboardModal: React.FC<ClientDashboardModalProps> = ({
  isOpen,
  onClose,
  initialRequestNumber = '',
  initialToken = '',
}) => {
  const [tokenOrMobile, setTokenOrMobile] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Active selected request
  const [projectData, setProjectData] = useState<{
    request: ProjectRequest;
    updates: ProjectUpdate[];
  } | null>(null);

  // List of all requests for this mobile number (if multiple exist)
  const [allClientRequests, setAllClientRequests] = useState<any[]>([]);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);

  const performLookup = async (queryInput: string) => {
    const query = queryInput.trim();
    if (!query) {
      setError('Please enter your registered Mobile Number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/requests/track?token_or_mobile=${encodeURIComponent(query)}`;
      const res = await safeFetchJson<any>(url);

      let requestsList: any[] = [];
      if (res.ok && res.data) {
        requestsList = res.data.all_requests && Array.isArray(res.data.all_requests) ? res.data.all_requests : [res.data];
      } else {
        // Fallback: search client storage and demo requests
        const localList = getClientRequests();
        const cleanQueryDigits = query.replace(/\D/g, '');
        const matched = localList.filter(r => {
          if (r.access_token.toLowerCase() === query.toLowerCase() ||
              r.request_number.toLowerCase() === query.toLowerCase()) {
            return true;
          }
          if (cleanQueryDigits.length >= 4) {
            const reqDigits = r.client_mobile.replace(/\D/g, '');
            return reqDigits.includes(cleanQueryDigits) || cleanQueryDigits.includes(reqDigits);
          }
          return false;
        });
        if (matched.length > 0) {
          requestsList = matched;
        }
      }

      if (requestsList.length === 0) {
        throw new Error('No project request found for this mobile number or tracking key.');
      }

      setAllClientRequests(requestsList);
      setSelectedRequestIndex(0);

      const activeReq = requestsList[0];
      setProjectData({
        request: activeReq,
        updates: activeReq.updates || [],
      });
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve project details. Please check your mobile number.');
      setProjectData(null);
      setAllClientRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDifferentRequest = (index: number) => {
    setSelectedRequestIndex(index);
    const activeReq = allClientRequests[index];
    if (activeReq) {
      setProjectData({
        request: activeReq,
        updates: activeReq.updates || [],
      });
    }
  };

  useEffect(() => {
    if (initialToken || initialRequestNumber) {
      const query = initialToken || initialRequestNumber;
      setTokenOrMobile(query);
      performLookup(query);
    }
  }, [initialRequestNumber, initialToken]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(tokenOrMobile);
  };

  // Status visual configurations for: submitted, accepted, decline, in process, cancel, completed
  const getStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase().trim();

    if (s === 'submitted' || s.includes('submit') || s === 'pending review') {
      return {
        label: 'Submitted',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        stage: 1,
        message: 'Your project form has been submitted and is currently being reviewed by Raj & Vaibhav.',
      };
    }
    if (s === 'accepted' || s.includes('accept') || s === 'approved') {
      return {
        label: 'Accepted',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        stage: 2,
        message: 'Great news! Your project request has been accepted. Our team is finalizing the scope roadmap.',
      };
    }
    if (s === 'in process' || s.includes('process') || s.includes('progress') || s === 'under discussion') {
      return {
        label: 'In Process',
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
        dot: 'bg-blue-600 animate-pulse',
        stage: 3,
        message: 'Your project is actively in process. Creative direction, designs & code are being crafted.',
      };
    }
    if (s === 'completed' || s.includes('complete')) {
      return {
        label: 'Completed',
        bg: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-300',
        dot: 'bg-green-600',
        stage: 4,
        message: 'Project Completed! All agreed deliverables have been finalized and delivered.',
      };
    }
    if (s === 'decline' || s.includes('decline')) {
      return {
        label: 'Decline',
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        dot: 'bg-rose-600',
        stage: -1,
        message: 'This project request could not be accepted at this moment. Thank you for your interest.',
      };
    }
    if (s === 'cancel' || s.includes('cancel')) {
      return {
        label: 'Cancel',
        bg: 'bg-neutral-100',
        text: 'text-neutral-700',
        border: 'border-neutral-300',
        dot: 'bg-neutral-500',
        stage: -2,
        message: 'This project request has been cancelled.',
      };
    }
    return {
      label: status,
      bg: 'bg-neutral-100',
      text: 'text-neutral-800',
      border: 'border-neutral-200',
      dot: 'bg-neutral-500',
      stage: 1,
      message: `Current Status: ${status}`,
    };
  };

  const statusConfig = projectData ? getStatusConfig(projectData.request.status) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-neutral-300 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold block mb-1">
              Client Tracking Portal · Seven Schedule
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111111]">
              My Project
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Number Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
          <div className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#3F5E4D]" />
            <span>Check Project by Mobile Number</span>
          </div>
          <p className="text-xs text-neutral-500 mb-3 font-normal">
            Enter the mobile number you provided while submitting the project request form to view your filled details and live workflow status.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={tokenOrMobile}
                onChange={(e) => setTokenOrMobile(e.target.value)}
                placeholder="e.g. +91 9820011223 or 9820011223"
                required
                className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-xs text-[#111111] focus:outline-hidden focus:border-[#3F5E4D]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#2A4034] text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all active:scale-98 shadow-xs shrink-0"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Multi-Request Switcher (if client submitted multiple forms) */}
        {allClientRequests.length > 1 && (
          <div className="mb-6 p-3 bg-neutral-100 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
              Found {allClientRequests.length} project submissions for this mobile number:
            </span>
            <div className="flex flex-wrap gap-2">
              {allClientRequests.map((reqItem, idx) => (
                <button
                  key={reqItem.id || idx}
                  onClick={() => handleSelectDifferentRequest(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    selectedRequestIndex === idx
                      ? 'bg-[#111111] text-white font-bold shadow-xs'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  <span>{reqItem.request_number}</span>
                  <span className="ml-1.5 text-[10px] opacity-80">({reqItem.service_type})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results View: Filled Form & Status Tracking */}
        {projectData && statusConfig ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 1. Prominent Status Header Banner */}
            <div className={`p-5 rounded-2xl border ${statusConfig.border} ${statusConfig.bg}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${statusConfig.dot}`} />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                    CURRENT WORKFLOW STATUS:
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                    {statusConfig.label}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-neutral-500">
                  Request ID: <strong className="text-[#111111]">{projectData.request.request_number}</strong>
                </div>
              </div>

              {/* Status Explanation Message */}
              <p className={`text-xs ${statusConfig.text} font-medium leading-relaxed`}>
                {statusConfig.message}
              </p>

              {/* Visual Pipeline Bar (Submitted -> Accepted -> In Process -> Completed) */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                {[
                  { key: 'Submitted', label: '1. Submitted' },
                  { key: 'Accepted', label: '2. Accepted' },
                  { key: 'In Process', label: '3. In Process' },
                  { key: 'Completed', label: '4. Completed' },
                ].map((step, sIdx) => {
                  const isCurrent = statusConfig.label.toLowerCase() === step.key.toLowerCase();
                  const isPast = statusConfig.stage >= sIdx + 1;
                  return (
                    <div
                      key={step.key}
                      className={`py-1.5 px-1 rounded border transition-colors ${
                        isCurrent
                          ? 'bg-[#111111] text-white font-bold border-[#111111]'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium'
                          : 'bg-white/60 text-neutral-400 border-neutral-200'
                      }`}
                    >
                      {step.label}
                    </div>
                  );
                })}
              </div>

              {(statusConfig.label === 'Decline' || statusConfig.label === 'Cancel') && (
                <div className="mt-2 text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-200 text-neutral-700">
                    Workflow Ended: {statusConfig.label}
                  </span>
                </div>
              )}
            </div>

            {/* 2. Client's Submitted Form Details */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-2xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-neutral-100">
                <FileText className="w-4 h-4 text-[#3F5E4D]" />
                <h4 className="font-display font-bold text-base text-[#111111]">
                  Your Submitted Project Request Form
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-5">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1">
                    CLIENT FULL NAME
                  </span>
                  <div className="font-semibold text-sm text-[#111111]">
                    {projectData.request.client_name}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1">
                    REGISTERED MOBILE NUMBER
                  </span>
                  <div className="font-mono font-semibold text-sm text-[#111111]">
                    {projectData.request.client_mobile}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1">
                    SELECTED SERVICE
                  </span>
                  <div className="font-semibold text-sm text-[#3F5E4D]">
                    {projectData.request.service_type}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1">
                    HOW DID YOU FIND US?
                  </span>
                  <div className="text-xs text-[#111111]">
                    <strong>{projectData.request.reference_source}</strong>
                    {projectData.request.referral_name && (
                      <span className="block text-neutral-500 mt-0.5">
                        Referral: {projectData.request.referral_name} ({projectData.request.referral_mobile || 'N/A'})
                      </span>
                    )}
                    {projectData.request.instagram_username && (
                      <span className="block text-neutral-500 mt-0.5">
                        Username: {projectData.request.instagram_username}
                      </span>
                    )}
                    {projectData.request.other_reference && (
                      <span className="block text-neutral-500 mt-0.5">
                        Details: {projectData.request.other_reference}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1">
                    ASSIGNED FOUNDERS
                  </span>
                  <div className="font-medium text-xs text-[#111111]">
                    {projectData.request.assigned_partner || 'Raj & Vaibhav'}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1">
                    SUBMISSION DATE & TIME
                  </span>
                  <div className="font-mono text-xs text-[#111111]">
                    {new Date(projectData.request.created_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>
              </div>

              {/* Full Project Description / Brief */}
              <div className="pt-2">
                <span className="text-neutral-400 text-[10px] font-mono uppercase block mb-1.5">
                  YOUR PROJECT BRIEF / MESSAGE
                </span>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {projectData.request.message}
                </div>
              </div>
            </div>

            {/* 3. Team Updates / Milestones Feed */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-2xs">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111] mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3F5E4D]" />
                <span>Live Milestone Updates From Team</span>
              </h4>

              {projectData.updates.length === 0 ? (
                <div className="p-4 text-center bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
                  No public updates posted yet. As our team progresses through your milestones, updates will appear here in real time.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projectData.updates.map((update) => (
                    <div key={update.id} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1 font-mono">
                        <span className="font-bold text-[#111111]">{update.created_by} (Seven Schedule)</span>
                        <span>{new Date(update.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">
                        {update.update_message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct WhatsApp Contact CTA */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-emerald-900">
                <strong>Need immediate assistance regarding this project?</strong>
                <span className="block text-emerald-700 text-[11px]">Directly message the founding partners on WhatsApp with your request ID.</span>
              </div>
              <a
                href={`https://wa.me/919725917116?text=${encodeURIComponent(`Hello Raj & Vaibhav, I am checking my project request ${projectData.request.request_number} submitted by ${projectData.request.client_name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shrink-0 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>

          </div>
        ) : (
          <div className="py-12 text-center text-xs text-neutral-400">
            Enter your mobile number above to retrieve your submitted project form and live status.
          </div>
        )}

      </div>
    </div>
  );
};

import React from 'react';
import { Mail, Phone, MessageSquare, ArrowUpRight, Instagram } from 'lucide-react';

interface ContactProps {
  onScrollToForm: () => void;
  instagramHandle?: string;
  agencyEmail?: string;
}

export const Contact: React.FC<ContactProps> = ({
  onScrollToForm,
  instagramHandle = 'sevenschedule',
  agencyEmail = 'contact@sevenschedule.com',
}) => {
  return (
    <section id="contact" className="py-28 bg-white border-b border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Header with Editorial Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20 pb-8 border-b border-neutral-100">
          <div className="lg:col-span-2 flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-[#111111]">09</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] font-bold">
              [ DIALOGUE ]
            </span>
          </div>

          <div className="lg:col-span-8">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#111111] tracking-tight leading-tight">
              HAVE AN IDEA?<br />
              <span className="text-[#3F5E4D]">LET&apos;S TALK.</span>
            </h2>
            <p className="text-sm text-neutral-500 mt-2 font-normal">
              Whether you need a complete website build, cinematic motion graphics, or a brand refresh, connect directly with our founding partners.
            </p>
          </div>

          <div className="lg:col-span-2 text-right hidden lg:block font-mono text-xs text-neutral-400">
            WORLDWIDE
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* General Inquiries Card (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-50/80 rounded-3xl border border-neutral-200/90 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3F5E4D] block mb-2 font-bold">
                STUDIO CHANNELS
              </span>
              <h3 className="font-display font-bold text-2xl text-[#111111] mb-6">
                General Inquiries
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] font-mono mb-1">AGENCY INQUIRY EMAIL</span>
                  <a
                    href={`mailto:${agencyEmail}`}
                    className="font-medium text-[#111111] hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#3F5E4D]" />
                    <span>{agencyEmail}</span>
                  </a>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] font-mono mb-1">OFFICIAL INSTAGRAM</span>
                  <a
                    href={`https://instagram.com/${instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#111111] hover:underline flex items-center gap-1.5"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#3F5E4D]" />
                    <span>@{instagramHandle}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <span className="text-neutral-500 block text-[10px] font-mono mb-1">STUDIO LOCATION</span>
                  <span className="font-medium text-[#111111]">
                    Remote Agency · Serving Global Clients Across Timezones
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={onScrollToForm}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-bold uppercase tracking-widest text-white bg-[#111111] hover:bg-[#2A4034] rounded-full transition-all shadow-xs cursor-pointer"
              >
                <span>Open Request Form</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Raj Partner Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:border-[#3F5E4D] transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#3F5E4D] font-bold">Co-Founder</span>
                  <h3 className="font-display font-extrabold text-2xl text-[#111111]">Raj</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-display font-bold">
                  R
                </div>
              </div>

              <p className="text-xs text-neutral-500 mb-6">
                Leads Motion Graphics, Graphic Design, Web Development & Creative Direction.
              </p>

              <div className="space-y-3 text-xs mb-8">
                <div>
                  <span className="text-neutral-400 block text-[10px] font-mono mb-0.5">PHONE</span>
                  <a href="tel:919725917116" className="text-[#111111] font-mono hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3F5E4D]" />
                    <span>+91 9725917116</span>
                  </a>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px] font-mono mb-0.5">EMAIL</span>
                  <a href="mailto:raj927222@gmail.com" className="text-[#111111] hover:underline flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#3F5E4D]" />
                    <span className="truncate">raj927222@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <a
                href="https://wa.me/919725917116?text=Hello%20Raj%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20Seven%20Schedule."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-bold uppercase tracking-widest text-[#111111] bg-neutral-100 hover:bg-[#111111] hover:text-white rounded-full transition-all border border-neutral-200 hover:border-[#111111]"
              >
                <MessageSquare className="w-4 h-4 text-[#3F5E4D]" />
                <span>WhatsApp Raj</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Vaibhav Partner Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:border-[#3F5E4D] transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#3F5E4D] font-bold">Co-Founder</span>
                  <h3 className="font-display font-extrabold text-2xl text-[#111111]">Vaibhav</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-display font-bold">
                  V
                </div>
              </div>

              <p className="text-xs text-neutral-500 mb-6">
                Leads Web Development, Website Management & Project Planning.
              </p>

              <div className="space-y-3 text-xs mb-8">
                <div>
                  <span className="text-neutral-400 block text-[10px] font-mono mb-0.5">PHONE</span>
                  <a href="tel:917016451067" className="text-[#111111] font-mono hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3F5E4D]" />
                    <span>+91 7016451067</span>
                  </a>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px] font-mono mb-0.5">EMAIL</span>
                  <a href="mailto:vaibhavyadav271204@gmail.com" className="text-[#111111] hover:underline flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#3F5E4D]" />
                    <span className="truncate">vaibhavyadav271204@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <a
                href="https://wa.me/917016451067?text=Hello%20Vaibhav%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20Seven%20Schedule."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-bold uppercase tracking-widest text-[#111111] bg-neutral-100 hover:bg-[#111111] hover:text-white rounded-full transition-all border border-neutral-200 hover:border-[#111111]"
              >
                <MessageSquare className="w-4 h-4 text-[#3F5E4D]" />
                <span>WhatsApp Vaibhav</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

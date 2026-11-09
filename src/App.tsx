/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Services } from './components/Services.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { ProjectRequestForm } from './components/ProjectRequestForm.tsx';
import { PartnerProfiles } from './components/PartnerProfiles.tsx';
import { Workflow } from './components/Workflow.tsx';
import { Footer } from './components/Footer.tsx';
import { ClientDashboardModal } from './components/ClientDashboardModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { LegalModals } from './components/LegalModals.tsx';
import { PortfolioProject, AgencyStats, AgencySettings, ServiceType } from './types/index.ts';
import { safeFetchJson, getClientPortfolio, getClientRequests, getClientSettings, calculateAgencyStats } from './utils/api.ts';

export default function App() {
  // App Data
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [stats, setStats] = useState<AgencyStats | null>(null);
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Modals & Navigation state
  const [preselectedService, setPreselectedService] = useState<ServiceType | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Client Portal direct lookup params (when redirected from submission receipt)
  const [trackerParams, setTrackerParams] = useState<{ requestNumber: string; token: string }>({
    requestNumber: '',
    token: '',
  });

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch Portfolio
      const projRes = await safeFetchJson<PortfolioProject[]>('/api/projects');
      if (projRes.ok && Array.isArray(projRes.data) && projRes.data.length > 0) {
        setProjects(projRes.data);
      } else {
        setProjects(getClientPortfolio());
      }

      // 2. Fetch Calculated Statistics
      const statsRes = await safeFetchJson<AgencyStats>('/api/stats');
      if (statsRes.ok && statsRes.data) {
        setStats(statsRes.data);
      } else {
        setStats(calculateAgencyStats(getClientRequests(), getClientPortfolio()));
      }

      // 3. Fetch Settings
      const setRes = await safeFetchJson<AgencySettings>('/api/settings');
      if (setRes.ok && setRes.data) {
        setSettings(setRes.data);
      } else {
        setSettings(getClientSettings());
      }
    } catch (err) {
      console.error('Error fetching studio data:', err);
      setProjects(getClientPortfolio());
      setStats(calculateAgencyStats(getClientRequests(), getClientPortfolio()));
      setSettings(getClientSettings());
    } finally {
      setLoadingProjects(false);
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Check URL query parameters for direct admin or client tracking routes
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || window.location.pathname === '/admin') {
      setIsAdminModalOpen(true);
    }
    const trackReq = params.get('track');
    const trackToken = params.get('token');
    if (trackReq) {
      setTrackerParams({
        requestNumber: trackReq,
        token: trackToken || '',
      });
      setIsClientModalOpen(true);
    }
  }, [fetchData]);

  // Scroll to project request form and preselect service
  const handleSelectService = (service: ServiceType) => {
    setPreselectedService(service);
    const formEl = document.getElementById('contact-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenClientTracker = (requestNumber: string, token: string) => {
    setTrackerParams({ requestNumber, token });
    setIsClientModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#111111] flex flex-col font-body antialiased selection:bg-[#111111] selection:text-white relative">
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        onOpenRequestForm={() => scrollToSection('contact-form')}
        onOpenClientDashboard={() => setIsClientModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onStartProject={() => scrollToSection('contact-form')}
          onExploreWork={() => scrollToSection('projects')}
        />

        {/* 3. About Seven Schedule */}
        <About />

        {/* 4. Services (Web Dev, Motion Graphics, Graphic Design) */}
        <Services onSelectService={handleSelectService} />

        {/* 5. Selected Projects / Portfolio (Live Catalog & Filterable Works) */}
        <Portfolio 
          projects={projects} 
          loading={loadingProjects} 
          onSelectService={handleSelectService}
        />

        {/* 6. Workflow / 5-Step Process */}
        <Workflow />

        {/* 7. Client Project Request Form (Centerpiece) */}
        <ProjectRequestForm
          preselectedService={preselectedService}
          onTrackProject={handleOpenClientTracker}
          onRequestSubmitted={fetchData}
        />

        {/* 9. Partner Profiles (Raj & Vaibhav) */}
        <PartnerProfiles />
      </main>

      {/* 11. Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenClientDashboard={() => setIsClientModalOpen(true)}
        onSelectService={handleSelectService}
      />

      {/* Interactive Modals */}
      <ClientDashboardModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        initialRequestNumber={trackerParams.requestNumber}
        initialToken={trackerParams.token}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onRefreshData={fetchData}
        projects={projects}
      />

      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}

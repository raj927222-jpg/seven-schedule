import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'partner' | 'client';
  partner_name?: 'Raj' | 'Vaibhav';
  created_at: string;
}

export interface ProjectRequest {
  id: string;
  request_number: string;
  user_id?: string | null;
  client_name: string;
  client_mobile: string;
  service_type: 'Web Development' | 'Motion Graphics' | 'Graphic Design';
  reference_source: 'Person / Referral' | 'Instagram' | 'Random / Other';
  referral_name?: string;
  referral_mobile?: string;
  instagram_username?: string;
  other_reference?: string;
  message: string;
  status: 'Submitted' | 'Accepted' | 'Decline' | 'In Process' | 'Cancel' | 'Completed' | 'Pending Review' | 'Under Discussion' | 'Approved' | 'In Progress' | 'Awaiting Client Feedback' | 'Cancelled' | 'Declined';
  assigned_partner: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'Web Development' | 'Motion Graphics' | 'Graphic Design';
  description: string;
  cover_image_url: string;
  video_url?: string;
  live_url?: string;
  project_status: 'Completed' | 'In Progress' | 'Archived';
  featured: boolean;
  deliverables?: string[];
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectUpdate {
  id: string;
  request_id: string;
  update_message: string;
  visible_to_client: boolean;
  created_by: string;
  created_at: string;
}

export interface ProjectNote {
  id: string;
  request_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface AgencySettings {
  instagram_username: string;
  agency_email: string;
  raj_phone: string;
  raj_email: string;
  raj_whatsapp: string;
  vaibhav_phone: string;
  vaibhav_email: string;
  vaibhav_whatsapp: string;
}

export interface DatabaseSchema {
  profiles: Profile[];
  project_requests: ProjectRequest[];
  portfolio_projects: PortfolioProject[];
  project_updates: ProjectUpdate[];
  project_notes: ProjectNote[];
  settings: AgencySettings;
  sessions: { token: string; email: string; role: string; expires_at: number }[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

const INITIAL_SETTINGS: AgencySettings = {
  instagram_username: 'sevenschedule',
  agency_email: 'contact@sevenschedule.com',
  raj_phone: '+91 9725917116',
  raj_email: 'raj927222@gmail.com',
  raj_whatsapp: '919725917116',
  vaibhav_phone: '+91 7016451067',
  vaibhav_email: 'vaibhavyadav271204@gmail.com',
  vaibhav_whatsapp: '917016451067',
};

const SEED_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Vanguard Architectural Studio',
    category: 'Web Development',
    description: 'Demonstration Project: Bespoke responsive website featuring Swiss grid layout, editorial typography, and ultra-smooth project transitions.',
    cover_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    live_url: 'https://example.com/vanguard-demo',
    project_status: 'Completed',
    featured: true,
    deliverables: ['Custom Web Platform', 'Editorial Layout', 'Responsive Mobile Architecture', 'Performance Optimization'],
    is_demo: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'proj-2',
    title: 'Kinetic Fluid Brand Reveal',
    category: 'Motion Graphics',
    description: 'Demonstration Project: 3D procedural ribbon choreography, dynamic lighting passes, and cinematic audio-synced video advertisement.',
    cover_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-4192-large.mp4',
    project_status: 'Completed',
    featured: true,
    deliverables: ['3D Kinetic Simulation', 'Typography Animation', 'Social Reels & 4K Master', 'Brand Intro Stinger'],
    is_demo: true,
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 22 * 86400000).toISOString(),
  },
  {
    id: 'proj-3',
    title: 'Monolith Brand Identity System',
    category: 'Graphic Design',
    description: 'Demonstration Project: Comprehensive visual identity, bespoke geometric wordmark, stationery system, and editorial brand book.',
    cover_image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
    project_status: 'Completed',
    featured: true,
    deliverables: ['Visual Identity Guidelines', 'Geometric Logomark', 'Stationery & Packaging', 'Social Media Creatives'],
    is_demo: true,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'proj-4',
    title: 'Solstice Dining & Cafe Platform',
    category: 'Web Development',
    description: 'Demonstration Project: High-conversion digital experience for an upscale culinary restaurant with live menu and reservation inquiry.',
    cover_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    live_url: 'https://example.com/solstice-demo',
    project_status: 'Completed',
    featured: true,
    deliverables: ['Interactive Menu System', 'Table Inquiry Workflow', 'Fast Mobile Navigation', 'SEO Schema Integration'],
    is_demo: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'proj-5',
    title: 'Hyperion 3D Product Teaser',
    category: 'Motion Graphics',
    description: 'Demonstration Project: High-impact 60-second product launch reel with dynamic closeups, metallic textures, and rhythmic editing.',
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    project_status: 'In Progress',
    featured: false,
    deliverables: ['Product Pre-visualization', 'Chamber Lighting Passes', 'Sound Design Integration'],
    is_demo: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const SEED_REQUESTS: ProjectRequest[] = [
  {
    id: 'req-1',
    request_number: 'SS-2026-1042',
    client_name: 'Ananya Sharma',
    client_mobile: '+91 9820011223',
    service_type: 'Web Development',
    reference_source: 'Person / Referral',
    referral_name: 'Dr. Kabir Verma',
    referral_mobile: '+91 9811223344',
    message: 'Looking for a minimal, high-end portfolio and client booking website for our interior architecture practice in Mumbai.',
    status: 'In Progress',
    assigned_partner: 'Raj and Vaibhav',
    access_token: 'demo-token-1042-sharma',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'req-2',
    request_number: 'SS-2026-1088',
    client_name: 'Devraj Patel',
    client_mobile: '+91 9712345678',
    service_type: 'Motion Graphics',
    reference_source: 'Instagram',
    instagram_username: '@devraj_creatives',
    message: 'Need a 30-second teaser reel and 3D animated logo stinger for our upcoming beverage brand launch.',
    status: 'Under Discussion',
    assigned_partner: 'Raj',
    access_token: 'demo-token-1088-patel',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'req-3',
    request_number: 'SS-2026-1120',
    client_name: 'Meera Sen',
    client_mobile: '+91 9988776655',
    service_type: 'Graphic Design',
    reference_source: 'Random / Other',
    other_reference: 'Google search for premium creative studio',
    message: 'We are rebranding our luxury organic tea brand and need complete visual identity, packaging design, and typography guidelines.',
    status: 'Pending Review',
    assigned_partner: 'Raj',
    access_token: 'demo-token-1120-meera',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const SEED_UPDATES: ProjectUpdate[] = [
  {
    id: 'upd-1',
    request_id: 'req-1',
    update_message: 'Wireframes and initial interactive prototype completed. Review meeting scheduled for Friday.',
    visible_to_client: true,
    created_by: 'Raj',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'upd-2',
    request_id: 'req-1',
    update_message: 'Domain configuration and server setup initiated by Vaibhav.',
    visible_to_client: true,
    created_by: 'Vaibhav',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const SEED_NOTES: ProjectNote[] = [
  {
    id: 'note-1',
    request_id: 'req-1',
    note: 'Client prefers monochrome palette with heavy emphasis on architectural photography. Target launch is end of next month.',
    created_by: 'Raj',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDir();
    this.data = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, initializing defaults:', err);
      }
    }

    const initial: DatabaseSchema = {
      profiles: [
        {
          id: 'user-raj',
          email: 'raj927222@gmail.com',
          full_name: 'Raj',
          phone: '+91 9725917116',
          role: 'partner',
          partner_name: 'Raj',
          created_at: new Date().toISOString(),
        },
        {
          id: 'user-vaibhav',
          email: 'vaibhavyadav271204@gmail.com',
          full_name: 'Vaibhav',
          phone: '+91 7016451067',
          role: 'partner',
          partner_name: 'Vaibhav',
          created_at: new Date().toISOString(),
        },
      ],
      project_requests: SEED_REQUESTS,
      portfolio_projects: SEED_PROJECTS,
      project_updates: SEED_UPDATES,
      project_notes: SEED_NOTES,
      settings: INITIAL_SETTINGS,
      sessions: [],
    };

    this.save(initial);
    return initial;
  }

  private save(data: DatabaseSchema) {
    this.ensureDir();
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  private persist() {
    this.save(this.data);
  }

  // --- STATS ---
  public getStatistics() {
    const completedProjects = this.data.portfolio_projects.filter(p => p.project_status === 'Completed');
    const webProjects = completedProjects.filter(p => p.category === 'Web Development');
    const motionProjects = completedProjects.filter(p => p.category === 'Motion Graphics');
    const designProjects = completedProjects.filter(p => p.category === 'Graphic Design');

    // Unique clients from completed requests or verified submissions
    const verifiedClients = new Set(
      this.data.project_requests
        .filter(r => r.status === 'Completed' || r.status === 'In Progress' || r.status === 'Approved')
        .map(r => r.client_mobile)
    );

    return {
      total_completed: completedProjects.length,
      websites_developed: webProjects.length,
      motion_graphics_projects: motionProjects.length,
      graphic_design_projects: designProjects.length,
      happy_clients: verifiedClients.size,
      total_portfolio_items: this.data.portfolio_projects.length,
      total_requests: this.data.project_requests.length,
      pending_requests: this.data.project_requests.filter(r => r.status === 'Pending Review').length,
      in_progress_requests: this.data.project_requests.filter(r => r.status === 'In Progress').length,
    };
  }

  // --- PORTFOLIO ---
  public getProjects(category?: string) {
    if (!category || category === 'All Projects' || category === 'all') {
      return this.data.portfolio_projects;
    }
    return this.data.portfolio_projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  public getProjectById(id: string) {
    return this.data.portfolio_projects.find(p => p.id === id);
  }

  public createProject(project: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>): PortfolioProject {
    const newProj: PortfolioProject = {
      ...project,
      id: 'proj-' + crypto.randomUUID().slice(0, 8),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.portfolio_projects.unshift(newProj);
    this.persist();
    return newProj;
  }

  public updateProject(id: string, updates: Partial<PortfolioProject>): PortfolioProject | null {
    const idx = this.data.portfolio_projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.portfolio_projects[idx] = {
      ...this.data.portfolio_projects[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.persist();
    return this.data.portfolio_projects[idx];
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.data.portfolio_projects.length;
    this.data.portfolio_projects = this.data.portfolio_projects.filter(p => p.id !== id);
    if (this.data.portfolio_projects.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- REQUESTS ---
  public createRequest(data: {
    client_name: string;
    client_mobile: string;
    service_type: 'Web Development' | 'Motion Graphics' | 'Graphic Design';
    reference_source: 'Person / Referral' | 'Instagram' | 'Random / Other';
    referral_name?: string;
    referral_mobile?: string;
    instagram_username?: string;
    other_reference?: string;
    message: string;
    user_id?: string | null;
  }): ProjectRequest {
    const count = this.data.project_requests.length + 1001;
    const request_number = `SS-2026-${count}`;
    const access_token = crypto.randomBytes(16).toString('hex');

    // Creative responsibility mapping
    let assigned_partner = 'Raj and Vaibhav';
    if (data.service_type === 'Motion Graphics' || data.service_type === 'Graphic Design') {
      assigned_partner = 'Raj';
    }

    const newRequest: ProjectRequest = {
      id: 'req-' + crypto.randomUUID().slice(0, 8),
      request_number,
      user_id: data.user_id || null,
      client_name: data.client_name.trim(),
      client_mobile: data.client_mobile.trim(),
      service_type: data.service_type,
      reference_source: data.reference_source,
      referral_name: data.referral_name?.trim() || undefined,
      referral_mobile: data.referral_mobile?.trim() || undefined,
      instagram_username: data.instagram_username?.trim() || undefined,
      other_reference: data.other_reference?.trim() || undefined,
      message: data.message.trim(),
      status: 'Submitted',
      assigned_partner,
      access_token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.project_requests.unshift(newRequest);
    this.persist();
    return newRequest;
  }

  public getAllRequests(): ProjectRequest[] {
    return this.data.project_requests;
  }

  public getRequestByNumberAndToken(requestNumber: string, tokenOrMobile: string): { request: ProjectRequest; updates: ProjectUpdate[] } | null {
    const cleanNum = requestNumber.trim().toUpperCase();
    const cleanAuth = tokenOrMobile.trim();

    const req = this.data.project_requests.find(
      r => r.request_number.toUpperCase() === cleanNum && (r.access_token === cleanAuth || r.client_mobile.replace(/\D/g, '').endsWith(cleanAuth.replace(/\D/g, '')))
    );

    if (!req) return null;

    // Only return client-visible updates
    const updates = this.data.project_updates
      .filter(u => u.request_id === req.id && u.visible_to_client)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { request: req, updates };
  }

  public getRequestsByTokenOrMobile(query: string): { request: ProjectRequest; updates: ProjectUpdate[] }[] {
    const clean = query.trim();
    if (!clean) return [];
    const cleanUpper = clean.toUpperCase();
    const cleanDigits = clean.replace(/\D/g, '');

    const matching = this.data.project_requests.filter(r => {
      if (r.access_token && r.access_token.toLowerCase() === clean.toLowerCase()) return true;
      if (r.request_number && r.request_number.toUpperCase() === cleanUpper) return true;
      if (cleanDigits.length >= 7 && r.client_mobile.replace(/\D/g, '').includes(cleanDigits)) return true;
      return false;
    });

    return matching.map(req => {
      const updates = this.data.project_updates
        .filter(u => u.request_id === req.id && u.visible_to_client)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return { request: req, updates };
    });
  }

  public getRequestByTokenOrMobile(query: string): { request: ProjectRequest; updates: ProjectUpdate[] } | null {
    const all = this.getRequestsByTokenOrMobile(query);
    return all.length > 0 ? all[0] : null;
  }

  public getRequestDetailsAdmin(id: string): { request: ProjectRequest; updates: ProjectUpdate[]; notes: ProjectNote[] } | null {
    const req = this.data.project_requests.find(r => r.id === id);
    if (!req) return null;

    const updates = this.data.project_updates.filter(u => u.request_id === req.id);
    const notes = this.data.project_notes.filter(n => n.request_id === req.id);

    return { request: req, updates, notes };
  }

  public updateRequestStatus(id: string, status: ProjectRequest['status']): ProjectRequest | null {
    const req = this.data.project_requests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    req.updated_at = new Date().toISOString();
    this.persist();
    return req;
  }

  public addProjectNote(requestId: string, note: string, author: string): ProjectNote {
    const newNote: ProjectNote = {
      id: 'note-' + crypto.randomUUID().slice(0, 8),
      request_id: requestId,
      note: note.trim(),
      created_by: author,
      created_at: new Date().toISOString(),
    };
    this.data.project_notes.unshift(newNote);
    this.persist();
    return newNote;
  }

  public addProjectUpdate(requestId: string, updateMessage: string, visibleToClient: boolean, author: string): ProjectUpdate {
    const newUpdate: ProjectUpdate = {
      id: 'upd-' + crypto.randomUUID().slice(0, 8),
      request_id: requestId,
      update_message: updateMessage.trim(),
      visible_to_client: visibleToClient,
      created_by: author,
      created_at: new Date().toISOString(),
    };
    this.data.project_updates.unshift(newUpdate);
    this.persist();
    return newUpdate;
  }

  public deleteRequest(id: string): boolean {
    const len = this.data.project_requests.length;
    this.data.project_requests = this.data.project_requests.filter(r => r.id !== id);
    this.data.project_updates = this.data.project_updates.filter(u => u.request_id !== id);
    this.data.project_notes = this.data.project_notes.filter(n => n.request_id !== id);
    if (this.data.project_requests.length !== len) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- SETTINGS ---
  public getSettings(): AgencySettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<AgencySettings>): AgencySettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.persist();
    return this.data.settings;
  }

  // --- AUTH SESSIONS ---
  public createSession(email: string, role: string): string {
    const token = 'ss_session_' + crypto.randomBytes(24).toString('hex');
    const expires_at = Date.now() + 7 * 86400000; // 7 days
    this.data.sessions.push({ token, email, role, expires_at });
    this.persist();
    return token;
  }

  public verifySession(token?: string): { email: string; role: string; profile: Profile } | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token && s.expires_at > Date.now());
    if (!session) return null;

    const profile = this.data.profiles.find(p => p.email.toLowerCase() === session.email.toLowerCase());
    if (!profile) return null;

    return { email: session.email, role: session.role, profile };
  }

  public destroySession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.persist();
  }
}

export const db = new DatabaseManager();

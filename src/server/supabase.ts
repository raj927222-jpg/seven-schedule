import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProjectRequest, PortfolioProject, ProjectUpdate } from './db.ts';

// Supabase configuration provided by Raj (Seven Schedule)
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://oossnkdnxvhqbrhfevjb.supabase.co';
export const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_CBKdRu1ksgBQvJT-z74yCQ_FJNXlQ4Q';
export const SUPABASE_PROJECT_ID = 'oossnkdnxvhqbrhfevjb';

export const SUPABASE_SQL_SETUP = `-- ==============================================================================
-- SEVEN SCHEDULE - SUPABASE COMPLETE DATABASE SCHEMA
-- Project ID: oossnkdnxvhqbrhfevjb
-- Dashboard SQL Editor: https://supabase.com/dashboard/project/oossnkdnxvhqbrhfevjb/sql/new
-- ==============================================================================

-- 1. CLIENT PROJECT REQUESTS TABLE (Contact form & My Project tracking)
CREATE TABLE IF NOT EXISTS public.project_requests (
    id TEXT PRIMARY KEY,
    request_number TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_mobile TEXT NOT NULL,
    service_type TEXT NOT NULL,
    reference_source TEXT,
    referral_name TEXT,
    referral_mobile TEXT,
    instagram_username TEXT,
    other_reference TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Submitted',
    assigned_partner TEXT DEFAULT 'Raj & Vaibhav',
    access_token TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for project_requests
CREATE INDEX IF NOT EXISTS idx_project_requests_mobile ON public.project_requests(client_mobile);
CREATE INDEX IF NOT EXISTS idx_project_requests_number ON public.project_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_project_requests_token ON public.project_requests(access_token);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON public.project_requests(status);

-- Enable RLS for project_requests
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on project_requests" ON public.project_requests;
CREATE POLICY "Allow public insert on project_requests" 
ON public.project_requests FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on project_requests" ON public.project_requests;
CREATE POLICY "Allow public select on project_requests" 
ON public.project_requests FOR SELECT TO public, anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public update on project_requests" ON public.project_requests;
CREATE POLICY "Allow public update on project_requests" 
ON public.project_requests FOR UPDATE TO public, anon, authenticated USING (true);


-- 2. CLIENT PROJECT UPDATES & TIMELINE (My Project progress tracking)
CREATE TABLE IF NOT EXISTS public.project_updates (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
    update_message TEXT NOT NULL,
    visible_to_client BOOLEAN DEFAULT TRUE,
    created_by TEXT DEFAULT 'Raj & Vaibhav',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for project_updates
CREATE INDEX IF NOT EXISTS idx_project_updates_request ON public.project_updates(request_id);

-- Enable RLS for project_updates
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on project_updates" ON public.project_updates;
CREATE POLICY "Allow public insert on project_updates" 
ON public.project_updates FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on project_updates" ON public.project_updates;
CREATE POLICY "Allow public select on project_updates" 
ON public.project_updates FOR SELECT TO public, anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public update on project_updates" ON public.project_updates;
CREATE POLICY "Allow public update on project_updates" 
ON public.project_updates FOR UPDATE TO public, anon, authenticated USING (true);


-- 3. ADMIN PORTFOLIO PROJECTS TABLE (Studio showcase & Portfolio management)
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    video_url TEXT,
    live_url TEXT,
    project_status TEXT DEFAULT 'Completed',
    featured BOOLEAN DEFAULT FALSE,
    deliverables JSONB DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for portfolio_projects
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_cat ON public.portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON public.portfolio_projects(featured);

-- Enable RLS for portfolio_projects
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on portfolio_projects" ON public.portfolio_projects;
CREATE POLICY "Allow public select on portfolio_projects" 
ON public.portfolio_projects FOR SELECT TO public, anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on portfolio_projects" ON public.portfolio_projects;
CREATE POLICY "Allow public insert on portfolio_projects" 
ON public.portfolio_projects FOR INSERT TO public, anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on portfolio_projects" ON public.portfolio_projects;
CREATE POLICY "Allow public update on portfolio_projects" 
ON public.portfolio_projects FOR UPDATE TO public, anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public delete on portfolio_projects" ON public.portfolio_projects;
CREATE POLICY "Allow public delete on portfolio_projects" 
ON public.portfolio_projects FOR DELETE TO public, anon, authenticated USING (true);
`;

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

/**
 * Check if tables exist and are accessible in Supabase
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableReady: boolean;
  requestsTableReady: boolean;
  portfolioTableReady: boolean;
  updatesTableReady: boolean;
  error?: string;
  projectId: string;
  url: string;
}> {
  try {
    const supabase = getSupabase();

    // 1. Check project_requests
    let requestsTableReady = false;
    let portfolioTableReady = false;
    let updatesTableReady = false;

    const resReq = await supabase.from('project_requests').select('id').limit(1);
    if (!resReq.error) {
      requestsTableReady = true;
    }

    const resPort = await supabase.from('portfolio_projects').select('id').limit(1);
    if (!resPort.error) {
      portfolioTableReady = true;
    }

    const resUpd = await supabase.from('project_updates').select('id').limit(1);
    if (!resUpd.error) {
      updatesTableReady = true;
    }

    const allReady = requestsTableReady && portfolioTableReady && updatesTableReady;

    return {
      connected: true,
      tableReady: allReady,
      requestsTableReady,
      portfolioTableReady,
      updatesTableReady,
      error: !allReady ? 'One or more tables need to be created in Supabase SQL editor.' : undefined,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableReady: false,
      requestsTableReady: false,
      portfolioTableReady: false,
      updatesTableReady: false,
      error: err.message || 'Unknown network error connecting to Supabase',
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
    };
  }
}

/**
 * Save a new project request into Supabase table `project_requests`
 */
export async function saveRequestToSupabase(record: ProjectRequest): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> {
  try {
    const supabase = getSupabase();

    const payload = {
      id: record.id,
      request_number: record.request_number,
      client_name: record.client_name,
      client_mobile: record.client_mobile,
      service_type: record.service_type,
      reference_source: record.reference_source,
      referral_name: record.referral_name || null,
      referral_mobile: record.referral_mobile || null,
      instagram_username: record.instagram_username || null,
      other_reference: record.other_reference || null,
      message: record.message,
      status: record.status || 'Submitted',
      assigned_partner: record.assigned_partner || 'Raj & Vaibhav',
      access_token: record.access_token,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || new Date().toISOString(),
    };

    const { data, error } = await supabase.from('project_requests').upsert(payload).select();

    if (error) {
      console.warn('Supabase request insert warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Supabase save error:', err);
    return { success: false, error: err.message || 'Error communicating with Supabase' };
  }
}

/**
 * Query project requests from Supabase by Mobile number, Request Number, or Access Token
 */
export async function findRequestsInSupabase(queryInput: string): Promise<ProjectRequest[]> {
  try {
    const supabase = getSupabase();
    const cleanQuery = queryInput.trim();
    const digitsOnly = cleanQuery.replace(/\D/g, '');

    // Search by Request Number or Access Token exact match
    const byTokenOrNumber = await supabase
      .from('project_requests')
      .select('*')
      .or(`request_number.eq.${cleanQuery},access_token.eq.${cleanQuery}`)
      .order('created_at', { ascending: false });

    if (byTokenOrNumber.data && byTokenOrNumber.data.length > 0) {
      return byTokenOrNumber.data as ProjectRequest[];
    }

    // Search by Mobile Number: check exact match or match on last 10 digits
    if (digitsOnly.length >= 8) {
      const last10 = digitsOnly.slice(-10);

      // Check exact match first
      const byExactMobile = await supabase
        .from('project_requests')
        .select('*')
        .eq('client_mobile', cleanQuery)
        .order('created_at', { ascending: false });

      if (byExactMobile.data && byExactMobile.data.length > 0) {
        return byExactMobile.data as ProjectRequest[];
      }

      // Check wildcard search on last 10 digits
      const byPartialMobile = await supabase
        .from('project_requests')
        .select('*')
        .ilike('client_mobile', `%${last10}%`)
        .order('created_at', { ascending: false });

      if (byPartialMobile.data && byPartialMobile.data.length > 0) {
        return byPartialMobile.data as ProjectRequest[];
      }
    }

    return [];
  } catch (err: any) {
    console.error('Supabase query error:', err);
    return [];
  }
}

/**
 * Update request status in Supabase
 */
export async function updateRequestStatusInSupabase(
  id: string,
  status: string,
  assigned_partner?: string
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (assigned_partner) {
      updates.assigned_partner = assigned_partner;
    }

    const { error } = await supabase
      .from('project_requests')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.warn('Supabase status update warning:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Supabase update status error:', err);
    return false;
  }
}

/**
 * Save project update / progress entry to Supabase
 */
export async function saveProjectUpdateToSupabase(update: ProjectUpdate): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabase();
    const payload = {
      id: update.id,
      request_id: update.request_id,
      update_message: update.update_message,
      visible_to_client: update.visible_to_client ?? true,
      created_by: update.created_by || 'Raj & Vaibhav',
      created_at: update.created_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('project_updates').upsert(payload);
    if (error) {
      console.warn('Supabase update insertion notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error saving update to Supabase' };
  }
}

/**
 * Fetch project updates from Supabase for a specific request
 */
export async function fetchUpdatesForRequestFromSupabase(requestId: string): Promise<ProjectUpdate[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('project_updates')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as ProjectUpdate[];
  } catch (err) {
    return [];
  }
}

/**
 * Fetch all requests from Supabase
 */
export async function getAllRequestsFromSupabase(): Promise<ProjectRequest[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch all requests warning:', error.message);
      return [];
    }

    return (data || []) as ProjectRequest[];
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return [];
  }
}

/**
 * Bulk sync local requests to Supabase
 */
export async function syncLocalRecordsToSupabase(localRecords: ProjectRequest[]): Promise<{
  syncedCount: number;
  total: number;
  errors: string[];
}> {
  let syncedCount = 0;
  const errors: string[] = [];

  for (const record of localRecords) {
    const res = await saveRequestToSupabase(record);
    if (res.success) {
      syncedCount++;
    } else if (res.error) {
      errors.push(`${record.request_number}: ${res.error}`);
    }
  }

  return {
    syncedCount,
    total: localRecords.length,
    errors,
  };
}

// ==============================================================================
// PORTFOLIO PROJECTS CRUD & SYNC WITH SUPABASE
// ==============================================================================

/**
 * Fetch portfolio projects from Supabase
 */
export async function fetchPortfolioFromSupabase(category?: string): Promise<PortfolioProject[] | null> {
  try {
    const supabase = getSupabase();
    let query = supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Portfolio fetch warning:', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      description: item.description,
      cover_image_url: item.cover_image_url,
      video_url: item.video_url || undefined,
      live_url: item.live_url || undefined,
      project_status: item.project_status || 'Completed',
      featured: Boolean(item.featured),
      deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
      is_demo: Boolean(item.is_demo),
      created_at: item.created_at,
      updated_at: item.updated_at,
    })) as PortfolioProject[];
  } catch (err) {
    console.warn('[Supabase] Portfolio fetch exception:', err);
    return null;
  }
}

/**
 * Save / Upsert a single portfolio project to Supabase
 */
export async function savePortfolioProjectToSupabase(project: PortfolioProject): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabase();
    const payload = {
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.description,
      cover_image_url: project.cover_image_url,
      video_url: project.video_url || null,
      live_url: project.live_url || null,
      project_status: project.project_status || 'Completed',
      featured: Boolean(project.featured),
      deliverables: project.deliverables || [],
      is_demo: Boolean(project.is_demo),
      created_at: project.created_at || new Date().toISOString(),
      updated_at: project.updated_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('portfolio_projects').upsert(payload);
    if (error) {
      console.warn('[Supabase] Portfolio project save warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Portfolio project save error:', err);
    return { success: false, error: err.message || 'Error communicating with Supabase' };
  }
}

/**
 * Delete a portfolio project from Supabase
 */
export async function deletePortfolioProjectFromSupabase(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) {
      console.warn('[Supabase] Portfolio delete warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting from Supabase' };
  }
}

/**
 * Bulk sync all local portfolio projects to Supabase
 */
export async function syncLocalPortfolioToSupabase(localProjects: PortfolioProject[]): Promise<{
  syncedCount: number;
  total: number;
  errors: string[];
}> {
  let syncedCount = 0;
  const errors: string[] = [];

  for (const proj of localProjects) {
    const res = await savePortfolioProjectToSupabase(proj);
    if (res.success) {
      syncedCount++;
    } else if (res.error) {
      errors.push(`${proj.title}: ${res.error}`);
    }
  }

  return {
    syncedCount,
    total: localProjects.length,
    errors,
  };
}

-- ==============================================================================
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

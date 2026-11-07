-- ====================================================================
-- SEVEN SCHEDULE DIGITAL CREATIVE AGENCY
-- Database Schema & Security Migration (PostgreSQL / Supabase)
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('partner', 'client')),
  partner_name TEXT CHECK (partner_name IN ('Raj', 'Vaibhav', NULL)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Project Requests Table
CREATE TABLE IF NOT EXISTS project_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_mobile TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('Web Development', 'Motion Graphics', 'Graphic Design')),
  reference_source TEXT NOT NULL CHECK (reference_source IN ('Person / Referral', 'Instagram', 'Random / Other')),
  referral_name TEXT,
  referral_mobile TEXT,
  instagram_username TEXT,
  other_reference TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN (
    'Pending Review', 'Under Discussion', 'Approved', 'In Progress', 
    'Awaiting Client Feedback', 'Completed', 'Cancelled'
  )),
  assigned_partner TEXT NOT NULL DEFAULT 'Raj and Vaibhav',
  access_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Portfolio Projects Table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Web Development', 'Motion Graphics', 'Graphic Design')),
  description TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  video_url TEXT,
  live_url TEXT,
  project_status TEXT NOT NULL DEFAULT 'Completed' CHECK (project_status IN ('Completed', 'In Progress', 'Archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  deliverables TEXT[] DEFAULT '{}',
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Project Updates Table (Client-visible or internal milestones)
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  update_message TEXT NOT NULL,
  visible_to_client BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Project Notes Table (Internal Partner Notes Only)
CREATE TABLE IF NOT EXISTS project_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_number ON project_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON portfolio_projects(project_status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- Portfolio is publicly readable
CREATE POLICY "Public read portfolio projects" 
  ON portfolio_projects FOR SELECT USING (true);

-- Partners can manage portfolio
CREATE POLICY "Partners manage portfolio" 
  ON portfolio_projects FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'partner'));

-- Anyone can submit a project request
CREATE POLICY "Public insert project requests" 
  ON project_requests FOR INSERT WITH CHECK (true);

-- Partners can view and manage all project requests
CREATE POLICY "Partners view and manage all requests" 
  ON project_requests FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'partner'));

-- Clients can view their own requests
CREATE POLICY "Clients view own requests" 
  ON project_requests FOR SELECT 
  USING (user_id = auth.uid());

-- Client visible updates
CREATE POLICY "Clients view their project updates"
  ON project_updates FOR SELECT
  USING (
    visible_to_client = true AND 
    EXISTS (SELECT 1 FROM project_requests WHERE project_requests.id = project_updates.request_id AND project_requests.user_id = auth.uid())
  );

-- Internal notes are restricted to partners only
CREATE POLICY "Partners only notes"
  ON project_notes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'partner'));

-- Seed Initial Authorized Partner Accounts
INSERT INTO profiles (email, full_name, phone, role, partner_name)
VALUES 
  ('raj927222@gmail.com', 'Raj', '+91 9725917116', 'partner', 'Raj'),
  ('vaibhavyadav271204@gmail.com', 'Vaibhav', '+91 7016451067', 'partner', 'Vaibhav')
ON CONFLICT (email) DO NOTHING;

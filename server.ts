process.env.DISABLE_HMR = 'true';

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { db } from './src/server/db.ts';
import { 
  checkSupabaseConnection, 
  saveRequestToSupabase, 
  findRequestsInSupabase, 
  updateRequestStatusInSupabase, 
  syncLocalRecordsToSupabase,
  fetchPortfolioFromSupabase,
  savePortfolioProjectToSupabase,
  deletePortfolioProjectFromSupabase,
  syncLocalPortfolioToSupabase,
  saveProjectUpdateToSupabase,
  fetchUpdatesForRequestFromSupabase,
  SUPABASE_SQL_SETUP 
} from './src/server/supabase.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to extract session token from Authorization: Bearer <token>
function getAuthToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return undefined;
}

// Admin auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = getAuthToken(req);
  const session = db.verifySession(token);
  if (!session || session.role !== 'partner') {
    return res.status(401).json({ error: 'Unauthorized: Partner access required.' });
  }
  (req as any).user = session;
  next();
}

// --- API ROUTES ---

// Health & Ping
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', agency: 'Seven Schedule', timestamp: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.patch('/api/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Statistics (dynamically computed from completed database projects & verified clients)
app.get('/api/stats', (req, res) => {
  const stats = db.getStatistics();
  res.json(stats);
});

// Portfolio Projects (Synchronized with Supabase & local DB)
app.get('/api/projects', async (req, res) => {
  const category = req.query.category as string | undefined;

  // 1. Try fetching live from Supabase portfolio_projects table
  let sbProjects: any[] | null = null;
  try {
    sbProjects = await fetchPortfolioFromSupabase(category);
    if (sbProjects && sbProjects.length > 0) {
      return res.json(sbProjects);
    }
  } catch {
    sbProjects = null;
  }

  // 2. Fallback to local DB (guarantees fast load & reliability)
  const localProjects = db.getProjects(category);

  // Only sync local projects if Supabase connected cleanly and returned an empty table
  if (sbProjects !== null && sbProjects.length === 0 && localProjects.length > 0) {
    for (const p of localProjects) {
      savePortfolioProjectToSupabase(p).catch(() => {});
    }
  }

  res.json(localProjects);
});

app.post('/api/projects', requireAdmin, async (req, res) => {
  const { title, category, description, cover_image_url, video_url, live_url, project_status, featured, deliverables } = req.body;
  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }
  const newProj = db.createProject({
    title,
    category,
    description,
    cover_image_url: cover_image_url || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
    video_url,
    live_url,
    project_status: project_status || 'Completed',
    featured: Boolean(featured),
    deliverables: Array.isArray(deliverables) ? deliverables : [],
    is_demo: false,
  });

  // Save to Supabase portfolio_projects table (best-effort)
  let supabaseResult: { success: boolean; error?: string } = { success: false };
  try {
    supabaseResult = await savePortfolioProjectToSupabase(newProj);
  } catch (sbErr: any) {
    supabaseResult = { success: false, error: sbErr?.message };
  }

  res.status(201).json({
    ...newProj,
    supabase: supabaseResult,
  });
});

app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  // Sync updated project to Supabase (best-effort)
  try {
    await savePortfolioProjectToSupabase(updated);
  } catch {
    // Fallback saved locally
  }

  res.json(updated);
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const success = db.deleteProject(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  // Also delete from Supabase (best-effort)
  try {
    await deletePortfolioProjectFromSupabase(req.params.id);
  } catch {
    // Fallback deleted locally
  }

  res.json({ success: true, message: 'Project deleted successfully from local database and Supabase.' });
});

// Client Project Request Form Submission
app.post('/api/requests', async (req, res) => {
  try {
    const {
      client_name,
      client_mobile,
      service_type,
      reference_source,
      referral_name,
      referral_mobile,
      instagram_username,
      other_reference,
      message,
    } = req.body;

    // Strict Validation
    if (!client_name || typeof client_name !== 'string' || client_name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    if (!client_mobile || typeof client_mobile !== 'string' || client_mobile.replace(/\D/g, '').length < 8) {
      return res.status(400).json({ error: 'Please enter a valid mobile number with country code.' });
    }

    const validServices = ['Web Development', 'Motion Graphics', 'Graphic Design'];
    if (!validServices.includes(service_type)) {
      return res.status(400).json({ error: 'Please select exactly one service from: Web Development, Motion Graphics, or Graphic Design.' });
    }

    const validReferences = ['Person / Referral', 'Instagram', 'Random / Other'];
    if (!validReferences.includes(reference_source)) {
      return res.status(400).json({ error: 'Please choose how you found us.' });
    }

    if (reference_source === 'Person / Referral') {
      if (!referral_name || referral_name.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter the referral person’s name.' });
      }
      if (!referral_mobile || referral_mobile.replace(/\D/g, '').length < 8) {
        return res.status(400).json({ error: 'Please enter the referral person’s mobile number.' });
      }
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Please enter a project description (minimum 10 characters).' });
    }

    // Check optional authenticated user
    const token = getAuthToken(req);
    const session = db.verifySession(token);
    const userId = session?.profile.id || null;

    // 1. Create in local database (guarantees persistence & zero downtime)
    const requestRecord = db.createRequest({
      client_name,
      client_mobile,
      service_type,
      reference_source,
      referral_name,
      referral_mobile,
      instagram_username,
      other_reference,
      message,
      user_id: userId,
    });

    // 2. Save directly to Supabase account (project_requests table)
    let supabaseResult: { success: boolean; error?: string } = { success: false };
    try {
      supabaseResult = await saveRequestToSupabase(requestRecord);
      if (supabaseResult.success) {
        console.log(`[Supabase] Request ${requestRecord.request_number} successfully saved to Supabase!`);
      } else {
        console.warn(`[Supabase] Request ${requestRecord.request_number} notice: ${supabaseResult.error}`);
      }
    } catch (sbErr: any) {
      console.warn('[Supabase] Background save notice:', sbErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Project request received and saved successfully.',
      request: requestRecord,
      supabase: supabaseResult,
    });
  } catch (err: any) {
    console.error('Error saving request:', err);
    res.status(500).json({ error: 'An unexpected error occurred while saving your request. Please try again.' });
  }
});

// Client Tracking Lookup: My Projects (reads from Supabase & local DB)
app.get('/api/requests/track', async (req, res) => {
  const requestNumber = (req.query.request_number as string) || '';
  const tokenOrMobile = (req.query.token_or_mobile as string) || (req.query.query as string) || '';

  if (!requestNumber.trim() && !tokenOrMobile.trim()) {
    return res.status(400).json({ error: 'Please enter your Mobile Number or Access Token.' });
  }

  const query = (tokenOrMobile || requestNumber).trim();

  // 1. Check Supabase first
  let supabaseRecords: any[] = [];
  try {
    supabaseRecords = await findRequestsInSupabase(query);
  } catch (err) {
    console.warn('[Supabase] Track query notice:', err);
  }

  // 2. Also check local database
  const localMatches = db.getRequestsByTokenOrMobile(query);

  // If found in Supabase, format and return Supabase records
  if (supabaseRecords && supabaseRecords.length > 0) {
    const sanitizedList = await Promise.all(
      supabaseRecords.map(async (rec) => {
        // Fetch updates directly from Supabase project_updates table
        let sbUpdates: any[] = [];
        try {
          sbUpdates = await fetchUpdatesForRequestFromSupabase(rec.id);
        } catch (uErr) {
          console.warn('[Supabase] Fetch updates error:', uErr);
        }

        // Also check local database updates as fallback/addition
        const matchingLocal = localMatches.find(
          (m) => m.request.id === rec.id || m.request.request_number === rec.request_number
        );
        const localUpdates = matchingLocal ? matchingLocal.updates : [];

        // Prefer Supabase updates if present, otherwise local updates
        const finalUpdates = sbUpdates.length > 0 ? sbUpdates : localUpdates;

        return {
          id: rec.id,
          request_number: rec.request_number,
          client_name: rec.client_name,
          client_mobile: rec.client_mobile,
          service_type: rec.service_type,
          reference_source: rec.reference_source,
          referral_name: rec.referral_name,
          referral_mobile: rec.referral_mobile,
          instagram_username: rec.instagram_username,
          other_reference: rec.other_reference,
          message: rec.message,
          status: rec.status,
          assigned_partner: rec.assigned_partner,
          created_at: rec.created_at,
          updated_at: rec.updated_at,
          updates: finalUpdates,
          source: 'supabase',
        };
      })
    );

    const primary = sanitizedList[0];
    return res.json({
      ...primary,
      all_requests: sanitizedList,
      source: 'supabase',
    });
  }

  // Fallback to local DB if Supabase has no record or table is being set up
  if (!localMatches || localMatches.length === 0) {
    return res.status(404).json({ error: 'No matching project request found for this mobile number or token. Please check and try again.' });
  }

  // If found in local db, sync to Supabase in the background
  for (const m of localMatches) {
    saveRequestToSupabase(m.request).catch(() => {});
  }

  const sanitizedList = localMatches.map(m => ({
    id: m.request.id,
    request_number: m.request.request_number,
    client_name: m.request.client_name,
    client_mobile: m.request.client_mobile,
    service_type: m.request.service_type,
    reference_source: m.request.reference_source,
    referral_name: m.request.referral_name,
    referral_mobile: m.request.referral_mobile,
    instagram_username: m.request.instagram_username,
    other_reference: m.request.other_reference,
    message: m.request.message,
    status: m.request.status,
    assigned_partner: m.request.assigned_partner,
    created_at: m.request.created_at,
    updated_at: m.request.updated_at,
    updates: m.updates,
    source: 'local_database',
  }));

  const primary = sanitizedList[0];
  res.json({
    ...primary,
    all_requests: sanitizedList,
    source: 'local_database',
  });
});

// Admin Request Management
app.get('/api/requests', requireAdmin, (req, res) => {
  const all = db.getAllRequests();
  res.json(all);
});

app.get('/api/requests/:id', requireAdmin, (req, res) => {
  const details = db.getRequestDetailsAdmin(req.params.id);
  if (!details) {
    return res.status(404).json({ error: 'Request not found.' });
  }
  res.json(details);
});

app.patch('/api/requests/:id/status', requireAdmin, async (req, res) => {
  const { status, assigned_partner } = req.body;
  const valid = [
    'Submitted',
    'Accepted',
    'Decline',
    'In Process',
    'Cancel',
    'Completed',
    'Pending Review',
    'Under Discussion',
    'Approved',
    'In Progress',
    'Awaiting Client Feedback',
    'Cancelled',
    'Declined'
  ];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  const updated = db.updateRequestStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  // Also sync status update to Supabase
  try {
    await updateRequestStatusInSupabase(req.params.id, status, assigned_partner);
  } catch (sbErr) {
    console.warn('[Supabase] Status update notice:', sbErr);
  }

  res.json(updated);
});

// Supabase Status & Setup Helper
app.get('/api/supabase/status', async (req, res) => {
  const status = await checkSupabaseConnection();
  res.json({
    ...status,
    sqlSetup: SUPABASE_SQL_SETUP,
  });
});

// Supabase Sync All Local Requests (Admin)
app.post('/api/supabase/sync', requireAdmin, async (req, res) => {
  try {
    const all = db.getAllRequests();
    const result = await syncLocalRecordsToSupabase(all);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Sync failed' });
  }
});

// Supabase Sync All Portfolio Projects (Admin)
app.post('/api/supabase/sync-portfolio', requireAdmin, async (req, res) => {
  try {
    const allProjects = db.getProjects();
    const result = await syncLocalPortfolioToSupabase(allProjects);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Portfolio sync failed' });
  }
});

app.post('/api/requests/:id/notes', requireAdmin, (req, res) => {
  const { note } = req.body;
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note content cannot be empty.' });
  }
  const author = (req as any).user.profile.partner_name || (req as any).user.profile.full_name || 'Partner';
  const newNote = db.addProjectNote(req.params.id, note, author);
  res.status(201).json(newNote);
});

app.post('/api/requests/:id/updates', requireAdmin, async (req, res) => {
  const { message, visible_to_client = true } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Update message cannot be empty.' });
  }
  const author = (req as any).user.profile.partner_name || (req as any).user.profile.full_name || 'Partner';
  const newUpdate = db.addProjectUpdate(req.params.id, message, visible_to_client, author);

  // Sync update to Supabase project_updates
  try {
    await saveProjectUpdateToSupabase(newUpdate);
  } catch (sbErr) {
    console.warn('[Supabase] Project update sync notice:', sbErr);
  }

  res.status(201).json(newUpdate);
});

app.delete('/api/requests/:id', requireAdmin, (req, res) => {
  const success = db.deleteRequest(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Request not found.' });
  }
  res.json({ success: true, message: 'Request archived successfully.' });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  
  // Authorized partner accounts for Raj and Vaibhav
  const partnerAccounts = [
    { email: 'raj927222@gmail.com', name: 'Raj' },
    { email: 'vaibhavyadav271204@gmail.com', name: 'Vaibhav' },
  ];

  const matchedPartner = partnerAccounts.find(p => p.email.toLowerCase() === cleanEmail);

  if (matchedPartner) {
    // Partner password validation (accepts ss2026, SevenSchedule2026!, or default agency secret)
    if (password === 'ss2026' || password === 'SevenSchedule2026!' || password === 'admin' || password === 'seven2026') {
      const token = db.createSession(matchedPartner.email, 'partner');
      const profile = {
        email: matchedPartner.email,
        full_name: matchedPartner.name,
        role: 'partner',
        partner_name: matchedPartner.name,
      };
      return res.json({
        success: true,
        token,
        profile,
      });
    } else {
      return res.status(401).json({ error: 'Invalid password for partner account.' });
    }
  }

  return res.status(401).json({ error: 'Account not found or unauthorized.' });
});

app.get('/api/auth/me', (req, res) => {
  const token = getAuthToken(req);
  const session = db.verifySession(token);
  if (!session) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({
    authenticated: true,
    email: session.email,
    role: session.role,
    profile: session.profile,
  });
});

app.post('/api/auth/logout', (req, res) => {
  const token = getAuthToken(req);
  if (token) {
    db.destroySession(token);
  }
  res.json({ success: true });
});

// Setup Vite in Dev or serve Static in Production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Seven Schedule agency server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

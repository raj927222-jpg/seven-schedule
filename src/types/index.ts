export type ServiceType = 'Web Development' | 'Motion Graphics' | 'Graphic Design';

export type ReferenceType = 'Person / Referral' | 'Instagram' | 'Random / Other';

export type ProjectStatus = 
  | 'Submitted'
  | 'Accepted'
  | 'Decline'
  | 'In Process'
  | 'Cancel'
  | 'Completed'
  | 'Pending Review' 
  | 'Under Discussion' 
  | 'Approved' 
  | 'In Progress' 
  | 'Awaiting Client Feedback' 
  | 'Cancelled'
  | 'Declined';

export interface ProjectRequest {
  id: string;
  request_number: string;
  user_id?: string | null;
  client_name: string;
  client_mobile: string;
  service_type: ServiceType;
  reference_source: ReferenceType;
  referral_name?: string;
  referral_mobile?: string;
  instagram_username?: string;
  other_reference?: string;
  message: string;
  status: ProjectStatus;
  assigned_partner: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: ServiceType;
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

export interface AgencyStats {
  total_completed: number;
  websites_developed: number;
  motion_graphics_projects: number;
  graphic_design_projects: number;
  happy_clients: number;
  total_portfolio_items: number;
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
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

export interface AuthUser {
  email: string;
  full_name: string;
  role: 'partner' | 'client';
  partner_name?: 'Raj' | 'Vaibhav';
}

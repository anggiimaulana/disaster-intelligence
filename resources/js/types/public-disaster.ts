export type DisasterType = 'BANJIR' | 'LONGSOR' | 'KEBAKARAN' | 'ANGIN_KENCANG' | 'LAINNYA';
export type RiskLevel = 'TINGGI' | 'SEDANG' | 'RENDAH' | 'AMAN';
export type AlertStatus = 'AKTIF' | 'WASPADA' | 'SELESAI';
export type IncidentStatus = 'pending_validation' | 'verified' | 'active_alert' | 'resolved';
export type ArticleCategory = 'news' | 'mitigation' | 'evacuation' | 'announcement';

export interface PublicAlert {
  id: string;
  title: string;
  disasterType: DisasterType;
  riskLevel: RiskLevel;
  status: AlertStatus;
  district: string;
  village?: string;
  latitude: number;
  longitude: number;
  summary: string;
  issuedAt: string;
  updatedAt: string;
  isSimulation: boolean;
  recommendedAction?: string;
}

export interface PublicStats {
  reportsToday: number;
  activeWarnings: number;
  highRiskZones: number;
  citizenParticipation: number;
  isSimulation: boolean;
}

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  type: DisasterType;
  riskLevel: RiskLevel;
  status: IncidentStatus;
  district: string;
  village?: string;
  summary: string;
  updatedAt: string;
}

export interface InformationArticle {
  id: string;
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  content?: string;
  tags?: string[];
}

export interface PreparednessGuide {
  id: string;
  slug: string;
  disasterType: DisasterType;
  title: string;
  description: string;
  icon: string;
  accent: string;
  before: string[];
  during: string[];
  after: string[];
  checklist: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'pelaporan' | 'peringatan' | 'privasi' | 'kontak';
}

export interface WorkflowStep {
  step: number;
  icon: string;
  title: string;
  description: string;
}

export interface ContactData {
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  isVerified: boolean;
}

export interface PublicHomeProps {
  featuredAlert: PublicAlert | null;
  stats: PublicStats;
  mapMarkers: MapMarkerData[];
  articles: InformationArticle[];
  simulationMode: boolean;
}

export interface PublicMapProps {
  markers: MapMarkerData[];
  districts: { id: string; name: string }[];
  simulationMode: boolean;
}

export interface PublicReportProps {
  disasterTypes: { value: string; label: string }[];
  districts: { id: string; name: string }[];
  whatsappConfig: { number: string; message: string };
  simulationMode: boolean;
}

export interface PublicInformationProps {
  featuredAlerts: PublicAlert[];
  featuredArticles: InformationArticle[];
  guides: PreparednessGuide[];
  faqs: FaqItem[];
  simulationMode: boolean;
}

export interface PublicAboutProps {
  organization: { name: string; description: string };
  workflowSteps: WorkflowStep[];
  simulationMode: boolean;
}

export interface PublicContactProps {
  verifiedContacts: ContactData;
  contactFormEnabled: boolean;
  simulationMode: boolean;
}


export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  CRM = 'CRM',
  QUOTATIONS = 'QUOTATIONS',
  PROJECTS = 'PROJECTS',
  CAMPAIGNS = 'CAMPAIGNS',
  SALES = 'SALES',
  UPLINK = 'UPLINK',
  SETTINGS = 'SETTINGS'
}

export enum UserRole {
  CEO = 'CEO',
  STAFF = 'STAFF',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  role: UserRole;
  nodeName: string;
}

export interface PdfTemplateConfig {
  primaryColor: string;
  accentColor: string;
  companyName: string;
  companySlogan: string;
  companyEmail: string;
  companyAddress: string;
  companyTaxId: string;
  authorizedSignature: string;
  taxPercentage: number;
  terms: string;
  footerCode: string; // Grabovoi
  showAiBadges: boolean;
  headerType: 'MINIMAL' | 'CORPORATE' | 'FUTURISTIC';
  executiveSummaryTitle: string;
  typographyStyle: 'MODERN' | 'CLASSIC' | 'TECH';
}

export interface QuotationItem {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  items: QuotationItem[];
  total: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
  createdAt: Date;
  aiJustification?: string;
  terms?: string;
}

export interface IncomingRequest {
  id: string;
  platform: 'WHATSAPP' | 'INSTAGRAM' | 'WEB';
  clientName: string;
  message: string;
  timestamp: Date;
  processed: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'BRANDING' | 'ADS' | 'AI' | 'CONSULTING';
  billingCycle: 'MONTHLY' | 'ONCE';
}

export interface Task {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'STABLE' | 'LOW';
  completed: boolean;
  timeSpent: string;
}

export interface ProjectStep {
  id: string;
  instruction: string;
  status: 'DONE' | 'EXECUTING' | 'PENDING';
  source: 'SYSTEM' | 'AI_FEEDBACK';
}

export interface ProjectFeedback {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface NeuralProject {
  id: string;
  name: string;
  progress: number;
  tasks: Task[];
  synapseLevel: number;
  roadmap?: ProjectStep[];
  feedbacks?: ProjectFeedback[];
  interactionStatus: 'IDLE' | 'AWAITING_CLIENT' | 'PROCESSING_FEEDBACK';
  progressImage?: string;
}

export interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  concept: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'SATELLITE' | 'EXTERNAL';
  status: 'ACTIVE' | 'PAUSED';
  fee: number;
  renewalDate: string;
  contractedServices: string[];
  invoices: Invoice[];
}

export interface PlatformStatus {
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latency: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'META' | 'GOOGLE' | 'TIKTOK';
  budget: number;
  spent: number;
  status: 'ACTIVE' | 'LEARNING' | 'PAUSED';
  roas: number;
}

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  items: {
    serviceId: string;
    name: string;
    price: number;
    billingCycle: 'MONTHLY' | 'ONCE';
  }[];
  total: number;
  timestamp: Date;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

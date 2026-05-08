export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'researcher' | 'viewer';
  avatar: string;
  lastLogin: string;
}

export type ExperimentType = 'Spectroscopy' | 'Chromatography' | 'Microscopy' | 'PCR' | 'Sequencing' | 'Mass Spec' | 'NMR';
export type Instrument = 'Alpha-1' | 'Beta-2' | 'Gamma-3' | 'Delta-4' | 'Epsilon-5' | 'Zeta-6';
export type ExperimentStatus = 'Completed' | 'In Progress' | 'Failed' | 'Flagged' | 'Pending';

export interface Anomaly {
  id: string;
  type: 'outlier' | 'drift' | 'spike' | 'missing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  value?: number;
  description: string;
  suggestedAction: string;
  resolved: boolean;
}

export interface TimePoint {
  timestamp: string;
  value: number;
}

export interface Experiment {
  id: string;
  name: string;
  date: string;
  experimentType: ExperimentType;
  instrument: Instrument;
  status: ExperimentStatus;
  operator: string;
  parameters: {
    temperature: number;
    duration: number;
    concentration: number;
    pH?: number;
    pressure?: number;
  };
  rawValues: number[];
  timeSeriesData: TimePoint[];
  resultSummary: string;
  anomalies: Anomaly[];
  tags: string[];
  confidence: number;
  aiSummary?: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  predicted?: number;
  upper?: number;
  lower?: number;
  isAnomaly?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'anomaly' | 'info' | 'warning' | 'success' | 'ai_suggestion';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  experimentId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Filters {
  dateFrom: string;
  dateTo: string;
  experimentType: ExperimentType | 'All';
  instrument: Instrument | 'All';
  status: ExperimentStatus | 'All';
  search: string;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  experimentIds: string[];
  format: 'PDF' | 'CSV';
  status: 'generating' | 'ready' | 'failed';
  size: string;
  encrypted: boolean;
}

export interface AppSettings {
  emotionAdaptiveUI: boolean;
  neuralInterface: boolean;
  arvrVisualization: boolean;
  quantumSecurity: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  highContrast: boolean;
  screenReader: boolean;
  autoReports: boolean;
  reportFrequency: 'daily' | 'weekly' | 'monthly';
  reportEmail: string;
  enableBiometric: boolean;
}

export type Page = 'dashboard' | 'experiments' | 'reports' | 'settings' | 'notifications' | 'ai-assistant' | 'data-import';
export type EmotionMode = 'neutral' | 'focused' | 'excited' | 'calm' | 'stressed';
export type Theme = 'dark' | 'light';

export interface AIInsight {
  id: string;
  type: 'filter_suggestion' | 'anomaly_alert' | 'optimization' | 'prediction' | 'summary';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  actionLabel?: string;
  experimentId?: string;
}

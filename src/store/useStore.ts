import { create } from 'zustand';
import {
  User, Page, EmotionMode, Theme, AppSettings, Filters,
  AppNotification, Report, AIInsight, Experiment, ExperimentStatus,
} from '../types';

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  theme: Theme;
  currentPage: Page;
  selectedExperimentId: string | null;
  notifications: AppNotification[];
  emotionMode: EmotionMode;
  settings: AppSettings;
  experiments: Experiment[];
  filters: Filters;
  reports: Report[];
  aiInsights: AIInsight[];
  streamingActive: boolean;
  sidebarCollapsed: boolean;
}

interface AppActions {
  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: Theme) => void;
  setPage: (page: Page) => void;
  selectExperiment: (id: string | null) => void;
  addNotification: (notification: AppNotification) => void;
  dismissNotification: (id: string) => void;
  markAllRead: () => void;
  setEmotion: (mode: EmotionMode) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateFilters: (filters: Partial<Filters>) => void;
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  addInsight: (insight: AIInsight) => void;
  toggleStreaming: () => void;
  toggleSidebar: () => void;
  flagAnomaly: (experimentId: string, description: string) => void;
  updateExperimentStatus: (id: string, status: ExperimentStatus) => void;
  addExperiments: (experiments: Experiment[]) => void;
}

const defaultSettings: AppSettings = {
  emotionAdaptiveUI: true, neuralInterface: false, arvrVisualization: true,
  quantumSecurity: true, autoRefresh: true, refreshInterval: 30,
  highContrast: false, screenReader: false, autoReports: false,
  reportFrequency: 'weekly', reportEmail: 'team@lab.com', enableBiometric: true,
};

const defaultFilters: Filters = {
  dateFrom: '', dateTo: '', experimentType: 'All',
  instrument: 'All', status: 'All', search: '',
};

const initialState: AppState = {
  isAuthenticated: false, user: null, theme: 'dark',
  currentPage: 'dashboard', selectedExperimentId: null,
  notifications: [], emotionMode: 'neutral',
  settings: defaultSettings, experiments: [],
  filters: defaultFilters,
  reports: [
    {
      id: 'RPT-001',
      title: 'Monthly Lab Performance Report — January 2026',
      generatedAt: new Date('2026-01-31').toISOString(),
      experimentIds: [],
      format: 'PDF',
      status: 'ready',
      size: '3.2 MB',
      encrypted: true,
    },
    {
      id: 'RPT-002',
      title: 'Anomaly Analysis Report — Q1 2026',
      generatedAt: new Date('2026-03-15').toISOString(),
      experimentIds: [],
      format: 'PDF',
      status: 'ready',
      size: '2.8 MB',
      encrypted: true,
    },
    {
      id: 'RPT-003',
      title: 'Instrument Calibration Summary',
      generatedAt: new Date('2026-04-01').toISOString(),
      experimentIds: [],
      format: 'CSV',
      status: 'ready',
      size: '1.2 MB',
      encrypted: false,
    },
  ],
  aiInsights: [],
  streamingActive: false, sidebarCollapsed: false,
};

export const useStore = create<AppState & AppActions>((set) => ({
  ...initialState,

  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set(initialState),
  setTheme: (theme) => set({ theme }),
  setPage: (currentPage) => set({ currentPage, selectedExperimentId: null }),
  selectExperiment: (selectedExperimentId) => set({ selectedExperimentId }),
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 50) })),
  dismissNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
  markAllRead: () => set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) })),
  setEmotion: (emotionMode) => set({ emotionMode }),
  updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
  updateFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
  updateReport: (report) => set((state) => ({ reports: state.reports.map(r => r.id === report.id ? report : r) })),
  addInsight: (insight) => set((state) => ({ aiInsights: [insight, ...state.aiInsights].slice(0, 10) })),
  toggleStreaming: () => set((state) => ({ streamingActive: !state.streamingActive })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  flagAnomaly: (experimentId, _description) => set((state) => ({
    experiments: state.experiments.map(e =>
      e.id === experimentId ? { ...e, status: 'Flagged' as ExperimentStatus } : e
    ),
  })),
  updateExperimentStatus: (id, status) => set((state) => ({
    experiments: state.experiments.map(e => e.id === id ? { ...e, status } : e),
  })),
  addExperiments: (experiments) => set((state) => ({ experiments: [...state.experiments, ...experiments] })),
}));

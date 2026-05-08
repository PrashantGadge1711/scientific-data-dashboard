import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  User, Page, EmotionMode, Theme, AppSettings, Filters,
  AppNotification, Report, AIInsight, Experiment, ExperimentStatus,
} from '../types';
import { generateDemoData } from '../data/demoData';

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

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'SELECT_EXPERIMENT'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'SET_EMOTION'; payload: EmotionMode }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_FILTERS'; payload: Partial<Filters> }
  | { type: 'ADD_REPORT'; payload: Report }
  | { type: 'UPDATE_REPORT'; payload: Report }
  | { type: 'ADD_INSIGHT'; payload: AIInsight }
  | { type: 'TOGGLE_STREAMING' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'FLAG_ANOMALY'; payload: { experimentId: string; description: string } }
  | { type: 'UPDATE_EXPERIMENT_STATUS'; payload: { id: string; status: ExperimentStatus } }
  | { type: 'ADD_EXPERIMENTS'; payload: Experiment[] };

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

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload, experiments: generateDemoData(60) };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload, selectedExperimentId: null };
    case 'SELECT_EXPERIMENT':
      return { ...state, selectedExperimentId: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 50) };
    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'MARK_ALL_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'SET_EMOTION':
      return { ...state, emotionMode: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_REPORT':
      return { ...state, reports: [action.payload, ...state.reports] };
    case 'UPDATE_REPORT':
      return { ...state, reports: state.reports.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'ADD_INSIGHT':
      return { ...state, aiInsights: [action.payload, ...state.aiInsights].slice(0, 10) };
    case 'TOGGLE_STREAMING':
      return { ...state, streamingActive: !state.streamingActive };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'FLAG_ANOMALY':
      return {
        ...state,
        experiments: state.experiments.map(e =>
          e.id === action.payload.experimentId
            ? { ...e, status: 'Flagged' as ExperimentStatus }
            : e
        ),
      };
    case 'UPDATE_EXPERIMENT_STATUS':
      return {
        ...state,
        experiments: state.experiments.map(e =>
          e.id === action.payload.id ? { ...e, status: action.payload.status } : e
        ),
      };
    case 'ADD_EXPERIMENTS':
      return {
        ...state,
        experiments: [...state.experiments, ...action.payload],
      };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

const AI_INSIGHTS: Omit<AIInsight, 'id' | 'timestamp'>[] = [
  { type: 'filter_suggestion', title: 'Optimize your view', description: 'Filter by Spectroscopy + last 30 days to reveal a 94% confidence pattern in Beta-2 runs.', confidence: 94, actionLabel: 'Apply Filter' },
  { type: 'anomaly_alert', title: 'Drift detected', description: '3 experiments on Alpha-1 show gradual baseline drift. Calibration recommended within 48h.', confidence: 87, actionLabel: 'View Details' },
  { type: 'prediction', title: 'Forecast: next 7 days', description: 'Based on historical patterns, expect 2–3 PCR anomalies next week if reagent batch #A47 continues.', confidence: 78, actionLabel: 'View Forecast' },
  { type: 'optimization', title: 'Run efficiency +18%', description: 'Switching Gamma-3 temperature from 37°C to 39°C reduced run time in 92% of Chromatography experiments.', confidence: 92, actionLabel: 'Apply Suggestion' },
  { type: 'summary', title: 'Weekly summary ready', description: 'AI generated your weekly lab summary: 23 experiments, 4 anomalies, avg confidence 89%.', confidence: 100, actionLabel: 'View Summary' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    let idx = 0;
    const seedInsights = () => {
      const insight = AI_INSIGHTS[idx % AI_INSIGHTS.length];
      dispatch({
        type: 'ADD_INSIGHT',
        payload: { ...insight, id: `ins-${Date.now()}`, timestamp: new Date().toISOString() },
      });
      idx++;
    };
    seedInsights();
    const interval = setInterval(seedInsights, 45000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (!state.isAuthenticated || !state.settings.autoRefresh) return;
    const NOTIF_TEMPLATES = [
      { type: 'anomaly' as const, title: 'Anomaly Detected', message: 'Spike detected in run EXP-0042 on Epsilon-5.', priority: 'high' as const },
      { type: 'ai_suggestion' as const, title: 'AI Suggestion', message: 'Recalibrate Alpha-1 for optimal NMR performance.', priority: 'medium' as const },
      { type: 'success' as const, title: 'Run Completed', message: 'Sequencing batch #B12 completed with 97% confidence.', priority: 'low' as const },
      { type: 'warning' as const, title: 'Low Reagent Alert', message: 'Reagent stock for PCR dropping below 20%.', priority: 'high' as const },
    ];
    const interval = setInterval(() => {
      const t = NOTIF_TEMPLATES[Math.floor(Math.random() * NOTIF_TEMPLATES.length)];
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { ...t, id: `n-${Date.now()}`, timestamp: new Date().toISOString(), read: false },
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.settings.autoRefresh]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

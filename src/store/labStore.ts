import { create } from 'zustand';

interface LabDataPoint {
  timestamp: number;
  temperature: number;
  pressure: number;
  purity: number;
  flowRate: number;
  ph: number;
}

interface AIInsight {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'critical';
}

interface LabState {
  // Real-time data stream
  currentData: LabDataPoint;
  dataHistory: LabDataPoint[];
  isStreaming: boolean;
  
  // Predictive data (ghost line)
  predictedData: LabDataPoint[];
  
  // AI insights
  insights: AIInsight[];
  
  // Actions
  updateCurrentData: () => void;
  startStreaming: () => void;
  stopStreaming: () => void;
  addInsight: (insight: Omit<AIInsight, 'id' | 'timestamp'>) => void;
  clearInsights: () => void;
}

const generateMockData = (): LabDataPoint => {
  const now = Date.now();
  return {
    timestamp: now,
    temperature: 20 + Math.random() * 15 + Math.sin(now / 5000) * 5,
    pressure: 100 + Math.random() * 20 + Math.cos(now / 3000) * 10,
    purity: 95 + Math.random() * 4.9,
    flowRate: 2 + Math.random() * 0.5,
    ph: 7 + (Math.random() - 0.5) * 0.4,
  };
};

const generatePredictiveData = (currentData: LabDataPoint): LabDataPoint[] => {
  const predictions: LabDataPoint[] = [];
  const baseTime = currentData.timestamp;
  
  for (let i = 1; i <= 24; i++) {
    const futureTime = baseTime + i * 600000; // 10-minute intervals
    predictions.push({
      timestamp: futureTime,
      temperature: currentData.temperature + Math.sin(i * 0.5) * 3 + (Math.random() - 0.5) * 2,
      pressure: currentData.pressure + Math.cos(i * 0.3) * 5 + (Math.random() - 0.5) * 3,
      purity: Math.max(90, currentData.purity - i * 0.15 + (Math.random() - 0.5) * 1),
      flowRate: currentData.flowRate + (Math.random() - 0.5) * 0.2,
      ph: 7 + (Math.random() - 0.5) * 0.3,
    });
  }
  
  return predictions;
};

const mockInsightTemplates: Omit<AIInsight, 'id' | 'timestamp'>[] = [
  { message: 'Protocol 49B: 98% Purity. Predicted reagent depletion in 2h. Auto-order placed.', type: 'success' },
  { message: 'Anomaly detected in Chamber 3. Temperature variance exceeding threshold.', type: 'warning' },
  { message: 'AI Model v4.2: Predicting optimal reaction time at 14:30 UTC.', type: 'info' },
  { message: 'Sample batch #7842 completed. Quality score: 97.4%', type: 'success' },
  { message: 'Pressure spike detected in Line B. Check valve integrity.', type: 'critical' },
  { message: 'Flow rate optimization recommended. Current efficiency: 89%', type: 'info' },
  { message: 'Molecular analysis complete. Compound matches target profile.', type: 'success' },
  { message: 'Scheduled maintenance for Mass Spec in 45 minutes.', type: 'warning' },
  { message: 'Reagent auto-replenishment initiated. ETA: 12 minutes.', type: 'info' },
  { message: 'pH levels stabilizing. No intervention required.', type: 'success' },
];

export const useLabStore = create<LabState>((set, get) => ({
  currentData: generateMockData(),
  dataHistory: [],
  isStreaming: false,
  predictedData: [],
  insights: [],
  
  updateCurrentData: () => {
    const newData = generateMockData();
    set((state) => {
      const newHistory = [...state.dataHistory, newData].slice(-100); // Keep last 100 points
      return {
        currentData: newData,
        dataHistory: newHistory,
        predictedData: generatePredictiveData(newData),
      };
    });
  },
  
  startStreaming: () => {
    set({ isStreaming: true });
    const interval = setInterval(() => {
      if (get().isStreaming) {
        get().updateCurrentData();
        
        // Randomly add insights
        if (Math.random() < 0.08) {
          const template = mockInsightTemplates[Math.floor(Math.random() * mockInsightTemplates.length)];
          get().addInsight(template);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000); // Update every second
  },
  
  stopStreaming: () => {
    set({ isStreaming: false });
  },
  
  addInsight: (insight) => {
    const newInsight: AIInsight = {
      ...insight,
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({
      insights: [newInsight, ...state.insights].slice(-50), // Keep last 50 insights
    }));
  },
  
  clearInsights: () => {
    set({ insights: [] });
  },
}));

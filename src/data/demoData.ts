import { Experiment, ExperimentType, Instrument, ExperimentStatus, Anomaly, TimePoint } from '../types';

const EXP_TYPES: ExperimentType[] = ['Spectroscopy', 'Chromatography', 'Microscopy', 'PCR', 'Sequencing', 'Mass Spec', 'NMR'];
const INSTRUMENTS: Instrument[] = ['Alpha-1', 'Beta-2', 'Gamma-3', 'Delta-4', 'Epsilon-5', 'Zeta-6'];
const STATUSES: ExperimentStatus[] = ['Completed', 'Completed', 'Completed', 'In Progress', 'Failed', 'Flagged', 'Pending'];
const OPERATORS = ['Dr. Alex Chen', 'Dr. Sarah Kim', 'Dr. James Liu', 'Dr. Maya Patel', 'Dr. Omar Hassan', 'Dr. Elena Kozlov'];
const TAGS_POOL = ['baseline', 'calibration', 'high-priority', 'routine', 'anomalous', 'batch-A', 'batch-B', 'replicate'];

const AI_SUMMARIES = [
  'Analysis reveals consistent baseline with minor drift in later timepoints. Recommend recalibration of instrument before next run.',
  'High confidence results. All quality control checkpoints passed. Data suitable for downstream analysis.',
  'Anomalous spike detected at T+45min. Possible reagent contamination or instrument malfunction. Flagged for review.',
  'Excellent signal-to-noise ratio. Results align with expected reference values within 2σ tolerance.',
  'Preliminary results show promising pattern consistent with positive control. Further replicate validation suggested.',
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rnd(min: number, max: number, dp = 2): number {
  return Number((min + Math.random() * (max - min)).toFixed(dp));
}
function randDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

function makeTimeSeries(n = 50, base = 50): TimePoint[] {
  let v = base;
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => {
    v = Math.max(0, Math.min(200, v + (Math.random() - 0.5) * 8));
    return {
      timestamp: new Date(now - (n - i) * 60000).toISOString(),
      value: Number(v.toFixed(2)),
    };
  });
}

function makeAnomalies(ts: TimePoint[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const TYPES: Anomaly['type'][] = ['outlier', 'drift', 'spike', 'missing'];
  const SEVERITIES: Anomaly['severity'][] = ['low', 'medium', 'high', 'critical'];
  const count = Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const pt = ts[Math.floor(Math.random() * ts.length)];
    const t = pick(TYPES);
    anomalies.push({
      id: `an-${Date.now()}-${i}`,
      type: t,
      severity: pick(SEVERITIES),
      timestamp: pt.timestamp,
      value: pt.value,
      description: t === 'spike' ? 'Sudden value spike exceeding 3σ threshold.'
        : t === 'drift' ? 'Gradual baseline drift observed over 15 minutes.'
        : t === 'outlier' ? 'Single outlier data point detected outside IQR bounds.'
        : 'Missing data point interpolated from adjacent values.',
      suggestedAction: t === 'spike' ? 'Check reagent pipetting accuracy and instrument pressure.'
        : t === 'drift' ? 'Perform instrument recalibration. Check temperature stability.'
        : 'Review raw data capture logs. Validate sensor connections.',
      resolved: Math.random() > 0.6,
    });
  }
  return anomalies;
}

export function generateDemoData(count = 60): Experiment[] {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const data: Experiment[] = [];

  for (let i = 0; i < count; i++) {
    const type = pick(EXP_TYPES);
    const status = pick(STATUSES);
    const ts = makeTimeSeries(50, rnd(30, 90));
    const raw = ts.map(p => p.value);
    const mean = raw.reduce((a, b) => a + b, 0) / raw.length;
    const anomalies = makeAnomalies(ts);
    const confidence = status === 'Failed' ? rnd(20, 55) : status === 'Flagged' ? rnd(45, 75) : rnd(72, 99);

    data.push({
      id: `EXP-${String(i + 1).padStart(4, '0')}`,
      name: `${type} Run ${String(i + 1).padStart(3, '0')}`,
      date: randDate(start, end),
      experimentType: type,
      instrument: pick(INSTRUMENTS),
      status,
      operator: pick(OPERATORS),
      parameters: {
        temperature: rnd(18, 42, 1),
        duration: rnd(15, 180, 0),
        concentration: rnd(0.05, 5.0),
        pH: rnd(6.5, 8.5, 1),
        pressure: rnd(0.9, 1.2, 2),
      },
      rawValues: raw,
      timeSeriesData: ts,
      resultSummary: `${type} analysis: mean ${mean.toFixed(2)}, confidence ${confidence.toFixed(0)}%. ${status === 'Failed' ? 'Critical errors — re-run required.' : 'Results within acceptable range.'}`,
      anomalies,
      tags: Array.from(new Set([pick(TAGS_POOL), pick(TAGS_POOL)])),
      confidence: Number(confidence.toFixed(1)),
      aiSummary: pick(AI_SUMMARIES),
    });
  }

  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

import { Experiment } from '../types';

export interface ExperimentKPIs {
  experimentId: string;
  experimentName: string;
  mean: number;
  variance: number;
  stdDev: number;
  anomalyCount: number;
  confidence: number;
  min: number;
  max: number;
  range: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function calculateExperimentKPIs(experiment: Experiment): ExperimentKPIs {
  const values = experiment.rawValues.length > 0 ? experiment.rawValues : [experiment.confidence];
  
  // Calculate mean
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Calculate variance
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  // Calculate standard deviation
  const stdDev = Math.sqrt(variance);
  
  // Calculate min, max, range
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Determine trend
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (values.length > 1) {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstHalfMean = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondHalfMean = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    const change = ((secondHalfMean - firstHalfMean) / firstHalfMean) * 100;
    
    if (change > 5) trend = 'increasing';
    else if (change < -5) trend = 'decreasing';
  }
  
  return {
    experimentId: experiment.id,
    experimentName: experiment.name,
    mean,
    variance,
    stdDev,
    anomalyCount: experiment.anomalies.length,
    confidence: experiment.confidence,
    min,
    max,
    range,
    trend,
  };
}

export function calculateBulkKPIs(experiments: Experiment[]): ExperimentKPIs[] {
  return experiments.map(calculateExperimentKPIs);
}

export interface TrendAnalysis {
  period: string;
  cagr: number;
  startValue: number;
  endValue: number;
  anomalyMarkers: string[];
  benchmarkComparison: {
    value: number;
    benchmark: number;
    difference: number;
    differencePercent: number;
  };
}

export function calculateTrendAnalysis(
  experiments: Experiment[],
  metric: 'confidence' | 'mean' = 'confidence'
): TrendAnalysis {
  const sortedExperiments = [...experiments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const startValue = metric === 'confidence' 
    ? sortedExperiments[0]?.confidence || 0
    : calculateExperimentKPIs(sortedExperiments[0]).mean;
  
  const endValue = metric === 'confidence'
    ? sortedExperiments[sortedExperiments.length - 1]?.confidence || 0
    : calculateExperimentKPIs(sortedExperiments[sortedExperiments.length - 1]).mean;
  
  const years = Math.max(1, (new Date(sortedExperiments[sortedExperiments.length - 1].date).getTime() - 
    new Date(sortedExperiments[0].date).getTime()) / (365 * 24 * 60 * 60 * 1000));
  
  // Calculate CAGR (Compound Annual Growth Rate)
  const cagr = years > 0 ? ((endValue / startValue) ** (1 / years) - 1) * 100 : 0;
  
  // Identify anomaly markers
  const anomalyMarkers = experiments
    .filter(e => e.anomalies.length > 0)
    .map(e => e.id);
  
  // Benchmark comparison (using 85% as default benchmark for confidence)
  const benchmark = metric === 'confidence' ? 85 : startValue;
  const difference = endValue - benchmark;
  const differencePercent = (difference / benchmark) * 100;
  
  return {
    period: `${sortedExperiments[0]?.date.split('T')[0]} to ${sortedExperiments[sortedExperiments.length - 1]?.date.split('T')[0]}`,
    cagr,
    startValue,
    endValue,
    anomalyMarkers,
    benchmarkComparison: {
      value: endValue,
      benchmark,
      difference,
      differencePercent,
    },
  };
}

export function generateNarrativeInsight(kpi: ExperimentKPIs): string {
  const { experimentName, mean, stdDev, anomalyCount, confidence, trend } = kpi;
  
  let narrative = `${experimentName} shows `;
  
  // Trend description
  if (trend === 'increasing') {
    narrative += 'an increasing trend in measurements';
  } else if (trend === 'decreasing') {
    narrative += 'a decreasing trend in measurements';
  } else {
    narrative += 'stable measurement patterns';
  }
  
  // Variance description
  if (stdDev < 5) {
    narrative += ' with low variance (consistent results)';
  } else if (stdDev < 15) {
    narrative += ' with moderate variance';
  } else {
    narrative += ' with high variance (inconsistent results)';
  }
  
  // Confidence description
  narrative += `. Overall confidence is ${confidence.toFixed(1)}%`;
  
  // Anomaly description
  if (anomalyCount === 0) {
    narrative += ' with no detected anomalies';
  } else if (anomalyCount === 1) {
    narrative += ' with 1 detected anomaly';
  } else {
    narrative += ` with ${anomalyCount} detected anomalies`;
  }
  
  // Mean comparison
  narrative += `. The mean value is ${mean.toFixed(2)}`;
  
  return narrative + '.';
}

export function generateBulkNarratives(experiments: Experiment[]): string[] {
  const kpis = calculateBulkKPIs(experiments);
  return kpis.map(generateNarrativeInsight);
}

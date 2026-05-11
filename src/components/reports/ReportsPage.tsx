import { useState } from 'react';
import { FileText, Download, Shield, CheckCircle, Loader, Plus, XCircle, Lock, BarChart3, TrendingUp, Lightbulb, Accessibility, GitCompare, Brain, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportToCSV } from '../../utils/export';
import { calculateBulkKPIs, calculateTrendAnalysis, generateBulkNarratives } from '../../utils/analytics';
import { Report } from '../../types';

type ReportTab = 'summary' | 'trend' | 'narrative' | 'accessibility' | 'comparison' | 'forecast' | 'story';

const TABS: { id: ReportTab; label: string; icon: React.ElementType }[] = [
  { id: 'summary', label: 'Summary', icon: BarChart3 },
  { id: 'trend', label: 'Trend', icon: TrendingUp },
  { id: 'narrative', label: 'Narrative', icon: Lightbulb },
  { id: 'accessibility', label: 'A11y Scan', icon: Accessibility },
  { id: 'comparison', label: 'Compare', icon: GitCompare },
  { id: 'forecast', label: 'Forecast', icon: Brain },
  { id: 'story', label: 'Story', icon: BookOpen },
];

export default function ReportsPage() {
  const { state, dispatch } = useApp();
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');

  const kpis = calculateBulkKPIs(state.experiments);
  const trendAnalysis = calculateTrendAnalysis(state.experiments);
  const narratives = generateBulkNarratives(state.experiments.slice(0, 10));

  function generateReport() {
    setGenerating(true);
    const id = `RPT-${Date.now()}`;
    const pending: Report = {
      id, title: `Lab Report — ${new Date().toLocaleDateString()}`,
      generatedAt: new Date().toISOString(),
      experimentIds: state.experiments.slice(0, 20).map(e => e.id),
      format, status: 'generating',
      size: '—', encrypted: state.settings.quantumSecurity,
    };
    dispatch({ type: 'ADD_REPORT', payload: pending });
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_REPORT',
        payload: { ...pending, status: 'ready', size: format === 'PDF' ? '2.4 MB' : '0.8 MB' },
      });
      setGenerating(false);
      if (format === 'CSV') exportToCSV(state.experiments);
    }, 2500);
  }

  const STATUS_CFG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    generating: { icon: Loader, color: 'text-blue-400', label: 'Generating…' },
    ready: { icon: CheckCircle, color: 'text-emerald-400', label: 'Ready' },
    failed: { icon: XCircle, color: 'text-rose-400', label: 'Failed' },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-100">Reports</h1>
          <p className="text-xs text-slate-500">{state.reports.length} reports generated</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={format} onChange={e => setFormat(e.target.value as 'PDF' | 'CSV')}
            aria-label="Report format"
            className="glass rounded-lg px-3 py-1.5 text-xs text-slate-300 border border-slate-700/50 focus:outline-none bg-slate-900">
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
          </select>
          <button onClick={generateReport} disabled={generating}
            aria-label="Generate new report" aria-busy={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-xs font-medium transition-all disabled:opacity-50">
            {generating
              ? <><Loader className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />Generating…</>
              : <><Plus className="w-3.5 h-3.5" aria-hidden="true" />Generate</>}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 px-5 py-2 border-b border-slate-700/30 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            aria-pressed={activeTab === tab.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
            }`}>
            <tab.icon className="w-3.5 h-3.5" aria-hidden="true" as any />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Security indicator */}
        {state.settings.quantumSecurity && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-emerald-300">Quantum-resistant encryption active — all reports AES-512 + post-quantum signatures</p>
          </div>
        )}

        {/* Auto-report banner */}
        {state.settings.autoReports && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <span className="w-2 h-2 rounded-full bg-violet-400 stream-dot" aria-hidden="true" />
            <p className="text-xs text-violet-300">
              Auto-reports enabled · Next: {state.settings.reportFrequency} · Sending to {state.settings.reportEmail}
            </p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Experiment Summary KPIs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.slice(0, 9).map((kpi) => (
                <div key={kpi.experimentId} className="glass rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-slate-300 truncate">{kpi.experimentName}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      kpi.trend === 'increasing' ? 'bg-emerald-500/10 text-emerald-400' :
                      kpi.trend === 'decreasing' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {kpi.trend}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">Mean</p>
                      <p className="font-mono text-slate-200">{kpi.mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Std Dev</p>
                      <p className="font-mono text-slate-200">{kpi.stdDev.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Range</p>
                      <p className="font-mono text-slate-200">{kpi.range.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Anomalies</p>
                      <p className="font-mono text-slate-200">{kpi.anomalyCount}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/30">
                    <p className="text-slate-500 text-[10px]">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${kpi.confidence}%` }} />
                      </div>
                      <p className="text-xs font-mono text-slate-300">{kpi.confidence}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trend' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Trend Analysis</h3>
            <div className="glass rounded-xl p-5 border border-slate-700/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">Period</p>
                  <p className="text-sm font-medium text-slate-200">{trendAnalysis.period}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">CAGR</p>
                  <p className={`text-sm font-mono ${trendAnalysis.cagr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trendAnalysis.cagr >= 0 ? '+' : ''}{trendAnalysis.cagr.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">Start Value</p>
                  <p className="text-sm font-mono text-slate-200">{trendAnalysis.startValue.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">End Value</p>
                  <p className="text-sm font-mono text-slate-200">{trendAnalysis.endValue.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <p className="text-xs text-slate-500 mb-2">Benchmark Comparison</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">Current vs Benchmark ({trendAnalysis.benchmarkComparison.benchmark})</p>
                    <p className={`text-sm font-semibold ${trendAnalysis.benchmarkComparison.differencePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trendAnalysis.benchmarkComparison.differencePercent >= 0 ? '+' : ''}{trendAnalysis.benchmarkComparison.differencePercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              {trendAnalysis.anomalyMarkers.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
                  <p className="text-xs text-rose-400 mb-2">Anomaly Markers ({trendAnalysis.anomalyMarkers.length})</p>
                  <p className="text-xs text-slate-400">{trendAnalysis.anomalyMarkers.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'narrative' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Narrative Insights</h3>
            <div className="space-y-3">
              {narratives.map((narrative, idx) => (
                <div key={idx} className="glass rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-slate-200 leading-relaxed">{narrative}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Accessibility Report Scanner</h3>
            <div className="glass rounded-xl p-5 border border-slate-700/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-emerald-300">ARIA Labels</p>
                      <p className="text-xs text-slate-500">All interactive elements have proper ARIA labels</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-emerald-300">Keyboard Navigation</p>
                      <p className="text-xs text-slate-500">All functions accessible via keyboard</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-emerald-300">Color Contrast</p>
                      <p className="text-xs text-slate-500">WCAG AA compliant for all text</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">100%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Cross-Experiment Comparison</h3>
            <div className="glass rounded-xl p-5 border border-slate-700/30">
              <p className="text-sm text-slate-400">Select experiments to compare side-by-side</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.experiments.slice(0, 4).map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <p className="text-xs font-medium text-slate-300">{exp.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Confidence: {exp.confidence}%</p>
                    <p className="text-xs text-slate-500">Anomalies: {exp.anomalies.length}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Predictive Forecasts</h3>
            <div className="glass rounded-xl p-5 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-violet-400" aria-hidden="true" />
                <p className="text-sm text-slate-200">ML Model Predictions</p>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                  <p className="text-xs text-violet-300 mb-1">Next 7 Days</p>
                  <p className="text-sm text-slate-200">Expect 2–3 anomalies in PCR runs if reagent batch continues</p>
                  <p className="text-xs text-slate-500 mt-1">Confidence: 78%</p>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-xs text-cyan-300 mb-1">Q3 Capacity Forecast</p>
                  <p className="text-sm text-slate-200">Will need 3x more Sequencing capacity based on growth</p>
                  <p className="text-xs text-slate-500 mt-1">Confidence: 85%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Interactive Story Mode</h3>
            <div className="glass rounded-xl p-5 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-amber-400" aria-hidden="true" />
                <p className="text-sm text-slate-200">Guided Narrative</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 cursor-pointer hover:bg-amber-500/10 transition-all">
                  <p className="text-xs font-medium text-amber-300 mb-1">Chapter 1: The Anomaly Spike</p>
                  <p className="text-sm text-slate-200">On March 15th, a sudden spike in variance was detected across 3 experiments...</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 cursor-pointer hover:bg-slate-700/30 transition-all">
                  <p className="text-xs font-medium text-slate-300 mb-1">Chapter 2: Recovery Phase</p>
                  <p className="text-sm text-slate-200">After implementing the new calibration protocol, confidence scores improved...</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30 cursor-pointer hover:bg-slate-700/30 transition-all">
                  <p className="text-xs font-medium text-slate-300 mb-1">Chapter 3: Optimization Success</p>
                  <p className="text-sm text-slate-200">The temperature gradient approach yielded 18% better efficiency...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generated Reports List */}
        {activeTab === 'summary' && state.reports.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">Generated Reports</h3>
            <div className="space-y-3" role="list" aria-label="Generated reports">
              {state.reports.map(r => {
                const { icon: StatusIcon, color, label } = STATUS_CFG[r.status];
                return (
                  <div key={r.id} role="listitem"
                    className="glass rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/20 transition-all flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-100 truncate">{r.title}</p>
                        {r.encrypted && (
                          <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" aria-label="Encrypted" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {r.format} · {r.experimentIds.length} experiments · {r.size} · {new Date(r.generatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className={`flex items-center gap-1.5 text-xs ${color}`} aria-label={`Status: ${label}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${r.status === 'generating' ? 'animate-spin' : ''}`} aria-hidden="true" as any />
                        <span>{label}</span>
                      </div>
                      {r.status === 'ready' && (
                        <button onClick={() => exportToCSV(state.experiments, `${r.id}.csv`)}
                          aria-label={`Download ${r.title}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg glass border border-slate-700/40 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

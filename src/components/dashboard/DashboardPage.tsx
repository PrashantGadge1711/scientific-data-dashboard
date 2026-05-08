import { useState, useEffect } from 'react';
import { RefreshCw, Filter, Radio, RadioTower, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useFilteredData } from '../../hooks/useFilteredData';
import { useMockStream } from '../../hooks/useMockStream';
import MetricsCards from './MetricsCards';
import TimeSeriesChart from './TimeSeriesChart';
import AIInsightPanel from './AIInsightPanel';
import { ExperimentType, Instrument, ExperimentStatus } from '../../types';

const EXP_TYPES: (ExperimentType | 'All')[] = ['All', 'Spectroscopy', 'Chromatography', 'Microscopy', 'PCR', 'Sequencing', 'Mass Spec', 'NMR'];
const INSTRUMENTS: (Instrument | 'All')[] = ['All', 'Alpha-1', 'Beta-2', 'Gamma-3', 'Delta-4', 'Epsilon-5', 'Zeta-6'];
const STATUSES: (ExperimentStatus | 'All')[] = ['All', 'Completed', 'In Progress', 'Failed', 'Flagged', 'Pending'];

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoTick, setAutoTick] = useState(0);
  const stream = useMockStream(state.streamingActive, 1200);
  const filtered = useFilteredData(state.experiments, state.filters);

  useEffect(() => {
    if (!state.settings.autoRefresh) return;
    const t = setInterval(() => {
      setLastRefresh(new Date());
      setAutoTick(n => n + 1);
    }, state.settings.refreshInterval * 1000);
    return () => clearInterval(t);
  }, [state.settings.autoRefresh, state.settings.refreshInterval]);

  function handleRefresh() {
    setLastRefresh(new Date());
    setAutoTick(n => n + 1);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page header */}
      <div className="flex-shrink-0 px-5 py-3 flex items-center justify-between border-b border-slate-700/30">
        <div>
          <h1 className="text-base font-bold text-slate-100">Dashboard</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" aria-hidden="true" />
            Last refresh: {lastRefresh.toLocaleTimeString()}
            {state.settings.autoRefresh && <span className="text-cyan-500/70">· auto every {state.settings.refreshInterval}s</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => dispatch({ type: 'TOGGLE_STREAMING' })}
            aria-label={state.streamingActive ? 'Stop live stream' : 'Start live stream'}
            aria-pressed={state.streamingActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              state.streamingActive
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                : 'text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-slate-200'
            }`}>
            {state.streamingActive ? <><RadioTower className="w-3.5 h-3.5" aria-hidden="true" /><span className="stream-dot inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />Live</> : <><Radio className="w-3.5 h-3.5" aria-hidden="true" />Start Stream</>}
          </button>
          <button onClick={handleRefresh} aria-label="Refresh dashboard"
            className="w-8 h-8 flex items-center justify-center rounded-lg glass border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${autoTick > 0 ? '' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-4">
          {/* Metrics row */}
          <MetricsCards experiments={filtered} />

          {/* Filter bar */}
          <div className="glass rounded-xl p-3 border border-slate-700/30">
            <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Experiment filters">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-shrink-0">
                <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-medium">Filters</span>
              </div>
              {/* Date range */}
              <input type="date" value={state.filters.dateFrom} aria-label="Filter from date"
                onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { dateFrom: e.target.value } })}
                className="glass rounded-lg px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none bg-transparent" />
              <span className="text-slate-600 text-xs">→</span>
              <input type="date" value={state.filters.dateTo} aria-label="Filter to date"
                onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { dateTo: e.target.value } })}
                className="glass rounded-lg px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none bg-transparent" />
              {/* Type */}
              <select value={state.filters.experimentType} aria-label="Filter by experiment type"
                onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { experimentType: e.target.value as ExperimentType | 'All' } })}
                className="glass rounded-lg px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none bg-slate-900">
                {EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {/* Instrument */}
              <select value={state.filters.instrument} aria-label="Filter by instrument"
                onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { instrument: e.target.value as Instrument | 'All' } })}
                className="glass rounded-lg px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none bg-slate-900">
                {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {/* Status */}
              <select value={state.filters.status} aria-label="Filter by status"
                onChange={e => dispatch({ type: 'UPDATE_FILTERS', payload: { status: e.target.value as ExperimentStatus | 'All' } })}
                className="glass rounded-lg px-2.5 py-1.5 text-xs text-slate-300 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none bg-slate-900">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {/* Clear filters */}
              {(state.filters.experimentType !== 'All' || state.filters.instrument !== 'All' || state.filters.status !== 'All' || state.filters.dateFrom || state.filters.dateTo) && (
                <button onClick={() => dispatch({ type: 'UPDATE_FILTERS', payload: { experimentType: 'All', instrument: 'All', status: 'All', dateFrom: '', dateTo: '' } })}
                  className="text-xs text-rose-400 hover:text-rose-300 underline transition-colors">
                  Clear
                </button>
              )}
              <span className="ml-auto text-xs text-slate-500">{filtered.length} runs</span>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="xl:col-span-2 glass rounded-xl p-4 border border-slate-700/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-100">
                    {state.streamingActive ? 'Live Instrument Stream' : 'Experiment Confidence Trend'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {state.streamingActive
                      ? `${stream.totalPoints} pts · ${stream.anomalyCount} anomalies detected`
                      : `${filtered.length} experiments · AI forecast overlay`}
                  </p>
                </div>
                {state.streamingActive && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 stream-dot" aria-hidden="true" />
                    Connected
                  </div>
                )}
              </div>
              <TimeSeriesChart
                streamData={stream.data}
                experiments={filtered}
                isStreaming={state.streamingActive}
                height={240}
              />
            </div>

            {/* AI Panel */}
            <div className="glass rounded-xl p-4 border border-slate-700/30">
              <AIInsightPanel />
            </div>
          </div>

          {/* Recent experiments quick-view */}
          <div className="glass rounded-xl border border-slate-700/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/30 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100">Recent Experiments</h2>
              <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'experiments' })}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                View all →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" aria-label="Recent experiments">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    {['ID', 'Name', 'Type', 'Instrument', 'Status', 'Confidence', 'Date'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 6).map((exp, idx) => (
                    <tr key={exp.id} onClick={() => { dispatch({ type: 'SELECT_EXPERIMENT', payload: exp.id }); dispatch({ type: 'SET_PAGE', payload: 'experiments' }); }}
                      className="border-b border-slate-700/20 hover:bg-white/3 cursor-pointer transition-colors group"
                      style={{ animationDelay: `${idx * 40}ms` }}>
                      <td className="px-4 py-2.5 text-xs font-mono text-cyan-400">{exp.id}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-200 max-w-[160px] truncate">{exp.name}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-400">{exp.experimentType}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-400">{exp.instrument}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={exp.status} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 rounded-full bg-slate-700">
                            <div className={`h-full rounded-full ${exp.confidence > 80 ? 'bg-emerald-500' : exp.confidence > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${exp.confidence}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{exp.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{exp.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Failed': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Flagged': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Pending': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${cfg[status] ?? cfg['Pending']}`}>
      {status}
    </span>
  );
}

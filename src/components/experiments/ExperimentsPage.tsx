import { useState } from 'react';
import { Search, FlaskConical, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useFilteredData } from '../../hooks/useFilteredData';
import { Experiment } from '../../types';
import TimeSeriesChart from '../dashboard/TimeSeriesChart';

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Failed': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Flagged': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Pending': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cfg[status] ?? cfg['Pending']}`}>
      {status}
    </span>
  );
}

function ExperimentDrawer({ exp, onClose }: { exp: Experiment; onClose: () => void }) {
  const { dispatch } = useApp();
  const unresolvedAnomalies = exp.anomalies.filter(a => !a.resolved);
  const SEVE_COLORS: Record<string, string> = {
    low: 'text-slate-400', medium: 'text-amber-400',
    high: 'text-orange-400', critical: 'text-rose-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label={`Experiment ${exp.id} details`} aria-modal="true">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl h-full glass border-l border-slate-700/40 flex flex-col drawer-open overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700/30 flex items-start justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-400">{exp.id}</span>
              <StatusBadge status={exp.status} />
            </div>
            <h2 className="text-base font-bold text-slate-100">{exp.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{exp.experimentType} · {exp.instrument} · {exp.operator}</p>
          </div>
          <button onClick={onClose} aria-label="Close detail panel"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Confidence */}
          <div className="glass rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Confidence Score</span>
              <span className={`text-lg font-bold ${exp.confidence > 80 ? 'text-emerald-400' : exp.confidence > 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                {exp.confidence}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${exp.confidence > 80 ? 'bg-emerald-500' : exp.confidence > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${exp.confidence}%` }} />
            </div>
          </div>

          {/* Parameters */}
          <div className="glass rounded-xl p-4 border border-slate-700/30">
            <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">Parameters</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(exp.parameters).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1 border-b border-slate-700/30">
                  <span className="text-slate-500 capitalize">{k}</span>
                  <span className="text-slate-200 font-mono">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time-series */}
          <div className="glass rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Time Series</h3>
              <span className="text-[10px] text-slate-500">{exp.timeSeriesData.length} data points</span>
            </div>
            <div className="holo-wrapper">
              <div className="holo-inner">
                <TimeSeriesChart experiments={[exp]} height={180} />
              </div>
            </div>
          </div>

          {/* Anomalies */}
          {exp.anomalies.length > 0 && (
            <div className="glass rounded-xl p-4 border border-amber-500/15">
              <h3 className="text-xs font-semibold text-amber-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                Anomalies ({exp.anomalies.length})
              </h3>
              <div className="space-y-2">
                {exp.anomalies.map(a => (
                  <div key={a.id} className={`rounded-lg p-3 border ${a.resolved ? 'border-slate-700/30 opacity-50' : 'border-amber-500/20 bg-amber-500/5'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold capitalize ${SEVE_COLORS[a.severity]}`}>{a.severity} · {a.type}</span>
                      {a.resolved && <span className="text-[10px] text-emerald-400">Resolved</span>}
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{a.description}</p>
                    <p className="text-[11px] text-slate-500">→ {a.suggestedAction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {exp.aiSummary && (
            <div className="glass rounded-xl p-4 border border-violet-500/15 bg-violet-500/5">
              <h3 className="text-xs font-semibold text-violet-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 ai-pulse" aria-hidden="true" />
                AI Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{exp.aiSummary}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {exp.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] bg-slate-700/40 text-slate-400 border border-slate-600/40">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-slate-700/30 flex gap-2 flex-shrink-0">
          {unresolvedAnomalies.length > 0 && (
            <button onClick={() => dispatch({ type: 'FLAG_ANOMALY', payload: { experimentId: exp.id, description: 'Flagged via detail panel' } })}
              className="flex-1 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/15 transition-colors">
              Flag for Review
            </button>
          )}
          <button onClick={() => dispatch({ type: 'UPDATE_EXPERIMENT_STATUS', payload: { id: exp.id, status: 'Completed' } })}
            className="flex-1 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/15 transition-colors">
            Mark Completed
          </button>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl glass border border-slate-700/40 text-slate-400 text-xs font-medium hover:text-slate-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExperimentsPage() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const filtered = useFilteredData(state.experiments, { ...state.filters, search });
  const selected = state.selectedExperimentId
    ? state.experiments.find(e => e.id === state.selectedExperimentId) ?? null
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-100">Experiments</h1>
          <p className="text-xs text-slate-500">{filtered.length} of {state.experiments.length} runs</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID, name, operator…" aria-label="Search experiments"
            className="glass rounded-xl pl-8 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none w-60" />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Experiment grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FlaskConical className="w-10 h-10 text-slate-700 mb-3" aria-hidden="true" />
            <p className="text-slate-400 font-medium">No experiments found</p>
            <p className="text-xs text-slate-600 mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" role="list">
            {filtered.map(exp => (
              <article key={exp.id} role="listitem"
                className="glass rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/25 transition-all cursor-pointer group"
                onClick={() => dispatch({ type: 'SELECT_EXPERIMENT', payload: exp.id })}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">{exp.id}</span>
                    <h3 className="text-sm font-semibold text-slate-100 truncate max-w-[180px]">{exp.name}</h3>
                  </div>
                  <StatusBadge status={exp.status} />
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-slate-500">{exp.experimentType} · {exp.instrument}</p>
                  <p className="text-xs text-slate-500">{exp.operator} · {exp.date}</p>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full ${exp.confidence > 80 ? 'bg-emerald-500' : exp.confidence > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${exp.confidence}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{exp.confidence}%</span>
                </div>
                {exp.anomalies.length > 0 && (
                  <div className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    <span className="text-[10px]">{exp.anomalies.length} anomal{exp.anomalies.length > 1 ? 'ies' : 'y'}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/30">
                  <div className="flex gap-1">
                    {exp.tags.slice(0, 2).map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700/50 text-slate-500">#{t}</span>
                    ))}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <ExperimentDrawer exp={selected} onClose={() => dispatch({ type: 'SELECT_EXPERIMENT', payload: null })} />
      )}
    </div>
  );
}

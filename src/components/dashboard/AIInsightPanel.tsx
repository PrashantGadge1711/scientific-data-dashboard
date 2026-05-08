import { useState } from 'react';
import { Cpu, ChevronRight, Sparkles, X, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIInsight } from '../../types';

const TYPE_COLORS: Record<AIInsight['type'], string> = {
  filter_suggestion: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  anomaly_alert: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  optimization: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  prediction: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  summary: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

const TYPE_LABELS: Record<AIInsight['type'], string> = {
  filter_suggestion: 'Filter Tip',
  anomaly_alert: 'Anomaly',
  optimization: 'Optimize',
  prediction: 'Forecast',
  summary: 'Summary',
};

const THINKING_PHRASES = [
  'Analyzing experiment patterns…',
  'Running predictive models…',
  'Scanning for anomalies…',
  'Correlating instrument data…',
];

export default function AIInsightPanel() {
  const { state, dispatch } = useApp();
  const [thinking, setThinking] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const insights = state.aiInsights.slice(0, 4);

  function refresh() {
    setThinking(true);
    let i = 0;
    const t = setInterval(() => { setPhraseIdx(++i % THINKING_PHRASES.length); }, 700);
    setTimeout(() => {
      clearInterval(t);
      setThinking(false);
      dispatch({
        type: 'ADD_INSIGHT',
        payload: {
          id: `ins-${Date.now()}`,
          type: 'prediction',
          title: 'Model refreshed',
          description: 'AI agent re-analyzed all 60 recent experiments. 3 new patterns identified.',
          confidence: 91,
          timestamp: new Date().toISOString(),
          actionLabel: 'View Patterns',
        },
      });
    }, 2800);
  }

  return (
    <div className="flex flex-col h-full" aria-label="AI Insight Panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center ai-pulse flex-shrink-0">
            <Cpu className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100">AI Lab Agent</p>
            <p className="text-[10px] text-violet-400 font-mono">v4.2 · {insights.length} insights</p>
          </div>
        </div>
        <button onClick={refresh} disabled={thinking} aria-label="Refresh AI insights"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-violet-400 transition-colors disabled:opacity-40">
          <RefreshCw className={`w-3.5 h-3.5 ${thinking ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Thinking state */}
      {thinking && (
        <div className="mb-3 rounded-xl p-3 bg-violet-500/5 border border-violet-500/15" aria-live="polite">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  style={{ animation: `streamPulse 1s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <span className="text-xs text-violet-300 font-medium">{THINKING_PHRASES[phraseIdx]}</span>
          </div>
        </div>
      )}

      {/* Insights list */}
      <div className="space-y-2.5 flex-1 overflow-y-auto" role="feed" aria-label="AI insights">
        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="w-8 h-8 text-violet-400/40 mb-2" aria-hidden="true" />
            <p className="text-xs text-slate-500">No insights yet.<br />Agent is warming up…</p>
          </div>
        )}
        {insights.map(ins => (
          <article key={ins.id} className="rounded-xl p-3 glass border border-slate-700/30 hover:border-violet-500/20 transition-all group">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${TYPE_COLORS[ins.type]}`}>
                {TYPE_LABELS[ins.type]}
              </span>
              <button onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: ins.id })}
                aria-label="Dismiss insight"
                className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center text-slate-600 hover:text-slate-300 transition-all">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">{ins.title}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{ins.description}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-16 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
                    style={{ width: `${ins.confidence}%` }} aria-label={`Confidence: ${ins.confidence}%`} />
                </div>
                <span className="text-[10px] text-slate-500">{ins.confidence}%</span>
              </div>
              {ins.actionLabel && (
                <button className="flex items-center gap-0.5 text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium">
                  {ins.actionLabel} <ChevronRight className="w-2.5 h-2.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Emotion mode selector */}
      <div className="mt-4 pt-3 border-t border-slate-700/40">
        <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-wider font-medium">Emotion-Adaptive UI</p>
        <div className="flex gap-1.5 flex-wrap">
          {(['neutral', 'focused', 'calm', 'excited', 'stressed'] as const).map(m => (
            <button key={m} onClick={() => dispatch({ type: 'SET_EMOTION', payload: m })}
              aria-label={`Set mood to ${m}`} aria-pressed={state.emotionMode === m}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium capitalize transition-all border ${
                state.emotionMode === m
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'text-slate-600 hover:text-slate-400 border-slate-700/40 hover:border-slate-600'
              }`}>
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

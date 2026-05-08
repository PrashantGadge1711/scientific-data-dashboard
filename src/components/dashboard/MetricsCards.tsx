import { TrendingUp, TrendingDown, FlaskConical, AlertTriangle, Activity, Cpu } from 'lucide-react';
import { Experiment } from '../../types';

interface MetricsCardsProps { experiments: Experiment[]; }

interface Metric {
  label: string;
  value: string;
  sub: string;
  trend: number;
  icon: React.ElementType;
  color: string;
  glow: string;
}

export default function MetricsCards({ experiments }: MetricsCardsProps) {
  const total = experiments.length;
  const completed = experiments.filter(e => e.status === 'Completed').length;
  const failed = experiments.filter(e => e.status === 'Failed').length;
  const flagged = experiments.filter(e => e.status === 'Flagged').length;
  const anomalyTotal = experiments.reduce((s, e) => s + e.anomalies.length, 0);
  const avgConf = total ? (experiments.reduce((s, e) => s + e.confidence, 0) / total).toFixed(1) : '0';
  const instruments = new Set(experiments.map(e => e.instrument)).size;

  const metrics: Metric[] = [
    {
      label: 'Total Runs',
      value: String(total),
      sub: `${completed} completed`,
      trend: 12,
      icon: FlaskConical,
      color: 'text-cyan-400',
      glow: 'border-cyan-500/20 hover:border-cyan-500/40',
    },
    {
      label: 'Avg Confidence',
      value: `${avgConf}%`,
      sub: `${failed} failed runs`,
      trend: 3.4,
      icon: Activity,
      color: 'text-violet-400',
      glow: 'border-violet-500/20 hover:border-violet-500/40',
    },
    {
      label: 'Anomalies',
      value: String(anomalyTotal),
      sub: `${flagged} flagged`,
      trend: -8,
      icon: AlertTriangle,
      color: anomalyTotal > 5 ? 'text-amber-400' : 'text-emerald-400',
      glow: anomalyTotal > 5 ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-emerald-500/20 hover:border-emerald-500/40',
    },
    {
      label: 'Active Instruments',
      value: String(instruments),
      sub: 'across all types',
      trend: 0,
      icon: Cpu,
      color: 'text-indigo-400',
      glow: 'border-indigo-500/20 hover:border-indigo-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="list" aria-label="Key metrics">
      {metrics.map(m => (
        <div key={m.label} role="listitem"
          className={`glass rounded-xl p-4 border transition-all cursor-default ${m.glow}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.color} bg-current/10`}
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <m.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" aria-hidden="true" style={{ color: 'inherit' }} />
            </div>
            <div className={`flex items-center gap-0.5 text-xs font-medium ${m.trend > 0 ? 'text-emerald-400' : m.trend < 0 ? 'text-rose-400' : 'text-slate-500'}`}
              aria-label={`Trend: ${m.trend > 0 ? '+' : ''}${m.trend}%`}>
              {m.trend !== 0 ? (
                <>{m.trend > 0 ? <TrendingUp className="w-3 h-3" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" aria-hidden="true" />}<span>{Math.abs(m.trend)}%</span></>
              ) : <span className="text-slate-600">—</span>}
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100 leading-none mb-1" aria-label={`${m.label}: ${m.value}`}>{m.value}</p>
          <p className="text-xs font-medium text-slate-400">{m.label}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}

import { useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend,
} from 'recharts';
import { ChartDataPoint, Experiment } from '../../types';

interface Props {
  streamData?: ChartDataPoint[];
  experiments?: Experiment[];
  isStreaming?: boolean;
  height?: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 shadow-2xl border border-cyan-500/20 min-w-[140px]" role="tooltip">
      <p className="text-xs text-slate-400 mb-1.5 font-mono">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} aria-hidden="true" />
            <span className="text-slate-300 capitalize">{p.name}</span>
          </div>
          <span className="font-mono font-semibold text-slate-100">{Number(p.value).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function TimeSeriesChart({ streamData, experiments, isStreaming, height = 260 }: Props) {
  const historicData = useMemo(() => {
    if (!experiments?.length) return [];
    return experiments.slice(0, 30).map(e => ({
      time: e.date,
      value: e.confidence,
      predicted: Math.min(100, e.confidence + (Math.random() - 0.4) * 10),
      upper: Math.min(100, e.confidence + 8),
      lower: Math.max(0, e.confidence - 8),
      isAnomaly: e.anomalies.length > 0,
    })).reverse();
  }, [experiments]);

  const data = isStreaming && streamData?.length ? streamData : historicData;

  const anomalyLines = data
    .filter(d => d.isAnomaly)
    .map(d => d.time);

  return (
    <div style={{ height }} aria-label="Time series chart" role="img">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.07} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
            interval="preserveStartEnd" tickFormatter={v => isStreaming ? v : v.slice(5)} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8, color: '#94a3b8' }} />

          {/* Confidence band */}
          {data.some(d => d.upper != null) && (
            <Area dataKey="upper" stroke="none" fill="url(#gradBand)" legendType="none" dot={false} activeDot={false} />
          )}
          {data.some(d => d.lower != null) && (
            <Area dataKey="lower" stroke="none" fill="none" legendType="none" dot={false} activeDot={false} />
          )}

          {/* AI Prediction */}
          <Area dataKey="predicted" type="monotone" stroke="#8b5cf6" strokeWidth={1.5}
            strokeDasharray="5 3" fill="url(#gradPred)" dot={false}
            name="AI Forecast" />

          {/* Actual values */}
          <Area dataKey="value" type="monotone" stroke="#06b6d4" strokeWidth={2}
            fill="url(#gradValue)" dot={false}
            activeDot={{ r: 4, fill: '#06b6d4', stroke: '#020817', strokeWidth: 2 }}
            name="Observed" />

          {/* Anomaly markers */}
          {anomalyLines.map(t => (
            <ReferenceLine key={t} x={t} stroke="#f59e0b" strokeWidth={1.5}
              strokeDasharray="3 3" label={{ value: '⚠', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

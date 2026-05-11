import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useLabStore } from '../../store/labStore';

export default function PredictiveGhostCharts() {
  const { dataHistory, predictedData } = useLabStore();

  // Combine historical data with predicted data for the chart
  const chartData = useMemo(() => {
    const history = dataHistory.slice(-30).map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: d.temperature,
      pressure: d.pressure / 10, // Scale down for better visualization
      purity: d.purity,
      type: 'historical',
    }));

    const predictions = predictedData.slice(0, 24).map((d) => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: d.temperature,
      pressure: d.pressure / 10,
      purity: d.purity,
      type: 'predicted',
    }));

    return [...history, ...predictions];
  }, [dataHistory, predictedData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-cyan-500/30">
          <p className="text-xs text-slate-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
              {entry.payload?.type === 'predicted' && ' (AI Predicted)'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full space-y-4">
      {/* Temperature Chart */}
      <div className="glass rounded-xl p-4 h-1/2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-cyan-400">Temperature (°C)</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-400">Real-time</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs text-slate-400">AI Predicted</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Real-time data line */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#06b6d4' }}
              connectNulls={false}
              isAnimationActive={false}
            />
            
            {/* Ghost/predicted line */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
              opacity={0.7}
              isAnimationActive={false}
            />
            
            {/* Current time reference line */}
            <ReferenceLine
              x={chartData.find((d) => d.type === 'historical')?.time}
              stroke="#06b6d4"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Purity Chart */}
      <div className="glass rounded-xl p-4 h-1/2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-green-400">Purity (%)</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-slate-400">Real-time</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-slate-400">AI Predicted</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[90, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Real-time data line */}
            <Line
              type="monotone"
              dataKey="purity"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10b981' }}
              isAnimationActive={false}
            />
            
            {/* Ghost/predicted line */}
            <Line
              type="monotone"
              dataKey="purity"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
              opacity={0.7}
              isAnimationActive={false}
            />
            
            {/* Current time reference line */}
            <ReferenceLine
              x={chartData.find((d) => d.type === 'historical')?.time}
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

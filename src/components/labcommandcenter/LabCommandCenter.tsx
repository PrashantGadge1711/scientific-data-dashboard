import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/labStore';
import DigitalTwin from './DigitalTwin';
import PredictiveGhostCharts from './PredictiveGhostCharts';
import NarrativeInsightFeed from './NarrativeInsightFeed';
import { 
  Play, 
  Pause, 
  Activity, 
  Thermometer, 
  Gauge, 
  Droplets,
  FlaskConical,
  Zap
} from 'lucide-react';

export default function LabCommandCenter() {
  const { 
    currentData, 
    isStreaming, 
    startStreaming, 
    stopStreaming
  } = useLabStore();

  useEffect(() => {
    startStreaming();
    return () => stopStreaming();
  }, [startStreaming, stopStreaming]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Space to toggle streaming
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      if (isStreaming) {
        stopStreaming();
      } else {
        startStreaming();
      }
    }
  }, [isStreaming, startStreaming, stopStreaming]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    color 
  }: { 
    icon: any;
    label: string;
    value: number;
    unit: string;
    color: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-xl p-4 border border-white/5"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${color}/20`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex-1">
          <div className="text-xs text-slate-400 mb-1">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white font-mono">{value.toFixed(1)}</span>
            <span className="text-xs text-slate-500">{unit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full h-full cyber-bg min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <FlaskConical className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">2030 Lab Command Center</h1>
            <p className="text-xs text-slate-400">Real-time Molecular Analysis & AI Prediction</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
            <Activity className={`w-4 h-4 ${isStreaming ? 'text-green-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-sm text-slate-300">
              {isStreaming ? 'Streaming Active' : 'Streaming Paused'}
            </span>
          </div>
          
          <button
            onClick={isStreaming ? stopStreaming : startStreaming}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              isStreaming
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30'
            }`}
            aria-label={isStreaming ? 'Pause streaming' : 'Start streaming'}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isStreaming ? 'Pause' : 'Start'}
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <StatCard
          icon={Thermometer}
          label="Temperature"
          value={currentData.temperature}
          unit="°C"
          color="text-cyan-400"
        />
        <StatCard
          icon={Gauge}
          label="Pressure"
          value={currentData.pressure}
          unit="kPa"
          color="text-purple-400"
        />
        <StatCard
          icon={Zap}
          label="Purity"
          value={currentData.purity}
          unit="%"
          color="text-green-400"
        />
        <StatCard
          icon={Droplets}
          label="Flow Rate"
          value={currentData.flowRate}
          unit="L/min"
          color="text-amber-400"
        />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]"
      >
        {/* Digital Twin - Left Panel */}
        <div className="col-span-4 h-full">
          <div className="glass rounded-xl p-4 h-full border border-cyan-500/20 neon-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-sm font-semibold text-cyan-400">Digital Twin</h2>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <DigitalTwin />
            </div>
          </div>
        </div>

        {/* Predictive Charts - Center Panel */}
        <div className="col-span-5 h-full">
          <div className="glass rounded-xl p-4 h-full border border-purple-500/20 neon-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-sm font-semibold text-purple-400">Predictive Analytics</h2>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <PredictiveGhostCharts />
            </div>
          </div>
        </div>

        {/* AI Insight Feed - Right Panel */}
        <div className="col-span-3 h-full">
          <NarrativeInsightFeed />
        </div>
      </motion.div>

      {/* Keyboard Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-slate-500"
      >
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Space</kbd> to toggle streaming • 
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Tab</kbd> to navigate • 
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to interact
      </motion.div>
    </div>
  );
}

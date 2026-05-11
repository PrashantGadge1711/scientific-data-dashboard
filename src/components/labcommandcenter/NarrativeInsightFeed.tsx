import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/labStore';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';

const typeIcons = {
  info: { icon: Info, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-400/10' },
  success: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-400/10' },
  critical: { icon: XCircle, color: 'text-rose-400', bgColor: 'bg-rose-400/10' },
};

export default function NarrativeInsightFeed() {
  const { insights, clearInsights, isStreaming } = useLabStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [insights]);

  const getTypeIcon = (type: keyof typeof typeIcons) => {
    const { icon: Icon, color, bgColor } = typeIcons[type];
    return { Icon, color, bgColor };
  };

  return (
    <div className="w-full h-full flex flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <h2 className="text-sm font-semibold gradient-text">AI Insight Feed</h2>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">LIVE</span>
              </div>
            )}
            <button
              onClick={clearInsights}
              className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
              aria-label="Clear insights"
              tabIndex={0}
            >
              <Clock className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        role="log"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {insights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Activity className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-500">Waiting for AI insights...</p>
              <p className="text-xs text-slate-600 mt-1">Start streaming to begin</p>
            </motion.div>
          ) : (
            insights.map((insight) => {
              const { Icon, color, bgColor } = getTypeIcon(insight.type);
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg ${bgColor} border border-white/5 hover:border-white/10 transition-colors`}
                  role="article"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${bgColor} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400 font-mono">{insight.timestamp}</span>
                        <Zap className="w-3 h-3 text-purple-400" />
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-cyan-500/20">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
            <span className="text-slate-400">Total Insights</span>
            <span className="text-cyan-400 font-mono">{insights.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
            <span className="text-slate-400">Critical</span>
            <span className="text-rose-400 font-mono">
              {insights.filter(i => i.type === 'critical').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

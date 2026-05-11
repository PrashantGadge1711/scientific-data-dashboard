import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Lightbulb, Zap, Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'suggestion' | 'anomaly' | 'optimization' | 'prediction' | 'info';
  timestamp: string;
  experimentId?: string;
  confidence?: number;
}

const CREATIVE_RESPONSES = {
  suggestion: [
    "💡 Consider running a cross-instrument calibration: combining Alpha-1 spectroscopy with Gamma-3 microscopy could reveal hidden correlations in your PCR data.",
    "🧪 Try a temperature gradient approach: your Chromatography runs show 18% better yield at 39°C with a 2°C ramp vs static temperature.",
    "🔬 Anomaly pattern detected: 3 consecutive spikes in Mass Spec data suggest reagent degradation. Switch to batch #B48 for next 48h.",
    "📊 Creative visualization insight: Plot confidence vs time-series on a 3D holographic projection to identify micro-patterns invisible in 2D.",
    "⚡ Workflow optimization: Parallelize NMR and Sequencing runs using your idle Delta-4 capacity — potential 32% throughput increase.",
  ],
  anomaly: [
    "🚨 Critical drift detected in Beta-2: baseline shifted 4.2% over 6 runs. This correlates with humidity changes. Suggest: recalibrate or install environmental controls.",
    "⚠️ Unusual pattern in Epsilon-5: your confidence scores dropped to 67% during the last 3 PCR runs. Root cause analysis suggests reagent pH drift.",
    "🔍 Anomaly cluster identified: 5 experiments on Alpha-1 show outlier readings at 2:00 PM daily. This matches HVAC cycle timing.",
    "📉 Negative correlation detected: as instrument temperature increases, your Sequencing quality decreases by 0.8%/°C above 25°C.",
  ],
  optimization: [
    "🚀 Efficiency boost: Your Chromatography runs are 22% faster when preceded by a 5-min warm-up on Gamma-3. Add this to your protocol.",
    "💎 Hidden opportunity: Your failed runs have 89% of their parameters in the 'optimal' range except for concentration at 0.15 M. Try 0.18 M.",
    "🔄 Workflow suggestion: Batch your Spectroscopy runs in groups of 6 to reduce instrument warm-up overhead. Estimated savings: 45 min/day.",
    "⚡ Energy optimization: Your instruments are idle 34% of the time. Consider a dynamic scheduling algorithm to maximize utilization.",
  ],
  prediction: [
    "🔮 Forecast: Based on historical patterns, expect 2–3 anomalies in PCR runs next week if reagent batch #A47 continues. Suggest: switch to #B52.",
    "📈 Trend prediction: Your NMR confidence is trending upward at 2.3%/week. At this rate, you'll hit 95% by month-end — new lab record!",
    "🎯 Resource prediction: You'll need 3x more Sequencing capacity in Q3 based on current growth. Consider: lease an additional Zeta-6.",
    "🌊 Wave prediction: Anomaly frequency follows a 14-day cycle. Next wave expected in 6 days. Prepare: increase monitoring frequency.",
  ],
  info: [
    "📊 Lab insight: Your overall confidence average is 89.2% — 4.3% above the global lab benchmark. You're in the top quartile!",
    "🏆 Achievement unlocked: 23 consecutive anomaly-free runs on Delta-4. This is your longest streak this quarter.",
    "🔬 Science fact: The correlation you found between temperature and Chromatography yield matches a 2023 Nature paper. You're on the cutting edge!",
    "📈 Metric highlight: Your time-to-result has improved by 18% this month. This is your fastest operational performance ever.",
  ],
};

function getRandomResponse(type: keyof typeof CREATIVE_RESPONSES): string {
  const responses = CREATIVE_RESPONSES[type];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function AIAssistant() {
  const { state } = useApp();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hello! I'm your AI Lab Assistant. I can help with:\n\n• Predictive experiment suggestions\n• Anomaly context & explanations\n• Workflow optimization\n• Creative data insights\n• Protocol recommendations\n\nWhat would you like to explore?",
      type: 'info',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const keywords = input.toLowerCase();
      let type: keyof typeof CREATIVE_RESPONSES = 'info';
      let response = getRandomResponse('info');

      if (keywords.includes('anomaly') || keywords.includes('error') || keywords.includes('spike')) {
        type = 'anomaly';
        response = getRandomResponse('anomaly');
      } else if (keywords.includes('optimize') || keywords.includes('faster') || keywords.includes('efficiency')) {
        type = 'optimization';
        response = getRandomResponse('optimization');
      } else if (keywords.includes('predict') || keywords.includes('forecast') || keywords.includes('future')) {
        type = 'prediction';
        response = getRandomResponse('prediction');
      } else if (keywords.includes('suggest') || keywords.includes('idea') || keywords.includes('try')) {
        type = 'suggestion';
        response = getRandomResponse('suggestion');
      }

      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        type,
        timestamp: new Date().toISOString(),
        confidence: Math.floor(75 + Math.random() * 20),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const TYPE_ICONS: Record<'suggestion' | 'anomaly' | 'optimization' | 'prediction' | 'info', React.ElementType> = {
    suggestion: Lightbulb,
    anomaly: AlertCircle,
    optimization: Zap,
    prediction: TrendingUp,
    info: Sparkles,
  };

  const TYPE_COLORS: Record<'suggestion' | 'anomaly' | 'optimization' | 'prediction' | 'info', string> = {
    suggestion: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    anomaly: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    optimization: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    prediction: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    info: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="h-full flex flex-col glass border-l border-slate-700/40 bg-slate-950/50">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-700/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-slate-100">AI Lab Assistant</h2>
          <p className="text-[10px] text-slate-500">Creative insights & predictions</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 stream-dot" aria-hidden="true" />
          <span className="text-[10px] text-emerald-400">Online</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-slate-700/20 flex gap-2 overflow-x-auto">
        {[
          { label: 'Suggest', type: 'suggestion' as const, icon: Lightbulb },
          { label: 'Analyze', type: 'anomaly' as const, icon: AlertCircle },
          { label: 'Optimize', type: 'optimization' as const, icon: Zap },
          { label: 'Predict', type: 'prediction' as const, icon: TrendingUp },
        ].map(({ label, type, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setInput(`Give me a ${type.toLowerCase()} for my lab`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-cyan-500/30 text-[10px] font-medium transition-all flex-shrink-0"
          >
            <Icon className="w-3 h-3" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 ${
                isUser
                  ? 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white'
                  : 'glass border border-slate-700/30 text-slate-200'
              }`}>
                {!isUser && msg.type && (
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium mb-2 ${TYPE_COLORS[msg.type] || TYPE_COLORS.info} border`}>
                    {(() => {
                      const Icon = TYPE_ICONS[msg.type] || TYPE_ICONS.info;
                      return <Icon className="w-3 h-3" aria-hidden="true" as any />;
                    })()}
                    {msg.type}
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                {!isUser && msg.confidence && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-700/30">
                    <CheckCircle className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                    <span className="text-[10px] text-slate-500">Confidence: {msg.confidence}%</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass border border-slate-700/30 rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-700/30 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about experiments, anomalies, optimizations..."
          aria-label="Message AI assistant"
          className="flex-1 glass rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none bg-slate-900"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Context Stats */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-slate-700/20 grid grid-cols-3 gap-2 text-[10px] text-slate-500">
        <div className="text-center">
          <p className="font-semibold text-slate-300">{state.experiments.length}</p>
          <p>Experiments</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-300">{state.experiments.filter(e => e.anomalies.length > 0).length}</p>
          <p>With Anomalies</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-300">{Math.round(state.experiments.reduce((a, e) => a + e.confidence, 0) / state.experiments.length)}%</p>
          <p>Avg Confidence</p>
        </div>
      </div>
    </div>
  );
}

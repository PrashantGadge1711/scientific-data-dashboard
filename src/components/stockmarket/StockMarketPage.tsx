import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { Exchange } from '../../types';
import { getIndicesByExchange } from '../../data/stockMarketData';

export default function StockMarketPage() {
  const [selectedExchange, setSelectedExchange] = useState<Exchange>('NSE');
  const indices = getIndicesByExchange(selectedExchange);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-100">Stock Market Indices</h1>
          <p className="text-xs text-slate-500">Real-time market data</p>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 py-2 border-b border-slate-700/30 flex gap-2">
        <button
          onClick={() => setSelectedExchange('NSE')}
          aria-pressed={selectedExchange === 'NSE'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedExchange === 'NSE'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
          }`}
        >
          <Activity className="w-4 h-4" aria-hidden="true" />
          NSE
        </button>
        <button
          onClick={() => setSelectedExchange('BSE')}
          aria-pressed={selectedExchange === 'BSE'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedExchange === 'BSE'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
          }`}
        >
          <BarChart3 className="w-4 h-4" aria-hidden="true" />
          BSE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-4 p-4 rounded-xl glass border border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Selected Exchange</p>
              <p className="text-lg font-bold text-slate-100">
                {selectedExchange === 'NSE' ? 'National Stock Exchange' : 'Bombay Stock Exchange'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Total Indices</p>
              <p className="text-lg font-bold text-slate-100">{indices.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {indices.map((index) => (
            <div key={index.symbol} className="glass rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-slate-400">{index.symbol}</p>
                  <p className="text-sm font-semibold text-slate-100 mt-1">{index.name}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  index.change >= 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {index.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-3 h-3" aria-hidden="true" />
                  )}
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-slate-500">Price</p>
                  <p className="text-lg font-bold text-slate-100 font-mono">
                    {index.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-slate-500">Change</p>
                  <p className={`text-sm font-mono ${index.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-slate-500">High</p>
                  <p className="text-xs font-mono text-slate-300">
                    {index.high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-slate-500">Low</p>
                  <p className="text-xs font-mono text-slate-300">
                    {index.low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-slate-500">Volume</p>
                  <p className="text-xs font-mono text-slate-300">
                    {(index.volume / 10000000).toFixed(1)}Cr
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

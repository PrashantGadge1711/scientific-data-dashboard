import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { validateEmail } from '../../utils/validation';
import { getCurrentYearString } from '../../utils/date';
import { AppSettings } from '../../types';

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button role="switch" aria-checked={checked} aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${checked ? 'bg-gradient-to-r from-cyan-500 to-violet-500' : 'bg-slate-700'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`}
          style={{ left: checked ? '22px' : '2px' }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState('');

  function update(patch: Partial<AppSettings>) {
    dispatch({ type: 'UPDATE_SETTINGS', payload: patch });
  }

  function handleSave() {
    if (state.settings.autoReports && !validateEmail(state.settings.reportEmail)) {
      setEmailError('Enter a valid email address'); return;
    }
    setEmailError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const s = state.settings;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-100">Settings</h1>
          <p className="text-xs text-slate-500">Configure lab environment and automation</p>
        </div>
        <button onClick={handleSave} aria-label="Save settings"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            saved ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-gradient-to-r from-cyan-600 to-violet-600 text-white hover:from-cyan-500 hover:to-violet-500'
          }`}>
          {saved ? <><CheckCircle className="w-3.5 h-3.5" />Saved!</> : <><Save className="w-3.5 h-3.5" />Save</>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl space-y-5">
          {/* Futuristic features */}
          <section className="glass rounded-xl p-5 border border-slate-700/30" aria-label="Futuristic features">
            <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">{getCurrentYearString()} Features</h2>
            <p className="text-xs text-slate-500 mb-4">Experimental capabilities from the future of lab science</p>
            <Toggle checked={s.emotionAdaptiveUI} onChange={v => update({ emotionAdaptiveUI: v })}
              label="Emotion-Adaptive UI" description="Dynamically adjusts UI colors and intensity based on detected user mood" />
            <Toggle checked={s.neuralInterface} onChange={v => update({ neuralInterface: v })}
              label="Neural Interface (BCI)" description="Experimental: hands-free control via EEG headset integration" />
            <Toggle checked={s.arvrVisualization} onChange={v => update({ arvrVisualization: v })}
              label="AR/VR Holographic Charts" description="3D holographic perspective on time-series and experiment data" />
            <Toggle checked={s.quantumSecurity} onChange={v => update({ quantumSecurity: v })}
              label="Quantum-Resistant Security" description="AES-512 + CRYSTALS-Kyber post-quantum encryption on all exports" />
          </section>

          {/* Data & refresh */}
          <section className="glass rounded-xl p-5 border border-slate-700/30" aria-label="Data settings">
            <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-4">Data & Streaming</h2>
            <Toggle checked={s.autoRefresh} onChange={v => update({ autoRefresh: v })}
              label="Auto-Refresh Dashboard" description="Automatically refresh metrics and charts" />
            {s.autoRefresh && (
              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="interval" className="text-xs text-slate-400 w-32 flex-shrink-0">Refresh interval</label>
                <input id="interval" type="range" min={5} max={120} step={5} value={s.refreshInterval}
                  onChange={e => update({ refreshInterval: Number(e.target.value) })}
                  aria-label={`Refresh every ${s.refreshInterval} seconds`}
                  className="flex-1 accent-cyan-500" />
                <span className="text-xs text-slate-300 font-mono w-12 text-right">{s.refreshInterval}s</span>
              </div>
            )}
            <Toggle checked={s.enableBiometric} onChange={v => update({ enableBiometric: v })}
              label="Biometric Authentication" description="Enable fingerprint and retina scan login" />
          </section>

          {/* Reports */}
          <section className="glass rounded-xl p-5 border border-slate-700/30" aria-label="Report settings">
            <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4">Auto-Reports</h2>
            <Toggle checked={s.autoReports} onChange={v => update({ autoReports: v })}
              label="Zero-Click Auto-Reports" description="AI generates and emails reports automatically" />
            {s.autoReports && (
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="reportFreq" className="block text-xs text-slate-400 mb-1.5">Report frequency</label>
                  <select id="reportFreq" value={s.reportFrequency}
                    onChange={e => update({ reportFrequency: e.target.value as AppSettings['reportFrequency'] })}
                    className="glass rounded-lg px-3 py-2 text-xs text-slate-300 border border-slate-700/50 focus:outline-none bg-slate-900 w-40">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="reportEmail" className="block text-xs text-slate-400 mb-1.5">Report email</label>
                  <input id="reportEmail" type="email" value={s.reportEmail}
                    onChange={e => { update({ reportEmail: e.target.value }); setEmailError(''); }}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    className="glass rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-500 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none w-72" />
                  {emailError && <p id="email-error" role="alert" className="text-rose-400 text-xs mt-1">{emailError}</p>}
                </div>
              </div>
            )}
          </section>

          {/* Accessibility */}
          <section className="glass rounded-xl p-5 border border-slate-700/30" aria-label="Accessibility settings">
            <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">Accessibility</h2>
            <Toggle checked={s.highContrast} onChange={v => update({ highContrast: v })}
              label="High Contrast Mode" description="Enhanced contrast for better visibility" />
            <Toggle checked={s.screenReader} onChange={v => update({ screenReader: v })}
              label="Screen Reader Optimized" description="Enhanced ARIA labels and keyboard navigation hints" />
          </section>

          {/* Danger zone */}
          <section className="glass rounded-xl p-5 border border-rose-500/20" aria-label="Danger zone">
            <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-4">Session</h2>
            <button onClick={() => dispatch({ type: 'LOGOUT' })}
              className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-400 text-xs font-medium hover:bg-rose-500/10 transition-colors">
              Sign Out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

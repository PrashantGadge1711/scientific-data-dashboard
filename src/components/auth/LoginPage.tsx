import { useState } from 'react';
import { Eye, EyeOff, Shield, Cpu, Activity, Zap, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkPasswordStrength } from '../../utils/validation';
import { getCurrentYearString } from '../../utils/date';
import { User } from '../../types';

type AuthMode = 'credentials' | 'biometric' | 'sso';
type ScanStep = 'idle' | 'scanning' | 'verified' | 'failed';

const DEMO_USER: User = {
  id: 'u1', name: 'Dr. Alex Chen', email: 'alex.chen@nexlab.io',
  role: 'researcher', avatar: 'AC', lastLogin: new Date().toISOString(),
};

export default function LoginPage() {
  const { dispatch } = useApp();
  const [mode, setMode] = useState<AuthMode>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [scanStep, setScanStep] = useState<ScanStep>('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = checkPasswordStrength(password);

  function doLogin() {
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: DEMO_USER });
      setLoading(false);
    }, 1200);
  }

  function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    doLogin();
  }

  function handleBiometric() {
    setScanStep('scanning');
    setTimeout(() => setScanStep('verified'), 3000);
    setTimeout(() => doLogin(), 3800);
  }

  const STRENGTH_COLORS: Record<string, string> = {
    rose: 'bg-rose-500', orange: 'bg-orange-500',
    amber: 'bg-amber-500', lime: 'bg-lime-500', emerald: 'bg-emerald-500',
  };

  return (
    <div className="min-h-screen flex overflow-hidden cyber-bg">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30" />
        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(6,182,212,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.1) 0%, transparent 60%)' }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-cyan-400 tracking-widest font-mono uppercase">NexLab</p>
              <p className="text-sm font-bold text-white">Analytics Dashboard</p>
            </div>
          </div>

          {/* Biometric visual */}
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <div className="relative w-52 h-52 flex items-center justify-center mb-8">
              {/* Pulsing rings */}
              <div className="absolute w-52 h-52 rounded-full border border-cyan-500/20 scanner-ring" style={{ animationDelay: '0s' }} />
              <div className="absolute w-40 h-40 rounded-full border border-cyan-500/30 scanner-ring" style={{ animationDelay: '0.7s' }} />
              <div className="absolute w-28 h-28 rounded-full border border-violet-500/30 scanner-ring" style={{ animationDelay: '1.4s' }} />

              {/* Fingerprint SVG */}
              <div className="relative w-36 h-36 scanner-container rounded-full border border-cyan-500/20 bg-slate-900/60 flex items-center justify-center">
                <div className="scanner-line" />
                <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-80" fill="none" stroke="rgba(6,182,212,0.7)" strokeWidth="1.5">
                  <path className="fp-path" d="M50 15 C28 15 15 28 15 50 C15 72 28 85 50 85 C72 85 85 72 85 50 C85 38 79 28 70 21" />
                  <path className="fp-path" d="M50 25 C33 25 23 35 23 50 C23 65 33 75 50 75 C67 75 77 65 77 50 C77 42 73 35 66 29" style={{ animationDelay: '0.2s' }} />
                  <path className="fp-path" d="M50 35 C38 35 31 42 31 50 C31 58 38 65 50 65 C62 65 69 58 69 50 C69 45 66 40 61 37" style={{ animationDelay: '0.4s' }} />
                  <path className="fp-path" d="M50 45 C44 45 40 47 40 50 C40 53 44 56 50 56 C56 56 60 53 60 50 C60 48 58 46 55 45" style={{ animationDelay: '0.6s' }} />
                  <circle cx="50" cy="50" r="3" fill="rgba(6,182,212,0.6)" />
                  <path className="fp-path" d="M35 38 C32 42 30 46 30 50 C30 61 39 69 50 69" style={{ animationDelay: '0.8s' }} />
                  <path className="fp-path" d="M65 38 C68 42 70 46 70 50 C70 61 61 69 50 69" style={{ animationDelay: '1.0s' }} />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold gradient-text mb-2">Biometric Identity</h2>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              Multi-factor quantum-secured authentication with retina + fingerprint verification
            </p>

            <div className="mt-6 flex items-center gap-6">
              {[
                { icon: Shield, label: 'Quantum Secured', color: 'text-cyan-400' },
                { icon: Cpu, label: 'Neural Verified', color: 'text-violet-400' },
                { icon: Zap, label: 'Zero-Latency', color: 'text-amber-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center">© {getCurrentYearString()} NexLab Systems · Quantum-Ready · GDPR Compliant</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-slate-950/50 lg:bg-transparent" />
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-cyan-400" />
              <span className="text-lg font-bold gradient-text">NexLab Analytics</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your research workspace</p>
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-xl p-1 glass mb-6" role="tablist" aria-label="Login method">
            {(['credentials', 'biometric', 'sso'] as AuthMode[]).map(m => (
              <button key={m} role="tab" aria-selected={mode === m}
                onClick={() => { setMode(m); setError(''); setScanStep('idle'); }}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                  mode === m ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}>
                {m === 'biometric' ? 'Biometric' : m === 'sso' ? 'SSO' : 'Password'}
              </button>
            ))}
          </div>

          {/* Credentials form */}
          {mode === 'credentials' && (
            <form onSubmit={handleCredentials} className="space-y-4" aria-label="Login form">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">Email / Username</label>
                <input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="username" aria-required="true"
                  placeholder="researcher@lab.com"
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all" />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input id="password" type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} autoComplete="current-password" aria-required="true"
                    placeholder="Min 12 chars, mixed case + symbols"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all pr-10" />
                  <button type="button" aria-label={showPw ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength meter */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          i < strength.score ? STRENGTH_COLORS[strength.color] : 'bg-slate-700'
                        }`} />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`text-${strength.color}-400`}>{strength.label}</span>
                      <span className="text-slate-500">Entropy: {strength.entropy}bit</span>
                    </div>
                    {strength.suggestions.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">{strength.suggestions[0]}</p>
                    )}
                  </div>
                )}
              </div>
              {error && <p role="alert" className="text-rose-400 text-xs flex items-center gap-1"><span>⚠</span>{error}</p>}
              <button type="submit" disabled={loading} aria-busy={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-cyan">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authenticating...</> : <>Sign In <ChevronRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-xs text-slate-500">
                Or try with <button type="button" onClick={() => { setEmail('demo'); setPassword('DemoPass123!'); }}
                  className="text-cyan-400 hover:text-cyan-300 underline">demo credentials</button>
              </p>
            </form>
          )}

          {/* Biometric mode */}
          {mode === 'biometric' && (
            <div className="flex flex-col items-center gap-6 py-4" aria-live="polite">
              <div className={`relative w-32 h-32 scanner-container rounded-full flex items-center justify-center cursor-pointer
                ${scanStep === 'idle' ? 'glass border border-slate-600' : ''}
                ${scanStep === 'scanning' ? 'border border-cyan-500/50 glow-cyan' : ''}
                ${scanStep === 'verified' ? 'border border-emerald-500/50 glow-green' : ''}
                ${scanStep === 'failed' ? 'border border-rose-500/50' : ''}`}
                onClick={scanStep === 'idle' ? handleBiometric : undefined}
                role="button" tabIndex={0} aria-label="Start biometric scan"
                onKeyDown={e => e.key === 'Enter' && scanStep === 'idle' && handleBiometric()}>
                {scanStep === 'scanning' && <div className="scanner-line" />}
                <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
                  <circle cx="40" cy="32" r="10" stroke={scanStep === 'verified' ? '#10b981' : '#06b6d4'} strokeWidth="1.5" opacity="0.8" />
                  <path d="M40 42 C28 42 20 50 20 60 L60 60 C60 50 52 42 40 42Z" stroke={scanStep === 'verified' ? '#10b981' : '#06b6d4'} strokeWidth="1.5" opacity="0.8" />
                  {scanStep === 'scanning' && <circle cx="40" cy="32" r="14" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 2" opacity="0.5"><animateTransform attributeName="transform" type="rotate" values="0 40 32;360 40 32" dur="3s" repeatCount="indefinite" /></circle>}
                  {scanStep === 'verified' && <path d="M28 38 L36 46 L52 28" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
              </div>
              <div className="text-center">
                {scanStep === 'idle' && <><p className="text-white font-medium">Touch to Scan</p><p className="text-slate-400 text-sm mt-1">Place finger or look at camera</p></>}
                {scanStep === 'scanning' && <><p className="text-cyan-400 font-medium animate-pulse">Scanning...</p><p className="text-slate-400 text-sm mt-1">Hold still — multi-factor verification</p></>}
                {scanStep === 'verified' && <><p className="text-emerald-400 font-medium">Identity Confirmed</p><p className="text-slate-400 text-sm mt-1">Redirecting to dashboard...</p></>}
                {scanStep === 'failed' && <><p className="text-rose-400 font-medium">Scan Failed</p><button onClick={() => setScanStep('idle')} className="text-cyan-400 text-sm underline mt-1">Try again</button></>}
              </div>
            </div>
          )}

          {/* SSO mode */}
          {mode === 'sso' && (
            <div className="space-y-3" aria-label="SSO options">
              {[
                { name: 'Google Workspace', icon: '🔵', color: 'hover:border-blue-500/50' },
                { name: 'Microsoft Azure AD', icon: '🔷', color: 'hover:border-blue-600/50' },
                { name: 'Okta', icon: '🔒', color: 'hover:border-cyan-500/50' },
                { name: 'LabOS Enterprise', icon: '⚗', color: 'hover:border-violet-500/50' },
              ].map(provider => (
                <button key={provider.name} onClick={doLogin}
                  className={`w-full glass rounded-xl px-4 py-3.5 text-sm text-slate-200 flex items-center gap-3 border border-slate-700/50 ${provider.color} transition-all hover:bg-white/5`}>
                  <span className="text-lg">{provider.icon}</span>
                  <span>Continue with {provider.name}</span>
                  <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs text-slate-600">
            <Shield className="w-3 h-3" />
            <span>256-bit quantum-resistant encryption · Zero-knowledge proofs · SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </div>
  );
}

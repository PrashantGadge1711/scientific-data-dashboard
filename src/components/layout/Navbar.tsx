import { Bell, Sun, Moon, Menu, LogOut, User, Settings, Activity } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { state, dispatch } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = state.notifications.filter(n => !n.read).length;

  return (
    <header className="h-14 flex items-center px-4 gap-3 glass border-b border-slate-700/40 relative z-30" role="banner">
      {/* Sidebar toggle */}
      <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        aria-label="Toggle sidebar" aria-expanded={!state.sidebarCollapsed}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors">
        <Menu className="w-4 h-4" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <Activity className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </div>
        <span className="font-bold text-sm gradient-text hidden sm:block">Lab Analytics</span>
      </div>

      {/* Streaming indicator */}
      {state.streamingActive && (
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 stream-dot" aria-hidden="true" />
          <span className="text-xs text-emerald-400 font-medium">Live Stream</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' })}
          aria-label={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors">
          {state.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'notifications' })}
          aria-label={`Notifications${unread ? ` — ${unread} unread` : ''}`}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center" aria-hidden="true">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => setProfileOpen(p => !p)}
            aria-label="User profile menu" aria-haspopup="true" aria-expanded={profileOpen}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-violet-700 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity ml-1">
            {state.user?.avatar ?? 'U'}
          </button>
          {profileOpen && (
            <div role="menu" className="absolute right-0 top-10 w-52 glass rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-700/40">
                <p className="text-sm font-semibold text-slate-100">{state.user?.name}</p>
                <p className="text-xs text-slate-400">{state.user?.email}</p>
                <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
                  {state.user?.role}
                </span>
              </div>
              {[
                { icon: User, label: 'Profile', action: () => {} },
                { icon: Settings, label: 'Settings', action: () => { dispatch({ type: 'SET_PAGE', payload: 'settings' }); setProfileOpen(false); } },
                { icon: LogOut, label: 'Sign Out', action: () => dispatch({ type: 'LOGOUT' }) },
              ].map(({ icon: Icon, label, action }) => (
                <button key={label} role="menuitem" onClick={action}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                  <Icon className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

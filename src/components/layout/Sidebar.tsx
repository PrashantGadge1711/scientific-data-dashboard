import { LayoutDashboard, FlaskConical, FileText, Settings, Bell, ChevronLeft, Cpu, Brain, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';

const NAV_ITEMS: { page: Page; icon: React.ElementType; label: string; badge?: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'experiments', icon: FlaskConical, label: 'Experiments' },
  { page: 'data-import', icon: Database, label: 'Data Import' },
  { page: 'reports', icon: FileText, label: 'Reports' },
  { page: 'ai-assistant', icon: Brain, label: 'AI Assistant' },
  { page: 'settings', icon: Settings, label: 'Settings' },
  { page: 'notifications', icon: Bell, label: 'Alerts' },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const collapsed = state.sidebarCollapsed;
  const unread = state.notifications.filter(n => !n.read).length;

  return (
    <aside
      className={`flex flex-col glass border-r border-slate-700/40 transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'} flex-shrink-0`}
      aria-label="Main navigation">
      <nav className="flex-1 py-3 space-y-0.5 px-2" role="navigation">
        {NAV_ITEMS.map(({ page, icon: Icon, label }) => {
          const active = state.currentPage === page;
          const badge = page === 'notifications' && unread > 0 ? String(unread > 9 ? '9+' : unread) : undefined;
          return (
            <button key={page} onClick={() => dispatch({ type: 'SET_PAGE', payload: page })}
              aria-label={label} aria-current={active ? 'page' : undefined}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${active
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
              <div className={`relative flex-shrink-0 w-5 h-5 flex items-center justify-center ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
                {badge && !collapsed && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center" aria-hidden="true">
                    {badge}
                  </span>
                )}
              </div>
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              {!collapsed && badge && (
                <span className="ml-auto flex-shrink-0 px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Agent footer */}
      {!collapsed && (
        <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 'ai-assistant' })}
          className="p-3 mx-2 mb-3 rounded-xl bg-violet-500/5 border border-violet-500/15 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center ai-pulse flex-shrink-0">
              <Cpu className="w-3 h-3 text-white" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-violet-300">AI Lab Agent</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {state.aiInsights[0]?.description.substring(0, 60) ?? 'Analyzing experiment patterns...'}
            {(state.aiInsights[0]?.description.length ?? 0) > 60 ? '…' : ''}
          </p>
        </button>
      )}

      {/* Collapse toggle */}
      <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="mx-2 mb-3 p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all flex items-center justify-center">
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
    </aside>
  );
}

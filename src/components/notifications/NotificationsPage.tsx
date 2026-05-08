import { Bell, AlertTriangle, CheckCircle, Info, X, BellOff, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

const TYPE_CFG: Record<AppNotification['type'], { icon: React.ElementType; color: string; bg: string }> = {
  anomaly: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
  warning: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/5 border-orange-500/20' },
  ai_suggestion: { icon: Bell, color: 'text-violet-400', bg: 'bg-violet-500/5 border-violet-500/20' },
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { state, dispatch } = useApp();
  const unread = state.notifications.filter(n => !n.read).length;

  function markAllRead() {
    dispatch({ type: 'MARK_ALL_READ' });
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-slate-100">Notifications</h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold border border-rose-500/20">
              {unread} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAllRead} aria-label="Mark all as read"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-slate-700/40 text-slate-400 hover:text-slate-200 text-xs transition-colors">
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
              Mark all read
            </button>
          )}
          <button onClick={() => state.notifications.forEach(n => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id }))}
            aria-label="Clear all notifications"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-slate-700/40 text-slate-400 hover:text-rose-400 text-xs transition-colors">
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Clear all
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {state.notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BellOff className="w-10 h-10 text-slate-700 mb-3" aria-hidden="true" />
            <p className="text-slate-400 font-medium">No notifications</p>
            <p className="text-xs text-slate-600 mt-1">Anomaly alerts and AI events will appear here</p>
          </div>
        ) : (
          <div className="space-y-2" role="feed" aria-label="Notifications">
            {state.notifications.map(notif => {
              const { icon: Icon, color, bg } = TYPE_CFG[notif.type] ?? TYPE_CFG.info;
              return (
                <article key={notif.id} role="article"
                  className={`rounded-xl p-4 border transition-all ${bg} ${!notif.read ? 'ring-1 ring-cyan-500/10' : 'opacity-70'}`}
                  aria-label={notif.read ? notif.title : `Unread: ${notif.title}`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-semibold truncate ${notif.read ? 'text-slate-300' : 'text-slate-100'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400" aria-label="Unread" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-600 mt-1.5 font-mono">{timeAgo(notif.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notif.read && (
                        <button onClick={() => dispatch({ type: 'MARK_ALL_READ' })}
                          aria-label="Mark as read"
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 text-slate-600 hover:text-slate-300 transition-colors">
                          <Bell className="w-3 h-3" aria-hidden="true" />
                        </button>
                      )}
                      <button onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id })}
                        aria-label="Dismiss notification"
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 text-slate-600 hover:text-rose-400 transition-colors">
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

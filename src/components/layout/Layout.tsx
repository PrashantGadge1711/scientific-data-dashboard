import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

interface LayoutProps { children: ReactNode; }

export default function Layout({ children }: LayoutProps) {
  const { state } = useApp();
  const emotionClass = state.settings.emotionAdaptiveUI ? `emotion-${state.emotionMode}` : 'emotion-neutral';

  return (
    <div className={`h-screen flex flex-col ${emotionClass} ${state.theme === 'light' ? 'light-mode' : ''}`}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto cyber-bg" id="main-content" tabIndex={-1} aria-label="Main content">
          <div className="page-enter h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

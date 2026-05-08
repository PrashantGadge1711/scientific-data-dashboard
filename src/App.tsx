import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/auth/LoginPage';
import Layout from './components/layout/Layout';
import DashboardPage from './components/dashboard/DashboardPage';
import ExperimentsPage from './components/experiments/ExperimentsPage';
import ReportsPage from './components/reports/ReportsPage';
import SettingsPage from './components/settings/SettingsPage';
import NotificationsPage from './components/notifications/NotificationsPage';
import AIAssistant from './components/ai/AIAssistant';
import DataImport from './components/import/DataImport';

function AppInner() {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  const PAGE_MAP = {
    dashboard: <DashboardPage />,
    experiments: <ExperimentsPage />,
    'data-import': <DataImport />,
    reports: <ReportsPage />,
    'ai-assistant': <AIAssistant />,
    settings: <SettingsPage />,
    notifications: <NotificationsPage />,
  };

  return (
    <Layout>
      {PAGE_MAP[state.currentPage]}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

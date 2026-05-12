# Scientific Data Dashboard

A futuristic Lab Analytics Dashboard with advanced UI, authentication, data visualization, AI insights, and automation capabilities.

## Features

- **Authentication**: Biometric, credentials, and SSO login with futuristic UI
- **Dashboard**: Real-time metrics, time-series charts, AI-generated insights
- **Experiments**: Comprehensive experiment management with anomaly detection
- **AI Assistant**: Creative chat interface with predictive suggestions and workflow optimization
- **Data Import**: CSV/JSON file upload with drag-drop support
- **Reports**: Advanced reporting with KPIs, trend analysis, narrative insights, accessibility scanner, cross-experiment comparison, predictive forecasts, and interactive story mode
- **Notifications**: Real-time alerts for anomalies and AI events
- **Settings**: Futuristic features including emotion-adaptive UI, neural interface, AR/VR visualization, quantum-resistant encryption

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)
- jsPDF (PDF export)
- PapaParse (CSV parsing)
- Zustand (state management - ready for migration)
- D3.js, Chart.js (visualization libraries - ready for migration)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── components/       # React components (auth, dashboard, experiments, etc.)
├── context/          # React Context for state management
├── store/            # Zustand store (ready for migration)
├── data/             # Demo data generation
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── utils/            # Utility functions (analytics, export, import, etc.)
```

## License

MIT

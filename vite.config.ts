import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts-vendor': ['recharts', 'chart.js', 'react-chartjs-2'],
          'utils-vendor': ['date-fns', 'papaparse'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          'd3-vendor': ['d3'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})

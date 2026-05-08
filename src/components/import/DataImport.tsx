import { useState, useRef } from 'react';
import { Upload, FileText, Database, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { importLabData, exportToJSON } from '../../utils/import';
import { Experiment } from '../../types';

export default function DataImport() {
  const { state, dispatch } = useApp();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    const importResult = await importLabData(file);

    if (importResult.success && importResult.data) {
      // Merge imported data with existing experiments
      dispatch({ type: 'ADD_EXPERIMENTS', payload: importResult.data });
      setResult({
        success: true,
        message: `Successfully imported ${importResult.importedCount} experiments`,
        count: importResult.importedCount,
      });
    } else {
      setResult({
        success: false,
        message: importResult.error || 'Import failed',
      });
    }

    setImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportJSON = () => {
    exportToJSON(state.experiments, 'lab-data-export.json');
  };

  const handleDownloadTemplate = () => {
    const template: Experiment = {
      id: 'EXP-0001',
      name: 'Template Experiment',
      date: new Date().toISOString(),
      experimentType: 'Spectroscopy',
      instrument: 'Alpha-1',
      status: 'Completed',
      operator: 'Dr. Smith',
      parameters: { temperature: 25, duration: 60, concentration: 1.0 },
      rawValues: [85.2, 87.1, 86.8, 88.3, 87.9],
      timeSeriesData: [
        { timestamp: '2024-01-01T00:00:00Z', value: 85.2 },
        { timestamp: '2024-01-01T00:05:00Z', value: 87.1 },
      ],
      resultSummary: 'Successful run with no anomalies',
      anomalies: [],
      tags: ['template'],
      confidence: 92,
    };
    const blob = new Blob([JSON.stringify([template], null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'import-template.json';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-700/30 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-100">Data Import</h1>
          <p className="text-xs text-slate-500">Import CSV/JSON lab instrument data</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-3xl space-y-6">
          {/* Import Section */}
          <div className="glass rounded-xl p-6 border border-slate-700/30">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Import Data
            </h2>

            <div className="space-y-4">
              {/* File Upload */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  importing
                    ? 'border-slate-700 bg-slate-800/50'
                    : 'border-slate-600 hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer'
                }`}
                onClick={() => !importing && fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleFileUpload(event);
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.json"
                  className="hidden"
                  aria-label="Upload data file"
                />
                <div className="flex flex-col items-center gap-3">
                  {importing ? (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" aria-hidden="true" />
                      <p className="text-sm text-slate-400">Importing data...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                        <Database className="w-6 h-6 text-slate-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">Drop CSV or JSON file here</p>
                        <p className="text-xs text-slate-500 mt-1">or click to browse</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Result Message */}
              {result && (
                <div className={`flex items-start gap-3 p-3 rounded-lg ${
                  result.success
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-rose-500/10 border border-rose-500/20'
                }`}>
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${result.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {result.success ? 'Import Successful' : 'Import Failed'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{result.message}</p>
                  </div>
                </div>
              )}

              {/* Supported Formats */}
              <div className="flex gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>CSV files</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>JSON files</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="glass rounded-xl p-6 border border-slate-700/30">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-violet-400" aria-hidden="true" />
              Export Data
            </h2>

            <div className="space-y-3">
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass border border-slate-700/40 text-slate-300 hover:text-slate-100 hover:border-cyan-500/30 text-sm font-medium transition-all"
              >
                <Database className="w-4 h-4" aria-hidden="true" />
                Export All Experiments as JSON
              </button>

              <button
                onClick={handleDownloadTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass border border-slate-700/40 text-slate-300 hover:text-slate-100 hover:border-cyan-500/30 text-sm font-medium transition-all"
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                Download Import Template
              </button>
            </div>
          </div>

          {/* Current Stats */}
          <div className="glass rounded-xl p-6 border border-slate-700/30">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Current Data
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <p className="text-2xl font-bold text-cyan-400">{state.experiments.length}</p>
                <p className="text-xs text-slate-500 mt-1">Total Experiments</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <p className="text-2xl font-bold text-amber-400">
                  {state.experiments.filter(e => e.anomalies.length > 0).length}
                </p>
                <p className="text-xs text-slate-500 mt-1">With Anomalies</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <p className="text-2xl font-bold text-emerald-400">
                  {Math.round(state.experiments.reduce((a, e) => a + e.confidence, 0) / state.experiments.length)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Avg Confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

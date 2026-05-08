import Papa from 'papaparse';
import { Experiment } from '../types';

export interface ImportResult {
  success: boolean;
  data?: Experiment[];
  error?: string;
  importedCount?: number;
}

export function parseCSV(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const experiments: Experiment[] = results.data.map((row: any, index: number) => {
            // Map CSV columns to Experiment type
            return {
              id: row.id || `IMP-${String(index + 1).padStart(4, '0')}`,
              name: row.name || row.experiment_name || `Imported Experiment ${index + 1}`,
              date: row.date || new Date().toISOString(),
              experimentType: row.experimentType || row.type || 'Spectroscopy',
              instrument: row.instrument || 'Alpha-1',
              status: row.status || 'Completed',
              operator: row.operator || 'Unknown',
              parameters: {
                temperature: parseFloat(row.temperature) || 25,
                duration: parseFloat(row.duration) || 60,
                concentration: parseFloat(row.concentration) || 1.0,
                pH: row.pH ? parseFloat(row.pH) : undefined,
                pressure: row.pressure ? parseFloat(row.pressure) : undefined,
              },
              rawValues: row.rawValues ? JSON.parse(row.rawValues) : [],
              timeSeriesData: row.timeSeriesData ? JSON.parse(row.timeSeriesData) : [],
              resultSummary: row.resultSummary || row.summary || 'Imported data',
              anomalies: row.anomalies ? JSON.parse(row.anomalies) : [],
              tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
              confidence: parseFloat(row.confidence) || 85,
              aiSummary: row.aiSummary || undefined,
            };
          });

          resolve({
            success: true,
            data: experiments,
            importedCount: experiments.length,
          });
        } catch (error) {
          resolve({
            success: false,
            error: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV parsing error: ${error.message}`,
        });
      },
    });
  });
}

export function parseJSON(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const experiments: Experiment[] = Array.isArray(data) ? data : [data];

        resolve({
          success: true,
          data: experiments,
          importedCount: experiments.length,
        });
      } catch (error) {
        resolve({
          success: false,
          error: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file',
      });
    };
    reader.readAsText(file);
  });
}

export async function importLabData(file: File): Promise<ImportResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return parseCSV(file);
  } else if (extension === 'json') {
    return parseJSON(file);
  } else {
    return {
      success: false,
      error: 'Unsupported file format. Please upload CSV or JSON files.',
    };
  }
}

export function exportToJSON(data: Experiment[], filename = 'lab-data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

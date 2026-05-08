import { Experiment } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToCSV(data: Experiment[], filename = 'report.csv') {
  const headers = ['ID', 'Date', 'Experiment Type', 'Instrument', 'Status', 'Operator', 'Parameters', 'Anomalies', 'Result Summary', 'Confidence'];
  const rows = data.map((run) => [
    run.id,
    run.date,
    run.experimentType,
    run.instrument,
    run.status,
    run.operator,
    JSON.stringify(run.parameters),
    run.anomalies.map(a => a.description).join('; '),
    run.resultSummary,
    `${run.confidence}%`,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(','),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportToPDF(data: Experiment[], title = 'Scientific Data Report') {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [['ID', 'Date', 'Type', 'Instrument', 'Status', 'Operator', 'Result']],
    body: data.map((run) => [
      run.id,
      run.date,
      run.experimentType,
      run.instrument,
      run.status,
      run.operator,
      run.resultSummary.substring(0, 60) + (run.resultSummary.length > 60 ? '...' : ''),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
}

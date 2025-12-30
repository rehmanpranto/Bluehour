'use client';

import { useState } from 'react';

interface ExportImportProps {
  onImportSuccess?: () => void;
}

export default function ExportImport({ onImportSuccess }: ExportImportProps) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/export');
      if (!response.ok) {
        throw new Error('Failed to export entries');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        response.headers
          .get('content-disposition')
          ?.match(/filename="(.+)"/)?.[1] ||
        `rideeta-entries-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({
        type: 'success',
        text: 'Your entries have been exported successfully.',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Export failed';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }

      const result = await response.json();
      setMessage({
        type: 'success',
        text: result.message || 'Entries imported successfully.',
      });

      if (onImportSuccess) {
        onImportSuccess();
      }

      // Reset file input
      e.target.value = '';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Import failed';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
      e.target.value = '';
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {message && (
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-lg bg-teal-100 px-4 py-3 font-semibold text-teal-700 transition hover:bg-teal-200 disabled:opacity-50 active:scale-95 transform"
        >
          {exporting ? '💾 Exporting...' : '⬇️ Export Entries'}
        </button>

        <label className="rounded-lg bg-cyan-100 px-4 py-3 font-semibold text-cyan-700 transition hover:bg-cyan-200 disabled:opacity-50 cursor-pointer active:scale-95 transform text-center">
          {importing ? '📂 Importing...' : '⬆️ Import Entries'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
        </label>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Backup & restore your reflections anytime
      </p>
    </div>
  );
}

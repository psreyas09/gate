import React, { useState } from 'react';
import { Download, Upload, Database, CheckCircle, AlertTriangle, X, Shield, RefreshCw } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose, onRestoreSuccess }) => {
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    window.location.href = '/api/backup/export';
    setStatusMessage({ type: 'success', text: 'Backup JSON downloaded! Keep this safe.' });
  };

  const handleDownloadDB = () => {
    window.location.href = '/api/backup/download-db';
    setStatusMessage({ type: 'success', text: 'Direct SQLite gate_study.db file download started.' });
  };

  const handleCreateSnapshot = async () => {
    try {
      const res = await fetch('/api/backup/snapshot', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: `Local snapshot saved at data/backups/` });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to create local snapshot.' });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatusMessage(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Data restored successfully! Refreshing dashboard...' });
        setTimeout(() => {
          onRestoreSuccess();
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to restore backup file.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Invalid JSON file: ${err.message}` });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Persistence & Data Backup</h3>
              <p className="text-xs text-slate-400">Zero-loss guarantee: SQLite DB + Portable JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-sm flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action 1: Export JSON */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all">
            <div className="space-y-0.5">
              <div className="font-medium text-sm text-slate-200 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-cyan-400" />
                Export Backup (JSON)
              </div>
              <p className="text-xs text-slate-400">Download complete study progress, SM-2 cards, and test history.</p>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-sm transition-colors"
            >
              Export
            </button>
          </div>

          {/* Action 2: Direct SQLite DB */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all">
            <div className="space-y-0.5">
              <div className="font-medium text-sm text-slate-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                Direct SQLite File (gate_study.db)
              </div>
              <p className="text-xs text-slate-400">Download the raw disk database file from your local server.</p>
            </div>
            <button
              onClick={handleDownloadDB}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
            >
              Download .db
            </button>
          </div>

          {/* Action 3: Restore / Import JSON */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="space-y-0.5">
              <div className="font-medium text-sm text-slate-200 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-400" />
                Restore Progress from Backup
              </div>
              <p className="text-xs text-slate-400">Upload a previously exported JSON backup to resume on any machine.</p>
            </div>
            <div>
              <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-slate-600 hover:border-emerald-500 rounded-lg cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-colors text-xs text-slate-300">
                <RefreshCw className={`w-4 h-4 ${importing ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
                {importing ? 'Restoring Database...' : 'Select or Drop .json Backup File'}
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={importing}
                />
              </label>
            </div>
          </div>

          {/* Local Snapshot trigger */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>Server snapshots automatically saved to /data/backups/</span>
            <button
              onClick={handleCreateSnapshot}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Create Snapshot Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

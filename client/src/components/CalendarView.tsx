import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface CalendarViewProps {
  onSettingsSaved: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSettingsSaved }) => {
  const [targetExamDate, setTargetExamDate] = useState('2027-02-06');
  const [targetCutoff, setTargetCutoff] = useState('35.0');
  const [currentMode, setCurrentMode] = useState<'full' | 'light'>('full');
  const [busyPeriods, setBusyPeriods] = useState<Array<{ start: string; end: string; label: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New busy period inputs
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(data => {
        if (data.target_exam_date) setTargetExamDate(data.target_exam_date);
        if (data.target_cutoff) setTargetCutoff(data.target_cutoff);
        if (data.current_mode) setCurrentMode(data.current_mode);
        if (Array.isArray(data.busy_periods)) setBusyPeriods(data.busy_periods);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_exam_date: targetExamDate,
          target_cutoff: targetCutoff,
          current_mode: currentMode,
          busy_periods: busyPeriods,
        }),
      });
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      onSettingsSaved();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const handleAddBusyPeriod = () => {
    if (!newStart || !newEnd || !newLabel) return;
    setBusyPeriods(prev => [...prev, { start: newStart, end: newEnd, label: newLabel }]);
    setNewStart('');
    setNewEnd('');
    setNewLabel('');
  };

  const handleRemoveBusyPeriod = (index: number) => {
    setBusyPeriods(prev => prev.filter((_, i) => i !== index));
  };

  const daysToExam = Math.max(0, Math.ceil((new Date(targetExamDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <CalendarIcon className="w-3.5 h-3.5" /> Study Timeline &amp; Mode Planner
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Personal Schedule Aligned with Your College Life
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Configure semester exam busy periods and switch between &quot;Light Mode&quot; (reviews only) and &quot;Full Study Mode&quot; to keep your streak alive without burning out.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200">Exam Targets &amp; Study Mode</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Target Exam Date */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Target GATE Exam Date:</label>
            <input
              type="date"
              value={targetExamDate}
              onChange={e => setTargetExamDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <span className="text-[11px] text-cyan-400 font-medium">{daysToExam} days remaining</span>
          </div>

          {/* Target Qualifying Cutoff */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Target Qualifying Cutoff (out of 100):</label>
            <input
              type="number"
              step="0.5"
              value={targetCutoff}
              onChange={e => setTargetCutoff(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <span className="text-[11px] text-slate-400">Default: 35.0 (safe buffer for General/OBC/SC/ST qualifying)</span>
          </div>
        </div>

        {/* Study Mode Selector */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <label className="text-slate-200 font-medium text-xs block">Current Active Study Mode:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Mode Option */}
            <div
              onClick={() => setCurrentMode('full')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentMode === 'full'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-1 flex items-center justify-between">
                <span>Full Study Mode</span>
                {currentMode === 'full' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                New concept lessons + Quick-checks + Practice questions + SM-2 reviews. Use during regular college days.
              </p>
            </div>

            {/* Light Mode Option */}
            <div
              onClick={() => setCurrentMode('light')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentMode === 'light'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-1 flex items-center justify-between">
                <span>Light Mode (Semester / Busy Days)</span>
                {currentMode === 'light' && <CheckCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Zero new lessons. Only serves due SM-2 flashcard reviews (~5–10 mins/day). Preserves long-term memory &amp; streaks.
              </p>
            </div>
          </div>
        </div>

        {/* Busy Periods Manager */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              College Busy Periods &amp; Semester Exams
            </h4>
          </div>

          <div className="space-y-2">
            {busyPeriods.map((bp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-medium text-slate-200 block">{bp.label}</span>
                  <span className="text-[11px] text-slate-400">
                    {bp.start} to {bp.end}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveBusyPeriod(idx)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Busy Period Form */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">Add upcoming busy period:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="e.g. End Sem Exams"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="date"
                value={newStart}
                onChange={e => setNewStart(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleAddBusyPeriod}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shrink-0 font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Schedule settings saved to SQLite database!
            </span>
          ) : (
            <span className="text-xs text-slate-500">Settings persist across sessions</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

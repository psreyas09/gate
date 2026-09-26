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

import { TargetScope } from '../types';

interface CalendarViewProps {
  onSettingsSaved: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onSettingsSaved }) => {
  const [targetExamDate, setTargetExamDate] = useState('2027-02-06');
  const [targetCutoff, setTargetCutoff] = useState('35.0');
  const [targetScope, setTargetScope] = useState<TargetScope>('qualify');
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
        if (!data) return;
        const config = data.settings || data;
        if (config.target_exam_date) setTargetExamDate(config.target_exam_date);
        if (config.target_cutoff) setTargetCutoff(String(config.target_cutoff));
        if (config.target_scope) setTargetScope(config.target_scope);
        if (config.current_mode) setCurrentMode(config.current_mode);
        if (Array.isArray(config.busy_periods)) {
          setBusyPeriods(config.busy_periods);
        } else if (typeof config.busy_periods === 'string') {
          try {
            setBusyPeriods(JSON.parse(config.busy_periods));
          } catch {}
        }
      })
      .catch(console.error);
  }, []);

  const handleScopeSelect = (scope: TargetScope) => {
    setTargetScope(scope);
    if (scope === 'qualify') setTargetCutoff('35.0');
    else if (scope === 'scoring') setTargetCutoff('55.0');
    else if (scope === 'comprehensive') setTargetCutoff('75.0');
  };

  const handleCutoffChange = (value: string) => {
    setTargetCutoff(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (num < 45) setTargetScope('qualify');
      else if (num < 68) setTargetScope('scoring');
      else setTargetScope('comprehensive');
    }
  };

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
          target_scope: targetScope,
          current_mode: currentMode,
          busy_periods: busyPeriods,
        }),
      });
      localStorage.setItem('gate_study_scope', targetScope);
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
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-semibold">
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" /> Study Timeline &amp; Mode Planner
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          Personal Schedule Aligned with Your College Life
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Configure semester exam busy periods and switch between &quot;Light Mode&quot; (reviews only) and &quot;Full Study Mode&quot; to keep your streak alive without burning out.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sm:space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200">Exam Targets &amp; Study Mode</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs">
          {/* Target Exam Date */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">Target GATE Exam Date:</label>
            <input
              type="date"
              value={targetExamDate}
              onChange={e => setTargetExamDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 min-h-[42px]"
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
              onChange={e => handleCutoffChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 font-mono min-h-[42px]"
            />
            <span className="text-[11px] text-slate-400">
              {parseFloat(targetCutoff) <= 40 ? '🎯 Qualify Only Scope suggested' : parseFloat(targetCutoff) <= 65 ? '🚀 Rank Booster Scope suggested' : '🏆 Comprehensive Scope suggested'}
            </span>
          </div>
        </div>

        {/* Target Preparation Strategy & Scope Selector */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-slate-200 font-semibold text-xs flex items-center gap-1.5">
              <span>Target Preparation Strategy &amp; Material Scope:</span>
            </label>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {targetScope === 'qualify' ? '24 High-Yield Topics' : targetScope === 'scoring' ? '50 Core Topics' : 'All 60 Topics (Full Syllabus)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Qualify Only */}
            <div
              onClick={() => handleScopeSelect('qualify')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all touch-manipulation ${
                targetScope === 'qualify'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  🎯 Qualify Only (35+ Marks)
                </span>
                {targetScope === 'qualify' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                Most important things only. High-yield Tier 1 &amp; Tier 2 essentials to comfortably clear the GATE cutoff without burnout.
              </p>
              <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-semibold text-emerald-300">
                24 Core Topics • ~1 hr/day
              </div>
            </div>

            {/* Rank Booster */}
            <div
              onClick={() => handleScopeSelect('scoring')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all touch-manipulation ${
                targetScope === 'scoring'
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  🚀 Rank Booster (50-65 Marks)
                </span>
                {targetScope === 'scoring' && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                Core fundamentals across all Tier 1 and Tier 2 subjects. Secure admission to top state colleges &amp; PSU cutoffs.
              </p>
              <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-semibold text-cyan-300">
                50 Topics • ~2-3 hrs/day
              </div>
            </div>

            {/* Comprehensive */}
            <div
              onClick={() => handleScopeSelect('comprehensive')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all touch-manipulation ${
                targetScope === 'comprehensive'
                  ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-200 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  🏆 Comprehensive (75-100)
                </span>
                {targetScope === 'comprehensive' && <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                Full syllabus including advanced Compiler Design, Dynamic Programming, and edge cases for AIR &lt; 500 &amp; top IITs.
              </p>
              <div className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-semibold text-indigo-300">
                All 60 Topics • ~4+ hrs/day
              </div>
            </div>
          </div>
        </div>

        {/* Study Mode Selector */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <label className="text-slate-200 font-medium text-xs block">Current Active Study Mode:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Mode Option */}
            <div
              onClick={() => setCurrentMode('full')}
              className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all touch-manipulation ${
                currentMode === 'full'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-1 flex items-center justify-between">
                <span>Full Study Mode</span>
                {currentMode === 'full' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                New concept lessons + Quick-checks + Practice questions + SM-2 reviews. Use during regular college days.
              </p>
            </div>

            {/* Light Mode Option */}
            <div
              onClick={() => setCurrentMode('light')}
              className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all touch-manipulation ${
                currentMode === 'light'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-1 flex items-center justify-between">
                <span>Light Mode (Semester / Busy Days)</span>
                {currentMode === 'light' && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />}
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
                  className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  aria-label="Remove period"
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
                className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 min-h-[40px]"
              />
              <input
                type="date"
                value={newStart}
                onChange={e => setNewStart(e.target.value)}
                className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 min-h-[40px]"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 min-h-[40px]"
                />
                <button
                  onClick={handleAddBusyPeriod}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white shrink-0 font-medium min-h-[40px] flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 order-2 sm:order-1">
              <CheckCircle className="w-4 h-4 shrink-0" /> Schedule settings saved to SQLite database!
            </span>
          ) : (
            <span className="text-xs text-slate-500 order-2 sm:order-1 text-center sm:text-left">Settings persist across sessions</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2 min-h-[44px] order-1 sm:order-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

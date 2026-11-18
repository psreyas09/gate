import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Brain, Flame, Target, Zap } from 'lucide-react';
import type { OverviewData, TargetScope, User } from '../types';
import type { NavTab } from './Navbar';

interface StudyDashboardProps {
  overview: OverviewData;
  onNavigate: (tab: NavTab) => void;
  onDrillWeakAreas: () => void;
  currentUser?: User | null;
  onOpenAuth?: () => void;
}

const scopes: { id: TargetScope; label: string; detail: string; cutoff: string; fallbackTotal: number }[] = [
  { id: 'qualify', label: 'Qualify', detail: '24 high-yield topics', cutoff: '35', fallbackTotal: 24 },
  { id: 'scoring', label: 'Rank booster', detail: '50 core topics', cutoff: '55', fallbackTotal: 50 },
  { id: 'comprehensive', label: 'Complete syllabus', detail: '60 topics', cutoff: '75', fallbackTotal: 60 },
];

export function StudyDashboard({ overview, onNavigate, onDrillWeakAreas, currentUser, onOpenAuth }: StudyDashboardProps) {
  const savedScope = overview.settings?.target_scope as TargetScope | undefined;
  const [scope, setScope] = useState<TargetScope>(savedScope || 'qualify');

  useEffect(() => {
    if (savedScope && scopes.some(item => item.id === savedScope)) setScope(savedScope);
  }, [savedScope]);

  const active = scopes.find(item => item.id === scope) || scopes[0];
  const progress = overview.scopeStats?.[scope] || { total: active.fallbackTotal, completed: 0, pct: 0 };
  const days = Math.max(0, Math.ceil((new Date(overview.settings?.target_exam_date || '2027-02-06').getTime() - Date.now()) / 86400000));
  const weakCount = overview.weakTopics?.length || 0;

  const changeScope = async (next: TargetScope) => {
    setScope(next);
    const nextScope = scopes.find(item => item.id === next) || scopes[0];
    try {
      await fetch('/api/calendar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_scope: next, target_cutoff: `${nextScope.cutoff}.0` }),
      });
    } catch { /* local mode remains usable */ }
  };

  return <div className="space-y-8">
    {!currentUser && onOpenAuth && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <p className="text-sm text-slate-400">You’re studying locally. Create an account when you want to sync progress across devices.</p>
      <button onClick={onOpenAuth} className="text-sm font-semibold text-slate-200 hover:text-white">Create account <ArrowRight className="inline h-3.5 w-3.5" /></button>
    </div>}

    <header className="grid gap-6 border-b border-slate-700/80 pb-8 md:grid-cols-[1fr_260px] md:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">GATE CSE 2027</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">A clear plan for today.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Choose a preparation track, study the next useful lesson, then review what is due. No dashboard theatre—just the work that moves your score.</p>
      </div>
      <div className="border-l-2 border-slate-500 pl-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Current target</p>
        <p className="mt-1 text-2xl font-semibold text-white">{active.cutoff}<span className="text-base text-slate-400"> / 100</span></p>
        <p className="mt-1 text-sm text-slate-400">{days} days remaining</p>
      </div>
    </header>

    <section aria-labelledby="track-heading">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 id="track-heading" className="text-sm font-semibold text-slate-100">Preparation track</h2>
        <span className="text-xs text-slate-500">You can change this any time</span>
      </div>
      <div className="grid gap-px overflow-hidden rounded-lg border border-slate-700 bg-slate-700 sm:grid-cols-3">
        {scopes.map(item => <button key={item.id} onClick={() => changeScope(item.id)} aria-pressed={scope === item.id}
          className={`p-4 text-left transition-colors ${scope === item.id ? 'bg-slate-700/70' : 'bg-[#101827] hover:bg-slate-800'}`}>
          <span className={`block text-sm font-semibold ${scope === item.id ? 'text-white' : 'text-slate-200'}`}>{item.label}</span>
          <span className="mt-1 block text-xs text-slate-400">{item.detail}</span>
        </button>)}
      </div>
    </section>

    <section className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
      <div className="rounded-xl border border-slate-700 bg-[#101827] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Next up</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Review your memory queue</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{overview.dueReviews > 0 ? `${overview.dueReviews} cards are due today. Clear them before starting new material.` : 'Your review queue is clear. Start a lesson or take a short drill.'}</p>
          </div>
          <Brain className="h-6 w-6 shrink-0 text-slate-400" />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('spaced_repetition')} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-100 px-4 text-sm font-semibold text-slate-950 hover:bg-white">
            Review {overview.dueReviews} cards <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => onNavigate('lessons')} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-600 px-4 text-sm font-semibold text-slate-200 hover:bg-slate-800">
            Browse lessons <BookOpen className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900/35 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Track progress</p>
        <p className="mt-3 text-3xl font-semibold text-white">{progress.pct}%</p>
        <p className="mt-1 text-sm text-slate-400">{progress.completed} of {progress.total} topics complete</p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-slate-300" style={{ width: `${progress.pct}%` }} /></div>
      </div>
    </section>

    <section className="grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-3">
      <button onClick={() => onNavigate('practice')} className="group text-left">
        <Zap className="h-5 w-5 text-slate-400" /><h2 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-white">Daily five</h2><p className="mt-1 text-sm leading-5 text-slate-400">Five fast questions to keep your streak moving.</p>
      </button>
      <button onClick={onDrillWeakAreas} className="group text-left">
        <Target className="h-5 w-5 text-slate-400" /><h2 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-white">Weak-area drill</h2><p className="mt-1 text-sm leading-5 text-slate-400">{weakCount ? `${weakCount} topics need attention.` : 'Use practice to find your first weak area.'}</p>
      </button>
      <button onClick={() => onNavigate('calendar')} className="group text-left">
        <Flame className="h-5 w-5 text-slate-400" /><h2 className="mt-3 text-sm font-semibold text-slate-100 group-hover:text-white">Plan the week</h2><p className="mt-1 text-sm leading-5 text-slate-400">Adjust your schedule and study load.</p>
      </button>
    </section>

  </div>;
}

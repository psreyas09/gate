import React, { useState, useEffect } from 'react';
import {
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  BookMarked,
  User as UserIcon,
  Sparkles,
  Trophy,
  Sigma,
  Calculator,
} from 'lucide-react';
import { OverviewData, User, TargetScope } from '../types';
import { NavTab } from './Navbar';
import { DailyWarmupModal } from './DailyWarmupModal';
import { GateCalculator } from './GateCalculator';

interface DashboardViewProps {
  overview: OverviewData;
  onNavigate: (tab: NavTab) => void;
  onDrillWeakAreas: () => void;
  currentUser?: User | null;
  onOpenAuth?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  onNavigate,
  onDrillWeakAreas,
  currentUser,
  onOpenAuth,
}) => {
  const initialScope = (overview?.settings?.target_scope as TargetScope) || 'qualify';
  const [activeScope, setActiveScope] = useState<TargetScope>(initialScope);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    if (overview?.settings?.target_scope) {
      setActiveScope(overview.settings.target_scope as TargetScope);
    }
  }, [overview?.settings?.target_scope]);

  const handleSwitchScope = async (scope: TargetScope) => {
    setActiveScope(scope);
    const newCutoff = scope === 'qualify' ? '35.0' : scope === 'scoring' ? '55.0' : '75.0';
    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_scope: scope, target_cutoff: newCutoff }),
      });
      localStorage.setItem('gate_study_scope', scope);
    } catch {}
  };

  const cutoff = activeScope === 'qualify' ? '35.0' : activeScope === 'scoring' ? '55.0' : '75.0';
  const examDateStr = overview?.settings?.target_exam_date || '2027-02-06';
  const daysRemaining = Math.max(0, Math.ceil((new Date(examDateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const tierStats = overview?.tierStats || [];
  const tier1 = tierStats.find(t => t.tier === 1) || { tier: 1 as const, total_lessons: 0, completed_lessons: 0 };
  const tier2 = tierStats.find(t => t.tier === 2) || { tier: 2 as const, total_lessons: 0, completed_lessons: 0 };
  const tier3 = tierStats.find(t => t.tier === 3) || { tier: 3 as const, total_lessons: 0, completed_lessons: 0 };

  const tier1Pct = tier1.total_lessons > 0 ? Math.round((tier1.completed_lessons / tier1.total_lessons) * 100) : 0;
  const tier2Pct = tier2.total_lessons > 0 ? Math.round((tier2.completed_lessons / tier2.total_lessons) * 100) : 0;
  const tier3Pct = tier3.total_lessons > 0 ? Math.round((tier3.completed_lessons / tier3.total_lessons) * 100) : 0;

  const scopeDescriptions = {
    qualify: {
      badge: 'Strategy: 35+ High-Yield Qualification (Pass Without Burnout)',
      desc: 'Targeting qualification with minimum study hours. Focusing on 24 essential high-yield core topics across Aptitude, Engg Math, DBMS, and core OS/DS, while skipping exhaustive edge cases.',
      gaugeSub: 'Based on 24 High-Yield Qualify Topics'
    },
    scoring: {
      badge: 'Strategy: 50-65 Marks Rank Booster (Top State Colleges / PSU)',
      desc: 'Balanced preparation covering 50 core & medium-yield topics across Tier 1 and Tier 2 subjects (Networks, COA, full OS, algorithms fundamentals).',
      gaugeSub: 'Based on 50 Tier 1 & 2 Core Topics'
    },
    comprehensive: {
      badge: 'Strategy: 75-100 Marks Comprehensive (Top IITs & IISc - AIR < 500)',
      desc: 'Complete full-depth GATE syllabus covering all 60 topics including Compiler Design, Dynamic Programming, and advanced Theory of Computation.',
      gaugeSub: 'Based on All 60 GATE Curriculum Topics'
    }
  };

  const activeScopeSafe: TargetScope = ['qualify', 'scoring', 'comprehensive'].includes(activeScope) ? activeScope : 'qualify';
  const activeScopeDesc = scopeDescriptions[activeScopeSafe] || scopeDescriptions.qualify;
  const scopeInfo = overview?.scopeStats?.[activeScopeSafe] || {
    total: activeScopeSafe === 'qualify' ? 24 : activeScopeSafe === 'scoring' ? 50 : 60,
    completed: overview?.completedLessons || 0,
    pct: 0
  };
  const readinessScore = scopeInfo.pct || (scopeInfo.total > 0 ? Math.round((scopeInfo.completed / scopeInfo.total) * 100) : 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Guest Mode Callout Banner */}
      {!currentUser && onOpenAuth && (
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 text-slate-200 shadow-md">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-white">Studying as Guest</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">Local Only</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Sign in or register to sync your study streak, flashcards, and progress across all devices.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm shadow-cyan-900/40 transition-all active:scale-95"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Target Strategy & Preparation Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 p-4 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Strategy Switcher Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleSwitchScope('qualify')}
                className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all touch-manipulation ${
                  activeScope === 'qualify'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🎯 Qualify Only (24)</span>
              </button>
              <button
                onClick={() => handleSwitchScope('scoring')}
                className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all touch-manipulation ${
                  activeScope === 'scoring'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🚀 Rank Booster (50)</span>
              </button>
              <button
                onClick={() => handleSwitchScope('comprehensive')}
                className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all touch-manipulation ${
                  activeScope === 'comprehensive'
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-sm'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🏆 Comprehensive (60)</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              GATE CSE 2027 Preparation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeScopeDesc.desc}
            </p>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4 pt-1 text-[11px] sm:text-xs text-slate-400">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-850/60 sm:p-0 sm:bg-transparent border border-slate-800 sm:border-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                <span><strong className="text-slate-200">{daysRemaining}</strong> Days to Exam</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-850/60 sm:p-0 sm:bg-transparent border border-slate-800 sm:border-0">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>Target: <strong className="text-slate-200">{cutoff}</strong>/100</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-850/60 sm:p-0 sm:bg-transparent border border-slate-800 sm:border-0">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
                <span><strong className="text-slate-200">{scopeInfo.completed}</strong> of {scopeInfo.total} Mastered</span>
              </div>
            </div>
          </div>

          {/* Readiness Gauge */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-700/60 w-full md:w-auto md:min-w-[210px] text-center shadow-lg">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-slate-400">
              {activeScopeSafe === 'qualify' ? 'Qualifying Readiness' : activeScopeSafe === 'scoring' ? 'Scoring Readiness' : 'Overall Mastery'}
            </span>
            <div className="my-1.5 sm:my-2 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {readinessScore}%
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400">
              {activeScopeDesc.gaugeSub}
            </span>
          </div>
        </div>
      </div>

      {/* Daily 5 Micro-Challenge & Quick Tools Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Daily 5 Rapid Fire Drill</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">5 Mins</span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                5 rapid questions across Aptitude, Math, and Core CS to maintain your study streak.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDailyOpen(true)}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Start Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Reference Tools */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2.5 shadow-md">
          <button
            onClick={() => onNavigate('formulas' as any)}
            className="flex-1 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
          >
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 shrink-0">
              <Sigma className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-200">Formulas</span>
              <span className="block text-[10px] text-slate-400">Vault &amp; Cheats</span>
            </div>
          </button>
          <button
            onClick={() => setIsCalcOpen(true)}
            className="flex-1 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-left transition-colors flex items-center gap-2"
          >
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-300 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-200">TCS Calc</span>
              <span className="block text-[10px] text-slate-400">Scientific</span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Card 1: Spaced Repetition Due Queue */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4 shrink-0" /> Spaced Repetition
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-indigo-500/20 text-indigo-300">
                {overview?.dueReviews ?? 0} Due
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">SM-2 Daily Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review active flashcards and previously missed questions scheduled by the SM-2 algorithm.
            </p>
          </div>
          <button
            onClick={() => onNavigate('spaced_repetition')}
            className="mt-4 flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-xs transition-colors min-h-[44px]"
          >
            <span>Review {overview?.dueReviews ?? 0} Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Weak-Area Drilling */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" /> Weak-Area Drill
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/20 text-amber-300">
                {(overview?.weakTopics || []).length} Identified
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Targeted Weakness Fix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click practice session pulling directly from topics with low accuracy (&lt;60%).
            </p>
          </div>
          <button
            onClick={onDrillWeakAreas}
            className="mt-4 flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-medium text-xs transition-colors min-h-[44px]"
          >
            <span>Start Weak-Area Drill</span>
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Timed Mock Simulation */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 shrink-0" /> Benchmark Test
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-cyan-500/20 text-cyan-300">
                GATE Negative Marking
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Timed Mock Test</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real GATE conditions (-1/3, -2/3 penalty on MCQs) with immediate 35-mark qualifying comparison.
            </p>
          </div>
          <button
            onClick={() => onNavigate('mock')}
            className="mt-4 flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium text-xs transition-colors min-h-[44px]"
          >
            <span>Launch Mock Exam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Curriculum Tiers Progress Overview */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 sm:space-y-5">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-100">Curriculum Structure by Tier</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Strictly organized by qualifying score priority</p>
          </div>
          <button
            onClick={() => onNavigate('lessons')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 self-start xs:self-auto"
          >
            <span>View Full Syllabus</span> <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 Card */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Tier 1 — Full Depth
              </span>
              <span className="text-xs font-bold text-slate-200">{tier1Pct}% Mastered</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">5 High-Yield Subjects</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aptitude, Engg Math, Digital Logic, DBMS, C & Data Structures. (~55+ marks in GATE).
              </p>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${tier1Pct}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>{tier1.completed_lessons} of {tier1.total_lessons} lessons completed</span>
              <span className="text-emerald-400 font-medium">Priority 1.0</span>
            </div>
          </div>

          {/* Tier 2 Card */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Tier 2 — Fundamentals
              </span>
              <span className="text-xs font-bold text-slate-200">{tier2Pct}% Mastered</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">3 Core Systems Subjects</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operating Systems, Computer Networks, COA. Focus on high-yield formulas & definitions only.
              </p>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${tier2Pct}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>{tier2.completed_lessons} of {tier2.total_lessons} lessons completed</span>
              <span className="text-cyan-400 font-medium">Priority 0.6</span>
            </div>
          </div>

          {/* Tier 3 Card */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-600/30 text-slate-400 border border-slate-600/40">
                Tier 3 — Light Touch
              </span>
              <span className="text-xs font-bold text-slate-200">{tier3Pct}% Mastered</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">TOC, Algos, Compiler</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard sorting, DFA/regex, compiler phases. No deep proofs or time sinks.
              </p>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
              <div className="bg-slate-500 h-full rounded-full transition-all" style={{ width: `${tier3Pct}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>{tier3.completed_lessons} of {tier3.total_lessons} lessons completed</span>
              <span className="text-slate-400 font-medium">Priority 0.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authoritative Textbook Grounding */}
      <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-3">
          <BookMarked className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">Curriculum Grounded in GATE Standard References</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="p-2.5 rounded bg-slate-800/30 border border-slate-800">
            <span className="text-slate-300 font-medium block mb-0.5">Data Structures:</span>
            Karumanchi (Data Structures Made Easy)
          </div>
          <div className="p-2.5 rounded bg-slate-800/30 border border-slate-800">
            <span className="text-slate-300 font-medium block mb-0.5">DBMS:</span>
            Silberschatz, Korth (Database System Concepts)
          </div>
          <div className="p-2.5 rounded bg-slate-800/30 border border-slate-800">
            <span className="text-slate-300 font-medium block mb-0.5">Operating Systems:</span>
            Silberschatz & Galvin (Operating System Concepts)
          </div>
          <div className="p-2.5 rounded bg-slate-800/30 border border-slate-800">
            <span className="text-slate-300 font-medium block mb-0.5">Computer Networks:</span>
            Kurose & Ross (A Top-Down Approach)
          </div>
          <div className="p-2.5 rounded bg-slate-800/30 border border-slate-800">
            <span className="text-slate-300 font-medium block mb-0.5">Digital Logic & COA:</span>
            M. Morris Mano (Both core textbooks)
          </div>
          <div className="p-2.5 rounded bg-slate-800/30 border border-slate-800">
            <span className="text-slate-300 font-medium block mb-0.5">Discrete Math & Engg Math:</span>
            Kenneth Rosen & B.S. Grewal
          </div>
        </div>
      </div>

      {/* Daily 5 Micro-Challenge Modal */}
      <DailyWarmupModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        onCompleted={() => {
          // re-trigger dashboard fetch or continue
        }}
      />

      {/* Standalone GATE Virtual Calculator */}
      <GateCalculator
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
    </div>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  CheckSquare,
  Timer,
  Calendar,
  Flame,
  HardDriveDownload,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { OverviewData } from '../types';

export type NavTab = 'dashboard' | 'lessons' | 'spaced_repetition' | 'practice' | 'mock' | 'calendar' | 'resources';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  overview: OverviewData | null;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  overview,
  onOpenBackup,
}) => {
  const isLightMode = overview?.settings.current_mode === 'light';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 font-black text-white text-base">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">GATE CSE 2027</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                Target 35+
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">High-Yield Qualifying Study Engine</p>
          </div>
        </div>

        {/* Quick Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Study Mode Indicator */}
          <button
            onClick={() => onTabChange('calendar')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              isLightMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isLightMode ? 'Light Mode (Exam Prep)' : 'Full Study Mode'}
          </button>

          {/* Consistency Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{overview?.streak || 0}d streak</span>
          </div>

          {/* Due Reviews Pill */}
          <button
            onClick={() => onTabChange('spaced_repetition')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors text-xs font-semibold"
          >
            <Brain className="w-4 h-4" />
            <span>{overview?.dueReviews ?? 0} due</span>
          </button>

          {/* Persistence & Backup Button */}
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors text-xs font-medium"
            title="Backup & Export Database"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 sm:space-x-4 py-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'lessons', label: 'Syllabus & Lessons', icon: BookOpen },
            { id: 'spaced_repetition', label: 'Spaced Repetition', icon: Brain, badge: overview?.dueReviews },
            { id: 'practice', label: 'Practice & PYQ Bank', icon: CheckSquare },
            { id: 'mock', label: 'Mock Tests (Timed)', icon: Timer },
            { id: 'calendar', label: 'Calendar & Schedule', icon: Calendar },
            { id: 'resources', label: 'Resources Hub', icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as NavTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

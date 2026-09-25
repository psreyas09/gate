import React, { useState } from 'react';
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
  Bookmark,
  MoreHorizontal,
  X,
  ShieldCheck
} from 'lucide-react';
import { OverviewData } from '../types';

export type NavTab = 'dashboard' | 'lessons' | 'spaced_repetition' | 'practice' | 'mock' | 'calendar' | 'resources';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  overview: OverviewData | null;
  onOpenBackup: () => void;
}

const TABS: { id: NavTab; label: string; mobileLabel: string; icon: any; badgeKey?: 'dueReviews' }[] = [
  { id: 'dashboard', label: 'Dashboard', mobileLabel: 'Home', icon: LayoutDashboard },
  { id: 'lessons', label: 'Syllabus & Lessons', mobileLabel: 'Lessons', icon: BookOpen },
  { id: 'spaced_repetition', label: 'Spaced Repetition', mobileLabel: 'Reviews', icon: Brain, badgeKey: 'dueReviews' },
  { id: 'practice', label: 'Practice & PYQ Bank', mobileLabel: 'Practice', icon: CheckSquare },
  { id: 'mock', label: 'Mock Tests (Timed)', mobileLabel: 'Mocks', icon: Timer },
  { id: 'calendar', label: 'Calendar & Schedule', mobileLabel: 'Schedule', icon: Calendar },
  { id: 'resources', label: 'Resources Hub', mobileLabel: 'Resources', icon: Bookmark },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  overview,
  onOpenBackup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLightMode = overview?.settings?.current_mode === 'light';

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
            onClick={() => handleSelectTab('dashboard')}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 font-black text-white text-sm sm:text-base">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-sm sm:text-lg">GATE CSE 2027</span>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Target 35+
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">High-Yield Qualifying Study Engine</p>
            </div>
          </div>

          {/* Quick Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Study Mode Indicator */}
            <button
              onClick={() => handleSelectTab('calendar')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isLightMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isLightMode ? 'Light Mode' : 'Full Mode'}
            </button>

            {/* Consistency Streak */}
            <div
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] sm:text-xs font-semibold"
              title={`${overview?.streak || 0} day study streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{overview?.streak || 0}d</span>
              <span className="hidden sm:inline">streak</span>
            </div>

            {/* Due Reviews Pill */}
            <button
              onClick={() => handleSelectTab('spaced_repetition')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors text-[11px] sm:text-xs font-semibold"
              title="SuperMemo SM-2 Due Reviews"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{overview?.dueReviews ?? 0}</span>
              <span className="hidden sm:inline">due</span>
            </button>

            {/* Backup Button */}
            <button
              onClick={onOpenBackup}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors text-[11px] sm:text-xs font-medium"
              title="Backup & Export Database"
              aria-label="Backup"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Pill Tabs */}
        <div className="relative border-t border-slate-800/80 bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar scroll-smooth">
            <nav className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                const badge = tab.badgeKey ? overview?.[tab.badgeKey] : undefined;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all touch-manipulation ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.mobileLabel}</span>
                    {badge !== undefined && badge > 0 ? (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                        {badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Phone-friendly, 1-thumb reach) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 safe-bottom">
        <div className="grid grid-cols-5 h-14">
          {/* 1. Dashboard */}
          <button
            onClick={() => handleSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              currentTab === 'dashboard' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* 2. Lessons */}
          <button
            onClick={() => handleSelectTab('lessons')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              currentTab === 'lessons' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lessons</span>
          </button>

          {/* 3. Spaced Repetition (Reviews) */}
          <button
            onClick={() => handleSelectTab('spaced_repetition')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative ${
              currentTab === 'spaced_repetition' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Brain className="w-4 h-4" />
              {(overview?.dueReviews ?? 0) > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.1 bg-indigo-500 text-white text-[9px] font-black rounded-full min-w-[14px] text-center">
                  {overview?.dueReviews}
                </span>
              )}
            </div>
            <span>Reviews</span>
          </button>

          {/* 4. Practice */}
          <button
            onClick={() => handleSelectTab('practice')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              currentTab === 'practice' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Practice</span>
          </button>

          {/* 5. More Menu */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
              mobileMenuOpen || ['mock', 'calendar', 'resources'].includes(currentTab)
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Mobile "More" Drawer / Modal */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative bg-slate-900 border-t border-slate-800 rounded-t-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto safe-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">All Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSelectTab('mock')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-left ${
                  currentTab === 'mock'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                }`}
              >
                <Timer className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold">Mock Tests</div>
                  <div className="text-[10px] text-slate-400">Timed GATE simulation</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('calendar')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-left ${
                  currentTab === 'calendar'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold">Schedule</div>
                  <div className="text-[10px] text-slate-400">Light / Full mode</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('resources')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-left ${
                  currentTab === 'resources'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold">Resources Hub</div>
                  <div className="text-[10px] text-slate-400">Free notes &amp; NPTEL</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBackup();
                }}
                className="p-3 rounded-xl border bg-slate-800/60 border-slate-700/60 text-slate-200 flex items-center gap-2.5 text-left"
              >
                <HardDriveDownload className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold">Data Backup</div>
                  <div className="text-[10px] text-slate-400">Export &amp; Restore</div>
                </div>
              </button>
            </div>

            {/* Quick status in drawer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SQLite DB Active</span>
              </span>
              <span className="text-[11px] text-cyan-400">
                {isLightMode ? 'Light Mode (Exam Prep)' : 'Full Study Mode'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

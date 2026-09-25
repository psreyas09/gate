import React, { useState, useEffect, useRef } from 'react';
import { Navbar, MobileBottomNav, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LessonsView } from './components/LessonsView';
import { SpacedRepetitionView } from './components/SpacedRepetitionView';
import { PracticeView } from './components/PracticeView';
import { MockTestView } from './components/MockTestView';
import { CalendarView } from './components/CalendarView';
import { ResourcesView } from './components/ResourcesView';
import { BackupModal } from './components/BackupModal';
import { OverviewData } from './types';
import { Database, ShieldCheck } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [drillWeakOnly, setDrillWeakOnly] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const fetchOverview = () => {
    fetch('/api/overview')
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleDrillWeakAreas = () => {
    setDrillWeakOnly(true);
    setCurrentTab('practice');
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab !== 'practice') {
      setDrillWeakOnly(false);
    }
    setCurrentTab(tab);
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="h-screen h-[100dvh] sm:h-auto sm:min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden sm:overflow-visible font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        overview={overview}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Content Area */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto sm:overflow-visible sm:h-auto overscroll-y-contain max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-6 sm:pb-8"
      >
        {currentTab === 'dashboard' && overview && (
          <DashboardView
            overview={overview}
            onNavigate={handleTabChange}
            onDrillWeakAreas={handleDrillWeakAreas}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsView onProgressUpdated={fetchOverview} />
        )}

        {currentTab === 'spaced_repetition' && (
          <SpacedRepetitionView onReviewCompleted={fetchOverview} />
        )}

        {currentTab === 'practice' && (
          <PracticeView drillWeakOnly={drillWeakOnly} />
        )}

        {currentTab === 'mock' && (
          <MockTestView onMockCompleted={fetchOverview} />
        )}

        {currentTab === 'calendar' && (
          <CalendarView onSettingsSaved={fetchOverview} />
        )}

        {currentTab === 'resources' && (
          <ResourcesView />
        )}
      </main>

      {/* Mobile Bottom Navigation (docked firmly below main on mobile) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        overview={overview}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Footer (Desktop only - mobile uses dedicated bottom nav & More drawer) */}
      <footer className="hidden sm:block border-t border-slate-800/80 bg-slate-900/40 py-5 sm:pb-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All progress saved to disk: <code className="text-cyan-300 font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.5 rounded break-all">data/gate_study.db</code>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>GATE CSE 2027 Platform</span>
            <span>•</span>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Backup & Persistence Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onRestoreSuccess={fetchOverview}
      />
    </div>
  );
}

export default App;

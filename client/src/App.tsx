import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
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
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab !== 'practice') {
      setDrillWeakOnly(false);
    }
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        overview={overview}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              All progress is continuously saved to local disk: <code className="text-cyan-300 font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.5 rounded">data/gate_study.db</code>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>GATE CSE 2027 Strategy Platform</span>
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

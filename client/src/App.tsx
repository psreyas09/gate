import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Navbar, MobileBottomNav, NavTab } from './components/Navbar';
import { BackupModal } from './components/BackupModal';
import { AuthModal } from './components/AuthModal';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { OverviewData, User } from './types';
import { Database, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ErrorBoundary } from './components/ErrorBoundary';

// Code-split heavy views via React.lazy for optimized initial bundle
const DashboardView = React.lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const LessonsView = React.lazy(() => import('./components/LessonsView').then(m => ({ default: m.LessonsView })));
const SpacedRepetitionView = React.lazy(() => import('./components/SpacedRepetitionView').then(m => ({ default: m.SpacedRepetitionView })));
const PracticeView = React.lazy(() => import('./components/PracticeView').then(m => ({ default: m.PracticeView })));
const MockTestView = React.lazy(() => import('./components/MockTestView').then(m => ({ default: m.MockTestView })));
const CalendarView = React.lazy(() => import('./components/CalendarView').then(m => ({ default: m.CalendarView })));
const ResourcesView = React.lazy(() => import('./components/ResourcesView').then(m => ({ default: m.ResourcesView })));
const FormulaVaultView = React.lazy(() => import('./components/FormulaVaultView').then(m => ({ default: m.FormulaVaultView })));
const GateCalculator = React.lazy(() => import('./components/GateCalculator').then(m => ({ default: m.GateCalculator })));

const viewLoaders: Record<string, () => Promise<any>> = {
  dashboard: () => import('./components/DashboardView'),
  lessons: () => import('./components/LessonsView'),
  spaced_repetition: () => import('./components/SpacedRepetitionView'),
  practice: () => import('./components/PracticeView'),
  mock: () => import('./components/MockTestView'),
  calendar: () => import('./components/CalendarView'),
  resources: () => import('./components/ResourcesView'),
  formulas: () => import('./components/FormulaVaultView'),
  calculator: () => import('./components/GateCalculator'),
};

export const prefetchView = (tab: string) => {
  const loader = viewLoaders[tab];
  if (loader) {
    loader().catch(() => {});
  }
};

const ViewSkeleton = () => (
  <div className="space-y-4 animate-pulse max-w-6xl mx-auto py-2">
    <div className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-40 rounded-xl bg-slate-900/60 border border-slate-800" />
      <div className="h-40 rounded-xl bg-slate-900/60 border border-slate-800" />
      <div className="h-40 rounded-xl bg-slate-900/60 border border-slate-800" />
    </div>
  </div>
);

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [overview, setOverview] = useState<OverviewData | null>(() => {
    try {
      const cached = localStorage.getItem('gate_overview_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('gate_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDeviceSyncOpen, setIsDeviceSyncOpen] = useState(false);
  const [incomingSync, setIncomingSync] = useState<any | null>(null);
  const [drillWeakOnly, setDrillWeakOnly] = useState(false);
  const [isGlobalCalcOpen, setIsGlobalCalcOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const fetchOverview = () => {
    fetch('/api/overview')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object' && !data.error) {
          setOverview(data);
          try {
            localStorage.setItem('gate_overview_cache', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(console.error);
  };

  const checkCurrentUser = () => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.isGuest && data.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem('gate_current_user', JSON.stringify(data.user));
          } catch {}
        } else {
          setCurrentUser(null);
          localStorage.removeItem('gate_current_user');
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkCurrentUser();
    fetchOverview();

    // Idle prefetch primary views for instant zero-latency tab switching
    const timer = setTimeout(() => {
      prefetchView('lessons');
      prefetchView('practice');
      prefetchView('formulas');
    }, 600);

    // Check for incoming cross-device sync URL payload
    if (window.location.hash.startsWith('#sync=')) {
      try {
        const raw = decodeURIComponent(escape(atob(window.location.hash.slice(6))));
        const payload = JSON.parse(raw);
        if (payload && (payload.user || payload.lessonProgress || payload.spacedCards)) {
          setIncomingSync(payload);
        }
      } catch (err) {
        console.error('Error decoding incoming device sync:', err);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const handleApplyIncomingSync = (payload: any) => {
    try {
      if (payload.token) {
        localStorage.setItem('gate_auth_token', payload.token);
      }
      if (payload.user) {
        localStorage.setItem('gate_current_user', JSON.stringify(payload.user));
        setCurrentUser(payload.user);
      }
      if (payload.users && Array.isArray(payload.users)) {
        localStorage.setItem('gate_users', JSON.stringify(payload.users));
      }
      if (payload.lessonProgress && Array.isArray(payload.lessonProgress)) {
        localStorage.setItem('gate_user_lesson_progress', JSON.stringify(payload.lessonProgress));
      }
      if (payload.questionAttempts && Array.isArray(payload.questionAttempts)) {
        localStorage.setItem('gate_user_question_attempts', JSON.stringify(payload.questionAttempts));
      }
      if (payload.spacedCards && Array.isArray(payload.spacedCards)) {
        localStorage.setItem('gate_spaced_repetition_cards', JSON.stringify(payload.spacedCards));
      }
      if (payload.mockSessions && Array.isArray(payload.mockSessions)) {
        localStorage.setItem('gate_mock_sessions', JSON.stringify(payload.mockSessions));
      }
      if (payload.mockAnswers && Array.isArray(payload.mockAnswers)) {
        localStorage.setItem('gate_mock_answers', JSON.stringify(payload.mockAnswers));
      }
      if (payload.settings && typeof payload.settings === 'object') {
        localStorage.setItem('gate_study_settings', JSON.stringify(payload.settings));
      }

      fetchOverview();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to apply incoming sync:', err);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    fetchOverview();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // offline logout
    }
    localStorage.removeItem('gate_auth_token');
    localStorage.removeItem('gate_current_user');
    localStorage.removeItem('gate_overview_cache');
    setCurrentUser(null);
    fetchOverview();
  };

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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenDeviceSync={() => setIsDeviceSyncOpen(true)}
        onOpenCalculator={() => setIsGlobalCalcOpen(true)}
        onPrefetchTab={prefetchView}
      />

      {/* Main Content Area */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto sm:overflow-visible sm:h-auto overscroll-y-contain max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-6 sm:pb-8"
      >
        <ErrorBoundary fallbackTitle="Could not load view">
          <Suspense fallback={<ViewSkeleton />}>
            {currentTab === 'dashboard' && (
              overview ? (
                <DashboardView
                  overview={overview}
                  onNavigate={handleTabChange}
                  onDrillWeakAreas={handleDrillWeakAreas}
                  currentUser={currentUser}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
              ) : (
                <ViewSkeleton />
              )
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

            {currentTab === 'formulas' && (
              <FormulaVaultView />
            )}

            {currentTab === 'calendar' && (
              <CalendarView onSettingsSaved={fetchOverview} />
            )}

            {currentTab === 'resources' && (
              <ResourcesView />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Mobile Bottom Navigation (docked firmly below main on mobile) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        overview={overview}
        onOpenBackup={() => setIsBackupOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenDeviceSync={() => setIsDeviceSyncOpen(true)}
        onOpenCalculator={() => setIsGlobalCalcOpen(true)}
      />

      {/* Global GATE Virtual Calculator */}
      <GateCalculator
        isOpen={isGlobalCalcOpen}
        onClose={() => setIsGlobalCalcOpen(false)}
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
            <button
              onClick={() => setIsDeviceSyncOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Sync to Mobile</span>
            </button>
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

      {/* Account Authentication & Migration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Cross-Device Instant QR & Link Sync Modal */}
      <DeviceSyncModal
        isOpen={isDeviceSyncOpen}
        onClose={() => setIsDeviceSyncOpen(false)}
        currentUser={currentUser}
        overview={overview}
        onSyncApplied={fetchOverview}
      />

      {/* Incoming Cross-Device Sync Confirmation Prompt */}
      {incomingSync && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Device Sync Detected!</h3>
                <p className="text-xs text-slate-400">Incoming study progress from another device</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <p>
                <strong>Account:</strong>{' '}
                <span className="text-cyan-300 font-semibold">{incomingSync.user?.username || 'Guest Learner'}</span>
              </p>
              <p>
                <strong>Completed Lessons:</strong> {incomingSync.lessonProgress?.length || 0}
              </p>
              <p>
                <strong>Spaced Reviews:</strong> {incomingSync.spacedCards?.length || 0}
              </p>
              <p>
                <strong>Streak:</strong> {incomingSync.settings?.streak || 0} days
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIncomingSync(null);
                  window.history.replaceState(null, '', window.location.pathname);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Ignore
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApplyIncomingSync(incomingSync);
                  setIncomingSync(null);
                  window.history.replaceState(null, '', window.location.pathname);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/40 transition-all active:scale-[0.99]"
              >
                Accept &amp; Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

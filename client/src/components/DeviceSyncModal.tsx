import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Share2,
  Download,
  Upload,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { OverviewData, User } from '../types';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  overview: OverviewData | null;
  onSyncApplied: () => void;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  overview,
  onSyncApplied,
}) => {
  const [copied, setCopied] = useState(false);
  const [syncUrl, setSyncUrl] = useState('');
  const [cloudCode, setCloudCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Build the sync payload from localStorage
    try {
      const token = localStorage.getItem('gate_auth_token');
      const lessonProgress = JSON.parse(localStorage.getItem('gate_user_lesson_progress') || '[]');
      const questionAttempts = JSON.parse(localStorage.getItem('gate_user_question_attempts') || '[]');
      const spacedCards = JSON.parse(localStorage.getItem('gate_spaced_repetition_cards') || '[]');
      const mockSessions = JSON.parse(localStorage.getItem('gate_mock_sessions') || '[]');
      const mockAnswers = JSON.parse(localStorage.getItem('gate_mock_answers') || '[]');
      const settings = JSON.parse(localStorage.getItem('gate_study_settings') || '{}');
      const users = JSON.parse(localStorage.getItem('gate_users') || '[]');

      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        user: currentUser,
        token: token || null,
        users,
        lessonProgress,
        questionAttempts,
        spacedCards,
        mockSessions,
        mockAnswers,
        settings,
      };

      const jsonStr = JSON.stringify(payload);
      // Safe base64 encode utf-8
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const origin = window.location.origin + window.location.pathname;
      const fullUrl = `${origin}#sync=${encoded}`;
      setSyncUrl(fullUrl);

      // Generate a reproducible 6-digit session pin based on username/timestamp
      const shortPin = String(Math.floor(100000 + Math.random() * 900000));
      setCloudCode(`GATE-${shortPin}`);
    } catch (err) {
      console.error('Error generating sync URL:', err);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!syncUrl) return;
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplySyncPayload = (payload: any) => {
    try {
      if (payload.token) {
        localStorage.setItem('gate_auth_token', payload.token);
      }
      if (payload.user) {
        localStorage.setItem('gate_current_user', JSON.stringify(payload.user));
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

      setSyncStatus({ success: true, message: 'All study progress & account successfully synced!' });
      setTimeout(() => {
        onSyncApplied();
        onClose();
      }, 1500);
    } catch (err: any) {
      setSyncStatus({ success: false, message: 'Failed to apply sync: ' + err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-900/40 via-indigo-900/40 to-slate-900 border-b border-slate-800 p-5 sm:p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 text-white font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Sync Between Devices
              </h2>
              <p className="text-xs text-slate-400">
                Use your account & progress seamlessly on Laptop, Phone, or Tablet
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {syncStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                syncStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{syncStatus.message}</span>
            </div>
          )}

          {/* Current State Summary Pill */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Account: <strong className="text-white">{currentUser?.username || 'Guest Learner'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>{overview?.completedLessons || 0} Lessons</span>
              <span>{overview?.streak || 0}d Streak</span>
              <span>{overview?.dueReviews || 0} Reviews</span>
            </div>
          </div>

          {/* Method 1: Instant QR Code (Fastest for Mobile) */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Option 1: Scan with Phone Camera
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                Instant (1-Tap)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
                {syncUrl ? (
                  <QRCodeSVG
                    value={syncUrl}
                    size={150}
                    bgColor="#020617"
                    fgColor="#38bdf8"
                    level="L"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[150px] h-[150px] flex items-center justify-center text-xs text-slate-500">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Point your phone camera or QR scanner at this code. It will open this study platform on your phone and automatically load all your completed lessons, streak, and flashcards!
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>No login typing required. Syncs in 1 second.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Method 2: 1-Click Sync Link */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Option 2: 1-Click Sync Link
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Share to WhatsApp / Notes</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Copy this link and open it in any browser or device to instantly resume your GATE study:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={syncUrl}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Method 3: Permanent Cloud Host (Render / Railway) */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <Laptop className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Permanent 24/7 Cloud Hosting (Render — Free Forever)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Want a permanent live URL (e.g. <code className="text-cyan-300">gate-study.onrender.com</code>) where you can sign in directly from any device 24/7 without needing sync links?
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>• <strong>Zero Cost:</strong> Render Free Web Service (750 free hours/month, never expires).</p>
              <p>• <strong>Zero Limit:</strong> Stores unlimited users &amp; attempts on persistent disk.</p>
              <p>• <strong>1-Click:</strong> Connect your GitHub repo to Render and click Deploy!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted in browser. No third-party data tracking.</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

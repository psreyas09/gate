import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [migrateGuest, setMigrateGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotFoundError, setIsNotFoundError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsNotFoundError(false);

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if ((mode === 'register' || mode === 'reset') && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter identical passwords.');
      return;
    }

    setIsLoading(true);

    try {
      let endpoint = '/api/auth/login';
      const payload: any = { username: cleanUsername };

      if (mode === 'login') {
        endpoint = '/api/auth/login';
        payload.password = password;
      } else if (mode === 'register') {
        endpoint = '/api/auth/register';
        payload.password = password;
        if (email.trim()) payload.email = email.trim();
        payload.migrateGuestProgress = migrateGuest;
      } else if (mode === 'reset') {
        endpoint = '/api/auth/reset-password';
        payload.newPassword = password;
        if (email.trim()) payload.email = email.trim();
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.notFound || res.status === 404 || (data.error && data.error.toLowerCase().includes('not found'))) {
          setIsNotFoundError(true);
        }
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      if (data.token) {
        localStorage.setItem('gate_auth_token', data.token);
      }

      if (data.user) {
        onSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = () => {
    setMode('register');
    setConfirmPassword(password);
    setError(null);
    setIsNotFoundError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Pattern */}
        <div className="relative bg-gradient-to-r from-cyan-900/40 via-indigo-900/40 to-slate-900 border-b border-slate-800 p-5 sm:p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 font-bold text-white text-base">
              G
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Create Your Study Account'}
                {mode === 'reset' && 'Reset Account Password'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'login' && 'Access your saved progress & consistency streak'}
                {mode === 'register' && 'Preserve and sync your GATE 2027 prep across devices'}
                {mode === 'reset' && 'Choose a new password for your account'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl mt-3 border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setIsNotFoundError(false); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setIsNotFoundError(false); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setMode('reset'); setError(null); setIsNotFoundError(false); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'reset'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {error && !isNotFoundError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
              {mode === 'login' && error.includes('password') && (
                <div className="pt-1 border-t border-rose-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Can't remember password?</span>
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(null); }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Account Not Found Helper Banner */}
          {isNotFoundError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    No account found with username &ldquo;{username}&rdquo;
                  </p>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Your local database may have refreshed. Would you like to create this account now?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={switchToRegister}
                className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-900/30 flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
              >
                <span>Create Account &ldquo;{username}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                minLength={3}
                placeholder="e.g. gate_topper_2027"
                value={username}
                onChange={(e) => setUsername(e.target.value.trimStart())}
                className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Email Input (Register and Reset modes) */}
          {(mode === 'register' || mode === 'reset') && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Email Address <span className="text-slate-500">{mode === 'reset' ? '(If set during registration)' : '(Optional)'}</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          )}

          {/* Password Input with Visibility Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                {mode === 'reset' ? 'New Password' : 'Password'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(null); setIsNotFoundError(false); }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register and Reset modes) */}
          {(mode === 'register' || mode === 'reset') && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Confirm {mode === 'reset' ? 'New ' : ''}Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-rose-500/70 focus:ring-1 focus:ring-rose-500'
                      : confirmPassword && password === confirmPassword
                      ? 'border-emerald-500/70 focus:ring-1 focus:ring-emerald-500'
                      : 'border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50'
                  }`}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-rose-400">Passwords do not match.</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passwords match!
                </p>
              )}
            </div>
          )}

          {/* Transfer Guest Progress Checkbox */}
          {mode === 'register' && (
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 cursor-pointer hover:bg-cyan-950/30 transition-colors">
              <input
                type="checkbox"
                checked={migrateGuest}
                onChange={(e) => setMigrateGuest(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <div className="text-xs">
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Transfer my guest progress
                </span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Seamlessly copies all your completed lessons, practice question scores, and SM-2 flashcard intervals into your account.
                </p>
              </div>
            </label>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || ((mode === 'register' || mode === 'reset') && confirmPassword.length > 0 && password !== confirmPassword)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Free Account'}
                  {mode === 'reset' && 'Update Password & Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Bottom Switch Links */}
          <div className="pt-2 text-center border-t border-slate-800/60 space-y-1.5">
            {mode === 'login' && (
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); setIsNotFoundError(false); }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Create one now
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setIsNotFoundError(false); }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Sign in here
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <p className="text-xs text-slate-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setIsNotFoundError(false); }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Back to sign in
                </button>
              </p>
            )}

            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline and guest study are always supported.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

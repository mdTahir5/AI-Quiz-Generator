import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BrainCircuit,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-radial-gradient relative">
      {/* Top corner theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white/90 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand & Heading */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 mb-3 shadow-lg shadow-teal-500/20">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome to CogniQuiz
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign in to start generating AI quizzes & compete
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-500 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-teal-500/25 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Quick-fill seeded leaderboard competitors:</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleQuickLogin('tourist@codeforces.org', 'Password@123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-left transition hover:border-teal-500/40"
            >
              <div className="font-semibold text-red-500 dark:text-red-400">Grandmaster</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">tourist@codeforces.org</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya.s@iitd.ac.in', 'Password@123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-left transition hover:border-teal-500/40"
            >
              <div className="font-semibold text-purple-600 dark:text-purple-400">Cand. Master</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">priya.s@iitd.ac.in</div>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-semibold underline underline-offset-4 ml-1 transition"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

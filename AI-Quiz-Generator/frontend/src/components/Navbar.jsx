import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTierInfo } from '../utils/tierColors';
import ThemeToggle from './ThemeToggle';
import {
  Trophy,
  User,
  LogOut,
  Trash2,
  ChevronDown,
  LayoutDashboard,
  BrainCircuit,
  Menu,
  X
} from 'lucide-react';
import DeleteAccountModal from './DeleteAccountModal';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, deleteAccount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);

  const tier = getTierInfo(user?.rating || 1200);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteAccountConfirm = async () => {
    const res = await deleteAccount();
    if (!res.success) {
      throw new Error(res.message);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0a0d14]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-[1.5px] shadow-lg shadow-teal-500/20 group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-slate-100 dark:bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-teal-500 dark:text-teal-400 group-hover:rotate-12 transition duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition">
                  CogniQuiz
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">Full-Stack Quiz Platform</p>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2 ${
                activeTab === 'dashboard'
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>My Profile</span>
            </button>
          </nav>

          {/* User Profile Chip, Theme Toggle & Dropdown */}
          <div className="flex items-center space-x-2.5">
            {/* Desktop Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-teal-500/50 transition shadow-sm group"
              >
                {/* Avatar Initial */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>

                {/* Name & Tier */}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white leading-tight flex items-center space-x-1.5">
                    <span>{user?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`text-[10px] font-mono font-medium ${tier.textColor}`}>
                      {tier.tier} ({user?.rating || 1200})
                    </span>
                  </div>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-700/80 shadow-2xl py-2 z-50 animate-fadeIn divide-y divide-slate-100 dark:divide-slate-800/60">
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tier.badgeColor}">
                      ★ {tier.tier} · {user?.rating || 1200} pts
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center space-x-2.5 transition"
                    >
                      <User className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                      <span>My Profile & Stats</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('leaderboard');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center space-x-2.5 transition"
                    >
                      <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>Leaderboard Rankings</span>
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center space-x-2.5 transition"
                    >
                      <LogOut className="w-4 h-4 text-slate-400" />
                      <span>Logout</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowDeleteModal(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center space-x-2.5 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger & Theme Toggle */}
            <div className="flex items-center space-x-1.5 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1322] px-4 pt-2 pb-4 space-y-2 animate-fadeIn shadow-lg">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left flex items-center space-x-3 ${
                activeTab === 'dashboard'
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('leaderboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left flex items-center space-x-3 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium text-left flex items-center space-x-3 ${
                activeTab === 'profile'
                  ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Switch Theme</span>
              <ThemeToggle showLabel />
            </div>
          </div>
        )}
      </header>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccountConfirm}
      />
    </>
  );
}

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${isDark
          ? 'bg-slate-900/80 border border-slate-700/80 text-amber-400 hover:text-amber-300 hover:bg-slate-800'
          : 'bg-white border border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-slate-100 shadow-sm'
        } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-90 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0 text-indigo-600" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}

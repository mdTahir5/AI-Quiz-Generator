import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import QuizResultModal from './pages/QuizResultModal';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'leaderboard', 'profile'

  // Active quiz session states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-teal-500 dark:text-teal-400 animate-spin" />
        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">Initializing CogniQuiz AI...</p>
      </div>
    );
  }

  // Not authenticated: Show Login or Register
  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  // If in an active quiz
  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100">
        <QuizPage
          quizData={activeQuiz}
          onFinish={(result) => {
            setActiveQuiz(null);
            setQuizResult(result);
          }}
          onCancel={() => setActiveQuiz(null)}
        />
      </div>
    );
  }

  // If viewing quiz results
  if (quizResult) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <QuizResultModal
          result={quizResult}
          onRetake={() => {
            setQuizResult(null);
            setActiveTab('dashboard');
          }}
          onGoLeaderboard={() => {
            setQuizResult(null);
            setActiveTab('leaderboard');
          }}
          onGoProfile={() => {
            setQuizResult(null);
            setActiveTab('profile');
          }}
        />
      </div>
    );
  }

  // Main authenticated layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardPage
            onStartQuiz={(data) => setActiveQuiz(data)}
            onNavigateToLeaderboard={() => setActiveTab('leaderboard')}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'leaderboard' && <LeaderboardPage />}

        {activeTab === 'profile' && (
          <ProfilePage
            onStartQuiz={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 bg-white dark:bg-[#0a0d14] text-center text-xs text-slate-500">
        <p>© 2026 CogniQuiz AI · Full-Stack Spring Boot 3 & React Platform · Powered by OpenRouter AI</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

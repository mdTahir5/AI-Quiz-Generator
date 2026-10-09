import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTierInfo } from '../utils/tierColors';
import DeleteAccountModal from '../components/DeleteAccountModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  Trash2,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Award
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProfilePage({ onStartQuiz }) {
  const { user, deleteAccount } = useAuth();
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/user/profile');
      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Unable to load user profile and analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDeleteConfirm = async () => {
    const res = await deleteAccount();
    if (!res.success) {
      throw new Error(res.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading performance analytics from MySQL...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center">
          {error || 'Profile could not be loaded.'}
        </div>
      </div>
    );
  }

  const tier = getTierInfo(profile.rating || 1200);

  // Chart 1 Data: Line Chart (Score & Rating History)
  const historyLabels = profile.scoreHistory && profile.scoreHistory.length > 0
    ? profile.scoreHistory.map((h, i) => `Quiz #${i + 1} (${h.subject})`)
    : ['Initial Baseline'];

  const ratingHistoryData = profile.scoreHistory && profile.scoreHistory.length > 0
    ? profile.scoreHistory.map((h) => h.ratingSnapshot)
    : [profile.rating];

  const scoreHistoryData = profile.scoreHistory && profile.scoreHistory.length > 0
    ? profile.scoreHistory.map((h) => h.score)
    : [profile.totalScore];

  const lineChartData = {
    labels: historyLabels,
    datasets: [
      {
        label: 'Rating Progression',
        data: ratingHistoryData,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        yAxisID: 'yRating',
      },
      {
        label: 'Quiz Net Score',
        data: scoreHistoryData,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        tension: 0.35,
        borderDash: [5, 5],
        fill: false,
        pointBackgroundColor: '#818cf8',
        pointRadius: 3,
        yAxisID: 'yScore',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: isDark ? '#cbd5e1' : '#334155', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#38bdf8' : '#0284c7',
        bodyColor: isDark ? '#f1f5f9' : '#0f172a',
        borderColor: isDark ? '#334155' : '#cbd5e1',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)' },
      },
      yRating: {
        type: 'linear',
        position: 'left',
        ticks: { color: '#14b8a6', font: { size: 10 } },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)' },
        title: { display: true, text: 'Rating', color: '#14b8a6', font: { size: 10 } },
      },
      yScore: {
        type: 'linear',
        position: 'right',
        ticks: { color: '#818cf8', font: { size: 10 } },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Quiz Score', color: '#818cf8', font: { size: 10 } },
      },
    },
  };

  // Chart 2 Data: Multi-Color Donut Chart (Subject-wise Scores)
  const subjectList = profile.subjectStats || [];
  const donutLabels = subjectList.length > 0 ? subjectList.map((s) => s.subject) : ['No attempts yet'];
  const donutDataScores = subjectList.length > 0 ? subjectList.map((s) => Math.max(0, s.totalScore)) : [1];
  const donutColors = [
    '#14b8a6', // Teal
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#ec4899', // Pink
  ];

  const donutChartData = {
    labels: donutLabels,
    datasets: [
      {
        data: donutDataScores,
        backgroundColor: subjectList.length > 0 ? donutColors.slice(0, subjectList.length) : ['#334155'],
        borderColor: isDark ? '#0a0d14' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: isDark ? '#cbd5e1' : '#334155', font: { family: 'Plus Jakarta Sans', size: 11 }, padding: 12 },
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#38bdf8' : '#0284c7',
        bodyColor: isDark ? '#f1f5f9' : '#0f172a',
        borderColor: isDark ? '#334155' : '#cbd5e1',
        borderWidth: 1,
      },
    },
    cutout: '68%',
  };

  // Chart 3 Data: Clustered Column Chart (Correct vs Incorrect by Subject)
  const barLabels = subjectList.length > 0 ? subjectList.map((s) => s.subject) : ['DSA', 'OS'];
  const correctCounts = subjectList.length > 0 ? subjectList.map((s) => s.correctCount) : [0, 0];
  const incorrectCounts = subjectList.length > 0 ? subjectList.map((s) => s.incorrectCount) : [0, 0];

  const clusteredBarData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Correct (+4)',
        data: correctCounts,
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Incorrect (-1)',
        data: incorrectCounts,
        backgroundColor: '#f43f5e',
        borderRadius: 8,
      },
    ],
  };

  const clusteredBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: isDark ? '#cbd5e1' : '#334155', font: { family: 'Plus Jakarta Sans', size: 11 } },
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#38bdf8' : '#0284c7',
        bodyColor: isDark ? '#f1f5f9' : '#0f172a',
        borderColor: isDark ? '#334155' : '#cbd5e1',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)' },
      },
      y: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* Profile Overview Card with All Registration Details */}
      <div className="bg-white/95 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          {/* Avatar and Main Info */}
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-[2px] shadow-xl shadow-teal-500/20">
              <div className="w-full h-full bg-white dark:bg-[#0a0d14] rounded-[22px] flex items-center justify-center text-slate-900 dark:text-white text-3xl font-black uppercase shadow-inner">
                {profile.name?.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${tier.badgeColor}`}>
                  ★ {profile.rankTier}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{profile.email}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">
                Member since {profile.joinedDate}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onStartQuiz}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take New Quiz</span>
            </button>
          </div>
        </div>

        {/* Complete Registered Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">School / Institute</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.schoolOrInstitute}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Phone Number</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Age</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{profile.age} years old</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Address</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.address}</p>
            </div>
          </div>
        </div>

        {/* Overall Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Rating</p>
            <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5">{profile.rating}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Total Score</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{profile.totalScore}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Questions Solved</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{profile.totalQuestionsSolved}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Correct Answers</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{profile.correctAnswers}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1 shadow-sm">
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Overall Accuracy</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{profile.overallAccuracy}%</p>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Grid */}
      <div className="space-y-6">

        {/* Chart 1: Line Chart for Score/Rating History */}
        <div className="bg-white/95 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Rating & Score History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Progression across completed quizzes from MySQL database
              </p>
            </div>
          </div>
          <div className="h-72 w-full pt-2">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Charts 2 & 3 in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chart 2: Multi-color Donut Chart for Subject-wise Scores */}
          <div className="bg-white/95 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PieIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Subject-Wise Score Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Net points accumulated by discipline
                  </p>
                </div>
              </div>
            </div>
            <div className="h-64 w-full relative flex items-center justify-center">
              <Doughnut data={donutChartData} options={donutChartOptions} />
            </div>
          </div>

          {/* Chart 3: Clustered Column Chart for Correct vs Incorrect */}
          <div className="bg-white/95 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Correct vs Incorrect by Subject
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clustered performance comparison
                  </p>
                </div>
              </div>
            </div>
            <div className="h-64 w-full pt-2">
              <Bar data={clusteredBarData} options={clusteredBarOptions} />
            </div>
          </div>

        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

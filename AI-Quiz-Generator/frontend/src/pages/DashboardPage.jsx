import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTierInfo } from '../utils/tierColors';
import api from '../services/api';
import { 
  Sparkles, 
  Code2, 
  Cpu, 
  Binary, 
  Layers, 
  Wifi, 
  Server, 
  Database, 
  Flame, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  HelpCircle,
  Trophy,
  Award
} from 'lucide-react';

const SUBJECTS = [
  {
    id: 'DSA',
    name: 'DSA',
    title: 'Data Structures & Algorithms',
    icon: Code2,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'hover:border-cyan-500/60',
    desc: 'Arrays, Trees, Graphs, DP, Sorting & Greedy',
  },
  {
    id: 'OS',
    name: 'OS',
    title: 'Operating Systems',
    icon: Cpu,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'hover:border-teal-500/60',
    desc: 'Processes, Threads, Deadlocks, Paging, Virtual Memory',
  },
  {
    id: 'AI/ML',
    name: 'AI/ML',
    title: 'AI & Machine Learning',
    icon: Sparkles,
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'hover:border-purple-500/60',
    desc: 'Neural Networks, Transformers, Backprop, Optimizers',
  },
  {
    id: 'System Design',
    name: 'System Design',
    title: 'System Design',
    icon: Layers,
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'hover:border-amber-500/60',
    desc: 'Scalability, Caching, CAP Theorem, Sharding, Microservices',
  },
  {
    id: 'Computer Networks',
    name: 'Computer Networks',
    title: 'Computer Networks',
    icon: Wifi,
    gradient: 'from-indigo-500/20 to-blue-500/20',
    border: 'hover:border-indigo-500/60',
    desc: 'TCP/IP, OSI Layers, Routing, HTTP/3, TLS, DNS',
  },
  {
    id: 'Computer Architecture',
    name: 'Computer Architecture',
    title: 'Computer Architecture',
    icon: Binary,
    gradient: 'from-rose-500/20 to-red-500/20',
    border: 'hover:border-rose-500/60',
    desc: 'Pipelines, Hazards, Caches, Amdahl Law, Branch Prediction',
  },
  {
    id: 'DBMS',
    name: 'DBMS',
    title: 'Database Management',
    icon: Database,
    gradient: 'from-violet-500/20 to-indigo-500/20',
    border: 'hover:border-violet-500/60',
    desc: 'ACID, Normalization, B+ Trees, Transactions, Indexing',
  },
];

const QUESTION_COUNTS = [5, 10, 15, 20, 25];

const DIFFICULTIES = [
  { level: 'Easy', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500' },
  { level: 'Medium', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10 hover:border-amber-500' },
  { level: 'Hard', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10 hover:border-rose-500' },
];

export default function DashboardPage({ onStartQuiz, onNavigateToLeaderboard, onNavigateToProfile }) {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState('DSA');
  const [selectedCount, setSelectedCount] = useState(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState('');

  const tier = getTierInfo(user?.rating || 1200);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setGenerationStep('Synthesizing high-yield questions with OpenRouter AI...');

    try {
      // Step feedback animation
      setTimeout(() => {
        setGenerationStep('Validating 4 distinct options & technical explanations...');
      }, 1000);

      const res = await api.post('/quiz/generate', {
        subject: selectedSubject,
        numberOfQuestions: selectedCount,
        difficulty: selectedDifficulty,
      });

      if (res.data.success && res.data.data && res.data.data.length > 0) {
        onStartQuiz({
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          questions: res.data.data,
        });
      } else {
        setError('No questions returned by generator. Please try again.');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err?.response?.data?.message || 'Failed to generate quiz questions.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50/70 via-white to-indigo-50/70 dark:from-slate-900 dark:via-[#111728] dark:to-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs shadow-sm">
              <span className={`w-2 h-2 rounded-full ${tier.badgeColor.includes('red') ? 'bg-red-500' : 'bg-teal-500'} animate-pulse`} />
              <span className="text-slate-600 dark:text-slate-300 font-mono">Rank Tier:</span>
              <span className={`font-bold ${tier.textColor}`}>{tier.tier}</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">({user?.rating || 1200} Rating)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to Battle, <span className="text-gradient">{user?.name}</span>?
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Generate AI-powered competitive quizzes across Computer Science disciplines.
              Earn <span className="text-emerald-500 dark:text-emerald-400 font-bold">+4</span> for correct answers, take <span className="text-rose-500 dark:text-rose-400 font-bold">-1</span> penalties.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 self-stretch md:self-auto min-w-[280px]">
            <div className="bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center backdrop-blur-sm shadow-sm">
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Total Score</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{user?.totalScore || 0}</p>
            </div>
            <div className="bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center backdrop-blur-sm shadow-sm">
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Questions</p>
              <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">{user?.totalQuestionsSolved || 0}</p>
            </div>
            <div className="bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-center backdrop-blur-sm shadow-sm">
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Correct</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{user?.correctAnswers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Generation Panel */}
      <div className="bg-white/90 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl relative">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Quiz Generator</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by OpenRouter API & validated CS question engine</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Strict 4 Options</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Auto-Timed</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Choose Subject */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            1. Select Subject Area
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {SUBJECTS.map((sub) => {
              const Icon = sub.icon;
              const isSelected = selectedSubject === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group ${
                    isSelected
                      ? 'bg-teal-50/90 dark:bg-slate-800/90 border-teal-500 shadow-lg shadow-teal-500/15 dark:shadow-teal-500/20'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      isSelected ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-white'}`}>
                        {sub.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {sub.desc}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Question Count & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              2. Number of Questions
            </label>
            <div className="flex items-center gap-2">
              {QUESTION_COUNTS.map((count) => {
                const isSelected = selectedCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedCount(count)}
                    className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition border ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                        : 'bg-slate-100 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 font-mono">
              Estimated duration: ~{selectedCount * 1.5} minutes ({selectedCount * 4} max score)
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => {
                const isSelected = selectedDifficulty === diff.level;
                return (
                  <button
                    key={diff.level}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.level)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold transition border ${diff.color} ${
                      isSelected ? 'ring-2 ring-teal-500 dark:ring-teal-400 shadow-md' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {diff.level}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 font-mono">
              Scoring: +4 per correct, -1 per incorrect, 0 for unattempted
            </p>
          </div>
        </div>

        {/* Generate Button / Progress State */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-teal-500/40 text-center space-y-3 shadow-lg shadow-teal-500/10">
              <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-teal-600 dark:text-teal-300 animate-pulse">
                {generationStep || 'Generating AI questions...'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calling OpenRouter API ({selectedSubject} · {selectedCount} Questions · {selectedDifficulty})
              </p>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-extrabold text-base tracking-wide flex items-center justify-center space-x-3 transition transform hover:scale-[1.01] shadow-xl shadow-teal-500/25 active:scale-[0.99]"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Generate AI Quiz · {selectedCount} Questions</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          )}
        </div>
      </div>

      {/* Quick shortcuts / Platform features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={onNavigateToLeaderboard}
          className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500/40 cursor-pointer transition group shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 group-hover:scale-110 transition">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                Global Leaderboard
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Check Top 10 rankings, podium medals & tier badges from Grandmaster to Newbie.
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={onNavigateToProfile}
          className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40 cursor-pointer transition group shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                Detailed Analytics & Performance Charts
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Score history line chart, subject donut breakdown & clustered accuracy metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

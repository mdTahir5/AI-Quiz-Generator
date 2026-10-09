import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { getTierInfo } from '../utils/tierColors';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';

export default function QuizResultModal({ result, onRetake, onGoLeaderboard, onGoProfile }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    // Launch celebratory confetti if accuracy is >= 60%
    if (result.accuracyPercentage >= 60) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas not supported
      }
    }
  }, [result]);

  const newTier = getTierInfo(result.newRating);
  const isPositiveRating = result.ratingDelta >= 0;

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner / Celebration */}
      <div className="text-center relative bg-gradient-to-b from-teal-50/70 via-white to-slate-50 dark:from-[#111728] dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-600 mb-4 shadow-xl shadow-amber-500/25">
          <Trophy className="w-8 h-8 text-slate-950" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Quiz Completed!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {result.subject} · {result.difficulty} Difficulty · {result.totalQuestions} Questions Evaluated
        </p>

        {/* Rating Change & Tier Pill */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm font-mono shadow-sm">
            <span className="text-slate-500 dark:text-slate-400">Rating:</span>
            <span className="text-slate-900 dark:text-white font-bold">{result.previousRating}</span>
            <span className="text-slate-400 dark:text-slate-500">→</span>
            <span className="text-teal-600 dark:text-teal-400 font-extrabold">{result.newRating}</span>
            <div className={`flex items-center font-bold px-2 py-0.5 rounded-lg text-xs ${
              isPositiveRating ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {isPositiveRating ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {isPositiveRating ? `+${result.ratingDelta}` : result.ratingDelta}
            </div>
          </div>

          <div className={`px-4 py-2 rounded-2xl border text-xs font-bold font-mono tracking-wider shadow-sm ${newTier.badgeColor}`}>
            ★ Tier: {newTier.tier}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Net Score</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {result.score}
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal"> / {result.maxPossibleScore}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Accuracy</p>
            <p className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1">
              {result.accuracyPercentage}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Correct (+4)</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {result.correctCount}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Incorrect (-1)</p>
            <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {result.incorrectCount}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2 transition shadow-lg shadow-teal-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate Another Quiz</span>
          </button>

          <button
            onClick={onGoLeaderboard}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm flex items-center space-x-2 transition border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>View Leaderboard</span>
          </button>

          <button
            onClick={onGoProfile}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm flex items-center space-x-2 transition border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <Award className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>View Profile & Analytics</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Detailed Answers & Explanations ({result.questionDetails?.length || 0})
          </h2>
        </div>

        <div className="space-y-3">
          {result.questionDetails?.map((q, idx) => {
            const isExpanded = expandedIndex === idx;
            const isAttempted = !!q.selectedAnswer;

            return (
              <div
                key={idx}
                className="bg-white/95 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition shadow-sm"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(idx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition gap-4"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    {/* Status Icon */}
                    {q.isCorrect ? (
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isAttempted ? (
                      <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
                        <XCircle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                        <MinusCircle className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-0.5">
                        <span>Q{idx + 1}</span>
                        <span>·</span>
                        <span className={`font-bold ${
                          q.scoreDelta > 0 ? 'text-emerald-600 dark:text-emerald-400' : q.scoreDelta < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {q.scoreDelta > 0 ? '+4 pts' : q.scoreDelta < 0 ? '-1 pt' : '0 pts (Skipped)'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/40 space-y-4">
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                      {q.questionText}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { key: 'A', text: q.optionA },
                        { key: 'B', text: q.optionB },
                        { key: 'C', text: q.optionC },
                        { key: 'D', text: q.optionD },
                      ].map((opt) => {
                        const isCorrectOpt = q.correctAnswer === opt.key;
                        const isUserOpt = q.selectedAnswer === opt.key;

                        let style = 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400';
                        if (isCorrectOpt) {
                          style = 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-semibold';
                        } else if (isUserOpt && !q.isCorrect) {
                          style = 'bg-rose-50 dark:bg-rose-500/15 border-rose-400 dark:border-rose-500/60 text-rose-800 dark:text-rose-300 font-semibold';
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-xl border flex items-start space-x-2.5 ${style}`}
                          >
                            <span className="font-bold">{opt.key}:</span>
                            <span className="flex-1">{opt.text}</span>
                            {isCorrectOpt && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                                Correct
                              </span>
                            )}
                            {isUserOpt && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                isCorrectOpt
                                  ? 'bg-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                                  : 'bg-rose-500/30 text-rose-800 dark:text-rose-200'
                              }`}>
                                Your Pick
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation box */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-500/30 text-xs leading-relaxed shadow-sm">
                      <p className="font-bold text-teal-600 dark:text-teal-400 mb-1 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Technical Explanation:</span>
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

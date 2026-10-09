import React, { useState, useEffect } from 'react';
import api from '../services/api';
import QuestionPalette from '../components/QuestionPalette';
import ThemeToggle from '../components/ThemeToggle';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  AlertCircle,
  HelpCircle,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';

export default function QuizPage({ quizData, onFinish, onCancel }) {
  const { subject, difficulty, questions } = quizData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [index]: "A" | "B" | "C" | "D" }
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(questions.length * 90); // 90 seconds per question
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionKey,
    }));
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const payloadAnswers = questions.map((q, idx) => ({
        questionText: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        selectedAnswer: answers[idx] || null,
        explanation: q.explanation,
      }));

      const res = await api.post('/quiz/submit', {
        subject,
        difficulty,
        answers: payloadAnswers,
        timeSpentSeconds: questions.length * 90 - timeLeft,
      });

      if (res.data.success) {
        onFinish(res.data.data);
      } else {
        setError(res.data.message || 'Submission failed');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Quiz submit error:', err);
      setError(err?.response?.data?.message || 'Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">

      {/* Top Quiz Header */}
      <div className="bg-white/95 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold text-xs uppercase tracking-wider">
            {subject}
          </div>
          <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${
            difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
            difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          }`}>
            {difficulty}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
            Scoring: +4 / -1
          </span>
        </div>

        {/* Live Timer, Theme Toggle, & Submit Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <ThemeToggle />

          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold ${
            timeLeft < 60
              ? 'bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/40 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-lg shadow-teal-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Quiz</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Grid: Question Card + Palette Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Question Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/95 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl relative min-h-[420px] flex flex-col justify-between">

            <div>
              {/* Question Counter & Flag Action */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                  QUESTION {currentIndex + 1} OF {questions.length}
                </span>
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition ${
                    flagged.has(currentIndex)
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged.has(currentIndex) ? 'Flagged' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
                {currentQ.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3">
                {[
                  { key: 'A', text: currentQ.optionA },
                  { key: 'B', text: currentQ.optionB },
                  { key: 'C', text: currentQ.optionC },
                  { key: 'D', text: currentQ.optionD },
                ].map((opt) => {
                  const isSelected = answers[currentIndex] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-start space-x-3.5 group ${
                        isSelected
                          ? 'bg-teal-50 dark:bg-teal-500/15 border-teal-500 text-slate-900 dark:text-white shadow-md shadow-teal-500/10 ring-1 ring-teal-500'
                          : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition ${
                        isSelected
                          ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}>
                        {opt.key}
                      </div>
                      <div className="flex-1 text-sm pt-0.5 leading-snug">
                        {opt.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clear selection */}
            {answers[currentIndex] && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 underline underline-offset-4 transition"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center space-x-2 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
              Answered {answeredCount} of {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold flex items-center space-x-2 transition shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-extrabold flex items-center space-x-2 transition shadow-lg shadow-teal-500/25"
              >
                <span>Review & Submit</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Palette (1 Col) */}
        <div className="space-y-4">
          <QuestionPalette
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
            answers={answers}
            flaggedQuestions={flagged}
          />

          {/* Quick Rules reminder */}
          <div className="bg-white/95 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 space-y-2 shadow-sm">
            <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Competitive Scoring</span>
            </p>
            <ul className="space-y-1 text-[11px] list-disc list-inside">
              <li><strong className="text-emerald-600 dark:text-emerald-400">+4 points</strong> per correct answer</li>
              <li><strong className="text-rose-600 dark:text-rose-400">-1 point</strong> for wrong answers</li>
              <li><strong className="text-slate-500 dark:text-slate-400">0 points</strong> for skipped questions</li>
              <li>Results update persistent MySQL analytics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Final Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Submit Quiz?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Review your progress before final evaluation. Once submitted, answers cannot be edited.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-center">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Answered</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{answeredCount}</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">Unattempted</p>
                <p className="text-2xl font-extrabold text-slate-600 dark:text-slate-400 mt-1">
                  {questions.length - answeredCount}
                </p>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 mb-4 bg-red-100 dark:bg-red-950/40 p-3 rounded-xl border border-red-300 dark:border-red-800/40">
                {error}
              </p>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Continue Quiz
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center space-x-2 transition shadow-lg shadow-teal-500/25 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Grading & Saving...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm & Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

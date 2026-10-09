import React from 'react';
import { Bookmark, CheckCircle2, Circle } from 'lucide-react';

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  onSelectQuestion,
  answers,
  flaggedQuestions,
}) {
  return (
    <div className="bg-white/95 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Question Palette
        </h3>
        <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
          {Object.keys(answers).length} / {totalQuestions} Answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isCurrent = currentIndex === i;
          const isAnswered = answers[i] !== undefined && answers[i] !== '';
          const isFlagged = flaggedQuestions.has(i);

          let bg = 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700';
          if (isCurrent) {
            bg = 'ring-2 ring-teal-500 border-teal-500 bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-white font-bold';
          } else if (isFlagged) {
            bg = 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/60 text-amber-800 dark:text-amber-300 font-medium';
          } else if (isAnswered) {
            bg = 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-medium';
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectQuestion(i)}
              className={`h-9 rounded-xl border text-xs font-mono flex items-center justify-center transition-all duration-150 relative ${bg}`}
            >
              {i + 1}
              {isFlagged && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500/70" />
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500/70" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded border-2 border-teal-500" />
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700" />
          <span>Unvisited</span>
        </div>
      </div>
    </div>
  );
}

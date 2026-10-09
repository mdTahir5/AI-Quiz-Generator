export function getTierInfo(rating = 1200) {
  if (rating >= 2400) {
    return {
      tier: 'Grandmaster',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      textColor: 'text-red-400',
      borderColor: 'border-red-500',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]',
      gradient: 'from-red-600 to-rose-500',
    };
  }
  if (rating >= 2100) {
    return {
      tier: 'Master',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
      gradient: 'from-orange-600 to-amber-500',
    };
  }
  if (rating >= 1900) {
    return {
      tier: 'Candidate Master',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      gradient: 'from-purple-600 to-fuchsia-500',
    };
  }
  if (rating >= 1600) {
    return {
      tier: 'Expert',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]',
      gradient: 'from-blue-600 to-indigo-500',
    };
  }
  if (rating >= 1400) {
    return {
      tier: 'Specialist',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      gradient: 'from-cyan-600 to-teal-500',
    };
  }
  if (rating >= 1200) {
    return {
      tier: 'Pupil',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      gradient: 'from-emerald-600 to-green-500',
    };
  }
  return {
    tier: 'Newbie',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    gradient: 'from-slate-600 to-gray-500',
  };
}

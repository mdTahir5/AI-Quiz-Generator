import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getTierInfo } from '../utils/tierColors';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Award, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  UserCheck, 
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/leaderboard/top');
      if (res.data.success && res.data.data) {
        setTopUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Unable to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const first = topUsers[0];
  const second = topUsers[1];
  const third = topUsers[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-7 h-7 text-amber-500 dark:text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Global Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
           Competitive rating standings across top computer science engineers
          </p>
        </div>

        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 hover:border-teal-500/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Standings</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading live competitive standings...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center text-sm">
          {error}
        </div>
      ) : (
        <>
          {/* Top-3 Podium */}
          {topUsers.length >= 3 && (
            <div className="pt-6 pb-2">
              <div className="text-center mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  TOP CONTENDERS PODIUM
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-end justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">

                {/* 2nd Place (Silver) */}
                {second && (
                  <div className="w-full md:w-1/3 flex flex-col items-center order-2 md:order-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-100 p-0.5 shadow-xl shadow-slate-300/10 mb-3 relative group">
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-slate-800 dark:text-slate-200 font-extrabold text-xl shadow-inner">
                        {second.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs shadow">
                        2
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white text-center truncate max-w-[180px]">
                      {second.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-center truncate max-w-[180px]">
                      {second.schoolOrInstitute}
                    </p>

                    <div className="mt-1 flex items-center space-x-1.5 font-mono">
                      <span className={`text-xs font-bold ${getTierInfo(second.rating).textColor}`}>
                        {second.rating}
                      </span>
                      <span className="text-[10px] text-slate-500">· {second.totalScore} pts</span>
                    </div>

                    {/* Silver Pedestal */}
                    <div className="w-full mt-4 h-32 rounded-t-2xl bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-900 dark:to-slate-800/90 border-t-2 border-slate-400 dark:border-slate-300 flex flex-col items-center justify-center p-3 shadow-lg">
                      <Medal className="w-8 h-8 text-slate-500 dark:text-slate-300 mb-1" />
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">2nd PLACE</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">SILVER MEDAL</span>
                    </div>
                  </div>
                )}

                {/* 1st Place (Gold) - Elevated */}
                {first && (
                  <div className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2">
                    <Crown className="w-8 h-8 text-amber-500 dark:text-amber-400 animate-bounce mb-1" />

                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-[2px] shadow-2xl shadow-amber-500/30 mb-3 relative">
                      <div className="w-full h-full bg-white dark:bg-[#111726] rounded-[14px] flex items-center justify-center text-amber-500 dark:text-amber-400 font-black text-2xl shadow-inner">
                        {first.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg">
                        1
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white text-center truncate max-w-[200px]">
                      {first.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center truncate max-w-[200px]">
                      {first.schoolOrInstitute}
                    </p>

                    <div className="mt-1 flex items-center space-x-2 font-mono">
                      <span className={`text-sm font-black ${getTierInfo(first.rating).textColor}`}>
                        {first.rating}
                      </span>
                      <span className="text-xs text-amber-500 dark:text-amber-400 font-bold">· {first.totalScore} pts</span>
                    </div>

                    {/* Gold Pedestal */}
                    <div className="w-full mt-4 h-44 rounded-t-2xl bg-gradient-to-t from-amber-100 via-amber-50 to-amber-200/60 dark:from-slate-900 dark:via-[#19223a] dark:to-amber-500/20 border-t-4 border-amber-500 dark:border-amber-400 flex flex-col items-center justify-center p-3 shadow-2xl relative">
                      <div className="absolute top-2 w-16 h-1 rounded-full bg-amber-400/50" />
                      <Trophy className="w-10 h-10 text-amber-500 dark:text-amber-400 mb-1" />
                      <span className="text-sm font-black text-amber-700 dark:text-amber-300 tracking-wider">CHAMPION</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">GOLD MEDAL</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400/80 font-mono mt-1">{getTierInfo(first.rating).tier}</span>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Bronze) */}
                {third && (
                  <div className="w-full md:w-1/3 flex flex-col items-center order-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-600 p-0.5 shadow-xl shadow-amber-700/20 mb-3 relative">
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-700 dark:text-amber-600 font-extrabold text-xl shadow-inner">
                        {third.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-xs shadow">
                        3
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white text-center truncate max-w-[180px]">
                      {third.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-center truncate max-w-[180px]">
                      {third.schoolOrInstitute}
                    </p>

                    <div className="mt-1 flex items-center space-x-1.5 font-mono">
                      <span className={`text-xs font-bold ${getTierInfo(third.rating).textColor}`}>
                        {third.rating}
                      </span>
                      <span className="text-[10px] text-slate-500">· {third.totalScore} pts</span>
                    </div>

                    {/* Bronze Pedestal */}
                    <div className="w-full mt-4 h-24 rounded-t-2xl bg-gradient-to-t from-orange-100 to-amber-50 dark:from-slate-900 dark:to-slate-800/90 border-t-2 border-amber-700 flex flex-col items-center justify-center p-3 shadow-lg">
                      <Medal className="w-7 h-7 text-amber-700 mb-1" />
                      <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-600">3rd PLACE</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">BRONZE MEDAL</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Top 10 Table */}
          <div className="bg-white/95 dark:bg-[#111726]/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Top 10 Global Standings
              </h2>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Sorted by Rating & Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 text-xs font-mono border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 w-16 text-center">#</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4 hidden sm:table-cell">School / Institute</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4 text-right">Rating</th>
                    <th className="py-3 px-4 text-right">Total Score</th>
                    <th className="py-3 px-4 text-right hidden md:table-cell">Solved</th>
                    <th className="py-3 px-4 text-right hidden md:table-cell">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
                  {topUsers.map((u) => {
                    const tier = getTierInfo(u.rating);
                    const isCurrentUser = user && user.id === u.id;

                    return (
                      <tr
                        key={u.id}
                        className={`transition ${
                          isCurrentUser
                            ? 'bg-teal-500/10 hover:bg-teal-500/15'
                            : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          {u.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                              1
                            </span>
                          ) : u.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 text-xs font-black shadow-md">
                              2
                            </span>
                          ) : u.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black shadow-md">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 text-xs">{u.rank}</span>
                          )}
                        </td>

                        {/* User Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${tier.textColor}`}>
                              {u.name}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40 font-mono">
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        {/* School */}
                        <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 dark:text-slate-400 text-xs truncate max-w-[200px]">
                          {u.schoolOrInstitute || '—'}
                        </td>

                        {/* Tier */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border ${tier.badgeColor}`}>
                            {tier.tier}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {u.rating}
                        </td>

                        {/* Total Score */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-600 dark:text-teal-400">
                          {u.totalScore}
                        </td>

                        {/* Questions Solved */}
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300 text-xs hidden md:table-cell">
                          {u.totalQuestionsSolved}
                        </td>

                        {/* Accuracy */}
                        <td className="py-3.5 px-4 text-right font-mono text-xs hidden md:table-cell text-emerald-600 dark:text-emerald-400 font-semibold">
                          {u.accuracy}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rating Tiers Reference Card */}
          <div className="bg-white/95 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Rating Scale
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
                Grandmaster (≥ 2400)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40">
                Master (≥ 2100)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
                Candidate Master (≥ 1900)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
                Expert (≥ 1600)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                Specialist (≥ 1400)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Pupil (≥ 1200)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-500/20 text-slate-400 border border-slate-500/40">
                Newbie (&lt; 1200)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

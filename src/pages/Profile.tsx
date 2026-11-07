/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { getPlayerLevelInfo, DETECTIVE_LEVELS } from '../utils/scoring';
import { soundManager } from '../utils/audio';
import { User, Shield, Award, Clock, Check, Edit2, Zap, Target, BookOpen } from 'lucide-react';

interface ProfileProps {
  profile: PlayerProfile;
  onUpdateName: (newName: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  const levelInfo = getPlayerLevelInfo(profile.totalPoints);

  const pointsInCurrentLevel = profile.totalPoints - levelInfo.minPoints;
  const levelSpan = levelInfo.maxPoints - levelInfo.minPoints;
  const levelProgressPct = Math.min(100, Math.max(0, (pointsInCurrentLevel / levelSpan) * 100));

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      soundManager.playClick();
      onUpdateName(tempName.trim());
      setIsEditing(false);
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest mb-1.5">
          <User className="w-4 h-4" />
          <span>Consulting Detective Dossier</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
          Investigator Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mt-1">
          Review your official credentials, forensic statistics, and historical inquiry records.
        </p>
      </div>

      {/* Profile Card & Rank Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A86A] to-[#8C6D32] text-[#111318] flex items-center justify-center font-display text-2xl font-bold shadow-lg shrink-0">
              {profile.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              {isEditing ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-3 py-1 bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#C9A86A] rounded-lg text-sm text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 font-display font-bold focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-bold text-[#111318] bg-[#C9A86A] rounded-lg hover:bg-[#D8BA7E] cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-[#A5A7AD] hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display text-2xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setTempName(profile.name);
                      setIsEditing(true);
                    }}
                    title="Edit investigator name"
                    className="p-1 text-[#A5A7AD] hover:text-[#C9A86A] transition-colors rounded cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#C9A86A] font-semibold mt-0.5">
                <span>{profile.title}</span>
                <span aria-hidden="true">·</span>
                <span>Level {levelInfo.level}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#A5A7AD] block">Total Investigation Score</span>
            <span className="font-mono text-3xl font-bold text-[#C9A86A] tabular-nums">
              {profile.totalPoints.toLocaleString()} <span className="text-xs font-sans text-[#A5A7AD]">pts</span>
            </span>
          </div>
        </div>

        {/* Level Progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A5A7AD]">
            <span className="font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
              Rank Progress: Level {levelInfo.level} ({levelInfo.title})
            </span>
            <span className="font-mono tabular-nums">
              {levelInfo.level === 5
                ? 'Maximum Rank Reached'
                : `${profile.totalPoints} / ${levelInfo.maxPoints} pts`}
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#111318] dark:bg-[#111318] bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C9A86A] to-[#D8BA7E] transition-all duration-500"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>

        {/* 5-Level Milestone Chain */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {DETECTIVE_LEVELS.map((lvl) => {
            const isReached = profile.totalPoints >= lvl.minPoints;
            const isCurrent = lvl.level === levelInfo.level;

            return (
              <div
                key={lvl.level}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-[#C9A86A] bg-[#C9A86A]/10 text-[#C9A86A]'
                    : isReached
                    ? 'border-[#2A2E39] bg-[#111318] text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800'
                    : 'border-[#2A2E39]/40 bg-transparent text-[#A5A7AD]/60 opacity-60'
                }`}
              >
                <div className="text-[10px] font-mono uppercase font-bold tracking-wider">
                  Lvl {lvl.level}
                </div>
                <div className="font-display text-xs font-bold truncate mt-0.5">{lvl.title}</div>
                <div className="text-[10px] text-[#A5A7AD] mt-1 font-mono tabular-nums">
                  {lvl.minPoints} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white">
          <div className="text-xs text-[#A5A7AD] mb-1">Cases Closed</div>
          <div className="font-mono text-2xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 tabular-nums">
            {profile.casesCompleted.length}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white">
          <div className="text-xs text-[#A5A7AD] mb-1">Perfect Inquests</div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {profile.perfectCases.length}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white">
          <div className="text-xs text-[#A5A7AD] mb-1">Achievements</div>
          <div className="font-mono text-2xl font-bold text-[#C9A86A] tabular-nums">
            {profile.unlockedAchievements.length}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white">
          <div className="text-xs text-[#A5A7AD] mb-1">Daily Streak</div>
          <div className="font-mono text-2xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 tabular-nums">
            {profile.dailyStreak} {profile.dailyStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Investigation History Log */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
          Inquest History & Resolutions
        </h3>

        {profile.history.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#2A2E39] bg-[#161920]/40">
            <BookOpen className="w-8 h-8 text-[#A5A7AD] mx-auto mb-2 opacity-60" />
            <p className="text-xs text-[#A5A7AD]">No cases resolved yet. Choose a mystery from the library to begin.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111318] dark:bg-[#111318] bg-slate-100 text-[#A5A7AD] border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 font-semibold">
                  <tr>
                    <th className="p-4">Case Title</th>
                    <th className="p-4">Verdict</th>
                    <th className="p-4">Accuracy</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Hints</th>
                    <th className="p-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2E39] dark:divide-[#2A2E39] divide-slate-100 font-medium">
                  {profile.history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-display font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                        {item.caseTitle}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            item.verdict === 'Conviction'
                              ? 'text-emerald-400'
                              : item.verdict === 'Partial'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.verdict}
                        </span>
                      </td>
                      <td className="p-4 font-mono tabular-nums text-[#A5A7AD]">{item.accuracy}%</td>
                      <td className="p-4 font-mono tabular-nums text-[#A5A7AD]">
                        {formatDuration(item.timeSpentSeconds)}
                      </td>
                      <td className="p-4 font-mono tabular-nums text-[#A5A7AD]">{item.hintsUsed}</td>
                      <td className="p-4 font-mono tabular-nums text-right font-bold text-[#C9A86A]">
                        +{item.score} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

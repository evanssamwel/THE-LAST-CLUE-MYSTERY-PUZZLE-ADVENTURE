/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerProfile } from '../types';
import { ACHIEVEMENTS } from '../utils/scoring';
import { Award, CheckCircle2, Lock, Sparkles, Target, Zap, Search, Layers, Key, Compass, Calendar, Crown } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface AchievementsProps {
  profile: PlayerProfile;
}

export const Achievements: React.FC<AchievementsProps> = ({ profile }) => {
  const unlockedCount = profile.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Key':
        return <Key className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'Crown':
        return <Crown className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest mb-1.5">
            <Award className="w-4 h-4" />
            <span>Detective Honors & Citations</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            Achievements Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mt-1">
            Unlock badges and citations for exceptional deductive speed, thorough forensic investigation, and cipher mastery.
          </p>
        </div>

        {/* Global Progress */}
        <div className="p-4 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white min-w-[220px]">
          <div className="flex items-center justify-between text-xs text-[#A5A7AD] mb-1.5">
            <span>Unlocked</span>
            <span className="font-mono tabular-nums text-[#C9A86A] font-bold">
              {unlockedCount} / {totalCount} ({percentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#111318] dark:bg-[#111318] bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C9A86A] to-[#D8BA7E] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = profile.unlockedAchievements.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'border-[#C9A86A]/60 bg-[#1C2028] dark:bg-[#1C2028] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-md ring-1 ring-[#C9A86A]/20'
                  : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920]/60 dark:bg-[#161920]/60 bg-slate-50 text-[#A5A7AD] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isUnlocked
                        ? 'bg-[#C9A86A] text-[#111318]'
                        : 'bg-[#1C2028] dark:bg-[#1C2028] bg-slate-200 text-[#A5A7AD]'
                    }`}
                  >
                    {getAchievementIcon(ach.icon)}
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        isUnlocked
                          ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                          : 'bg-[#111318] text-[#A5A7AD]'
                      }`}
                    >
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                    <div className="font-mono text-xs text-[#C9A86A] mt-1 tabular-nums font-semibold">
                      +{ach.rewardPoints} pts
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[#2A2E39]/60 dark:border-[#2A2E39]/60 border-slate-200 flex items-center justify-between text-[11px] text-[#A5A7AD]">
                <span className="capitalize">{ach.category} Category</span>
                {isUnlocked ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Honor Conferred</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>In Progress</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile, MysteryCase, CaseProgress, DailyChallengeData } from '../types';
import { CaseCard } from '../components/CaseCard';
import { getPlayerLevelInfo } from '../utils/scoring';
import { soundManager } from '../utils/audio';
import {
  Compass,
  BookOpen,
  Award,
  Calendar,
  Play,
  ArrowRight,
  Shield,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HomeProps {
  profile: PlayerProfile;
  cases: MysteryCase[];
  allProgress: Record<string, CaseProgress>;
  activeCaseId: string | null;
  dailyChallenge: DailyChallengeData;
  isDailyCompleted: boolean;
  onOpenCase: (caseId: string) => void;
  onNavigateToCases: () => void;
  onNavigateToAchievements: () => void;
  onNavigateToProfile: () => void;
  onOpenDaily: () => void;
}

export const Home: React.FC<HomeProps> = ({
  profile,
  cases,
  allProgress,
  activeCaseId,
  dailyChallenge,
  isDailyCompleted,
  onOpenCase,
  onNavigateToCases,
  onNavigateToAchievements,
  onNavigateToProfile,
  onOpenDaily,
}) => {
  const [heroImageError, setHeroImageError] = useState(false);
  const levelInfo = getPlayerLevelInfo(profile.totalPoints);
  const activeCase = activeCaseId ? cases.find((c) => c.id === activeCaseId) : null;

  // Next level progress
  const pointsInCurrentLevel = profile.totalPoints - levelInfo.minPoints;
  const levelSpan = levelInfo.maxPoints - levelInfo.minPoints;
  const levelProgressPct = Math.min(100, Math.max(0, (pointsInCurrentLevel / levelSpan) * 100));

  const featuredCases = cases.slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Noir Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10">
            <div>
              {/* Unboxed editorial category */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest mb-3">
                <span>Bureau of Criminal Investigation</span>
                <span aria-hidden="true">·</span>
                <span>Case Archives</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 leading-[1.15] mb-4 text-balance">
                Every Crime Scene Tells A Story. Find The Last Clue.
              </h1>

              <p className="text-xs sm:text-sm text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 max-w-xl leading-relaxed mb-6">
                Step into the shoes of a consulting investigator. Analyze crime scenes, decrypt encrypted ciphers, cross-examine suspect alibis, and unmask culprits before time runs out.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {activeCase ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenCase(activeCase.id);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume: {activeCase.title}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigateToCases();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start New Investigation</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenDaily();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 hover:bg-[#3A3F4D] rounded-xl transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C9A86A]" />
                <span>Daily Dispatch</span>
                {isDailyCompleted && (
                  <span className="text-[10px] text-emerald-400 font-bold">· Done</span>
                )}
              </button>
            </div>
          </div>

          {/* Right Atmospheric Hero Image with Measured Scrim */}
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full overflow-hidden bg-[#111318]">
            {!heroImageError ? (
              <img
                src="/src/assets/images/hero_detective_desk_1794060987546.jpg"
                alt="Detective desk with dossiers, magnifying glass and lamp"
                referrerPolicy="no-referrer"
                onError={() => setHeroImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1C2028] to-[#111318] text-center">
                <Search className="w-12 h-12 text-[#C9A86A] opacity-60 mb-2" />
                <span className="font-display text-lg text-[#F5F3EE]">The Vance Case Archives</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#161920] dark:from-[#161920] from-white via-transparent to-transparent opacity-90 lg:opacity-100" />
          </div>
        </div>
      </section>

      {/* Player Stats Ribbon (4-column strip below hero split) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Detective Rank */}
        <div
          onClick={onNavigateToProfile}
          className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white hover:border-[#C9A86A]/60 transition-colors cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A5A7AD] mb-1.5">
            <span className="text-xs font-medium">Rank & Level</span>
            <Shield className="w-4 h-4 text-[#C9A86A]" />
          </div>
          <div className="font-display text-lg font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 truncate">
            Level {levelInfo.level}: {levelInfo.title}
          </div>
          {/* Progress bar to next level */}
          <div className="mt-2.5 w-full h-1 bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A86A]"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Total Investigation Points */}
        <div className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white shadow-sm">
          <div className="flex items-center justify-between text-[#A5A7AD] mb-1.5">
            <span className="text-xs font-medium">Detective Bounty</span>
            <Sparkles className="w-4 h-4 text-[#C9A86A]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#C9A86A] tabular-nums">
            {profile.totalPoints.toLocaleString()} <span className="text-xs font-sans text-[#A5A7AD]">pts</span>
          </div>
          <div className="text-[11px] text-[#A5A7AD] mt-1">
            Next rank at {levelInfo.maxPoints.toLocaleString()} pts
          </div>
        </div>

        {/* Stat 3: Cases Solved */}
        <div
          onClick={onNavigateToCases}
          className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white hover:border-[#C9A86A]/60 transition-colors cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A5A7AD] mb-1.5">
            <span className="text-xs font-medium">Cases Resolved</span>
            <BookOpen className="w-4 h-4 text-[#C9A86A]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 tabular-nums">
            {profile.casesCompleted.length} / {cases.length}
          </div>
          <div className="text-[11px] text-[#A5A7AD] mt-1">
            {cases.length - profile.casesCompleted.length} mysteries awaiting solution
          </div>
        </div>

        {/* Stat 4: Daily Streak */}
        <div
          onClick={onOpenDaily}
          className="p-5 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white hover:border-[#C9A86A]/60 transition-colors cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A5A7AD] mb-1.5">
            <span className="text-xs font-medium">Daily Streak</span>
            <Zap className="w-4 h-4 text-[#C9A86A]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 tabular-nums">
            {profile.dailyStreak} {profile.dailyStreak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-[11px] text-[#A5A7AD] mt-1">
            {isDailyCompleted ? 'Today’s dispatch solved' : 'Today’s dispatch ready'}
          </div>
        </div>
      </section>

      {/* Daily Challenge Spotlight Banner */}
      <section
        onClick={() => {
          soundManager.playClick();
          onOpenDaily();
        }}
        className="p-6 rounded-2xl border border-[#C9A86A]/40 bg-gradient-to-r from-[#1C2028] via-[#161920] to-[#1C2028] dark:from-[#1C2028] dark:via-[#161920] dark:to-[#1C2028] bg-slate-50 cursor-pointer hover:border-[#C9A86A] transition-all shadow-md group"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A]">
              <Calendar className="w-4 h-4" />
              <span>Today’s Detective Dispatch</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{dailyChallenge.dateKey}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 group-hover:text-[#C9A86A] transition-colors">
              {dailyChallenge.title}
            </h3>
            <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 line-clamp-1 max-w-xl">
              {dailyChallenge.mysterySnippet}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-[#A5A7AD] block">Reward</span>
              <span className="font-mono font-bold text-sm text-[#C9A86A] tabular-nums">
                +{dailyChallenge.bonusPoints} pts
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                onOpenDaily();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isDailyCompleted
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                  : 'text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E]'
              }`}
            >
              <span>{isDailyCompleted ? 'View Resolution' : 'Solve Dispatch'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Mysteries Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
              Featured Mystery Dossiers
            </h2>
            <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-500">
              Selected cases available for immediate investigation
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateToCases();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#C9A86A] hover:underline cursor-pointer"
          >
            <span>View All 8 Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCases.map((c) => {
            const prog = allProgress[c.id];
            const record = profile.history.find((h) => h.caseId === c.id);

            return (
              <CaseCard
                key={c.id}
                mystery={c}
                progress={prog}
                record={record}
                isActive={activeCaseId === c.id}
                onSelect={onOpenCase}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

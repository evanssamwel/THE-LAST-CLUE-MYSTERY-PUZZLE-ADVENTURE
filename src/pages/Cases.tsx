/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MysteryCase, CaseProgress, PlayerProfile } from '../types';
import { CaseCard } from '../components/CaseCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CasesProps {
  cases: MysteryCase[];
  allProgress: Record<string, CaseProgress>;
  profile: PlayerProfile;
  activeCaseId: string | null;
  onSelectCase: (caseId: string) => void;
}

export const Cases: React.FC<CasesProps> = ({
  cases,
  allProgress,
  profile,
  activeCaseId,
  onSelectCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.subtitle.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.synopsis.toLowerCase().includes(query);

      // Difficulty match
      const matchesDiff = difficultyFilter === 'all' || c.difficulty === difficultyFilter;

      // Status match
      const isCompleted = profile.casesCompleted.includes(c.id);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'solved' && isCompleted) ||
        (statusFilter === 'unsolved' && !isCompleted);

      return matchesSearch && matchesDiff && matchesStatus;
    });
  }, [cases, searchQuery, difficultyFilter, statusFilter, profile.casesCompleted]);

  const handleDifficultyChange = (val: 'all' | 'Easy' | 'Medium' | 'Hard') => {
    soundManager.playClick();
    setDifficultyFilter(val);
  };

  const handleStatusChange = (val: 'all' | 'unsolved' | 'solved') => {
    soundManager.playClick();
    setStatusFilter(val);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Criminal Investigation Bureau</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            Mystery Case Library
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mt-1">
            Browse through active and cold case files. Select an inquiry to begin your forensic investigation.
          </p>
        </div>

        {/* Counter */}
        <div className="text-xs font-mono tabular-nums text-[#A5A7AD]">
          Showing {filteredCases.length} of {cases.length} cases
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A5A7AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case title, location, or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 rounded-xl text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 placeholder-[#A5A7AD]/70 focus:outline-none focus:border-[#C9A86A]"
          />
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty segmented button tabs */}
          <div className="flex items-center p-1 bg-[#111318] dark:bg-[#111318] bg-slate-100 rounded-lg border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
            {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-[#C9A86A] text-[#111318] font-bold shadow-sm'
                    : 'text-[#A5A7AD] hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
                }`}
              >
                {diff === 'all' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>

          {/* Status segmented button tabs */}
          <div className="flex items-center p-1 bg-[#111318] dark:bg-[#111318] bg-slate-100 rounded-lg border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
            {(['all', 'unsolved', 'solved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#C9A86A] text-[#111318] font-bold shadow-sm'
                    : 'text-[#A5A7AD] hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Cases */}
      {filteredCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#2A2E39] bg-[#161920]/40">
          <BookOpen className="w-10 h-10 text-[#A5A7AD] mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
            No Mystery Dossiers Found
          </h3>
          <p className="text-xs text-[#A5A7AD] mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset the difficulty and status filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCases.map((c) => {
            const prog = allProgress[c.id];
            const record = profile.history.find((h) => h.caseId === c.id);

            return (
              <CaseCard
                key={c.id}
                mystery={c}
                progress={prog}
                record={record}
                isActive={activeCaseId === c.id}
                onSelect={onSelectCase}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

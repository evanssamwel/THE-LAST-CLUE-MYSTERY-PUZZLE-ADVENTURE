/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MysteryCase, CaseProgress, Clue } from '../types';
import { ClueCard } from '../components/ClueCard';
import { Layers, Search, Filter, Eye, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EvidenceProps {
  cases: MysteryCase[];
  allProgress: Record<string, CaseProgress>;
  onOpenCase: (caseId: string) => void;
}

export const Evidence: React.FC<EvidenceProps> = ({
  cases,
  allProgress,
  onOpenCase,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingClue, setInspectingClue] = useState<{ clue: Clue; caseName: string } | null>(null);

  // Flatten all clues from all cases with discovery state
  const allCluesWithMeta = useMemo(() => {
    return cases.flatMap((c) => {
      const prog = allProgress[c.id];
      const discoveredIds = prog?.discoveredClueIds || [];

      return c.clues.map((clue) => ({
        ...clue,
        caseId: c.id,
        caseTitle: c.title,
        isDiscovered: discoveredIds.includes(clue.id),
      }));
    });
  }, [cases, allProgress]);

  const filteredClues = useMemo(() => {
    return allCluesWithMeta.filter((c) => {
      // Case filter
      if (selectedCaseId !== 'all' && c.caseId !== selectedCaseId) return false;

      // Category filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;

      // Search
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.details.toLowerCase().includes(q) ||
        c.caseTitle.toLowerCase().includes(q)
      );
    });
  }, [allCluesWithMeta, selectedCaseId, selectedCategory, searchQuery]);

  const totalDiscovered = allCluesWithMeta.filter((c) => c.isDiscovered).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest mb-1.5">
            <Layers className="w-4 h-4" />
            <span>Forensic Repository</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            Master Evidence Board
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mt-1">
            Central repository of all physical, forensic, document, and testimonial findings collected during investigations.
          </p>
        </div>

        <div className="text-xs font-mono tabular-nums text-[#A5A7AD]">
          Discovered: <span className="text-[#C9A86A] font-bold">{totalDiscovered}</span> / {allCluesWithMeta.length} total clues
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A5A7AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all evidence items, case clues, or physical findings..."
            className="w-full pl-10 pr-4 py-2 bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 rounded-xl text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 placeholder-[#A5A7AD]/70 focus:outline-none focus:border-[#C9A86A]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category tabs */}
          <div className="flex items-center p-1 bg-[#111318] dark:bg-[#111318] bg-slate-100 rounded-lg border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
            {(['all', 'Physical', 'Forensic', 'Document', 'Testimony'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#C9A86A] text-[#111318] font-bold shadow-sm'
                    : 'text-[#A5A7AD] hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          {/* Case dropdown */}
          <select
            value={selectedCaseId}
            onChange={(e) => {
              soundManager.playClick();
              setSelectedCaseId(e.target.value);
            }}
            aria-label="Filter evidence by case"
            className="px-3 py-2 bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 rounded-lg text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 focus:outline-none focus:border-[#C9A86A]"
          >
            <option value="all">All 8 Mystery Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clues Grid */}
      {filteredClues.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#2A2E39] bg-[#161920]/40">
          <Layers className="w-10 h-10 text-[#A5A7AD] mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-bold text-[#F5F3EE]">No Evidence Matching Filters</h3>
          <p className="text-xs text-[#A5A7AD] mt-1 max-w-sm mx-auto">
            Try resetting your search query or selecting a different case or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClues.map((clueItem) => (
            <div key={`${clueItem.caseId}-${clueItem.id}`} className="flex flex-col">
              <span className="text-[11px] font-medium text-[#C9A86A] truncate mb-1">
                From: {clueItem.caseTitle}
              </span>
              <ClueCard
                clue={clueItem}
                isDiscovered={clueItem.isDiscovered}
                onInspect={() => {
                  soundManager.playClick();
                  setInspectingClue({ clue: clueItem, caseName: clueItem.caseTitle });
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {inspectingClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A]">
                <Eye className="w-4 h-4" />
                <span>Forensic Repository Item · {inspectingClue.caseName}</span>
              </div>
              <button
                onClick={() => setInspectingClue(null)}
                className="p-1 text-[#A5A7AD] hover:text-[#F5F3EE] rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#A5A7AD] mb-1">
                <span>{inspectingClue.clue.category} Evidence</span>
                <span aria-hidden="true">·</span>
                <span>Found at: {inspectingClue.clue.locationFound}</span>
              </div>
              <h3 className="font-display text-lg font-bold">{inspectingClue.clue.title}</h3>
            </div>

            <div className="p-4 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] text-xs leading-relaxed text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700">
              <p className="font-medium text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 mb-2">
                Forensic Finding:
              </p>
              <p className="mb-3">{inspectingClue.clue.description}</p>
              <p className="font-medium text-[#C9A86A] mb-1">Deductive Weight:</p>
              <p>{inspectingClue.clue.details}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setInspectingClue(null);
                  onOpenCase(inspectingClue.clue.linkedSuspectId || '');
                }}
                className="text-xs text-[#C9A86A] hover:underline cursor-pointer"
              >
                Open Case Investigation
              </button>

              <button
                onClick={() => setInspectingClue(null)}
                className="px-4 py-1.5 text-xs font-semibold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

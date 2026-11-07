/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MysteryCase, CaseProgress, InvestigationRecord } from '../types';
import { Clock, MapPin, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CaseCardProps {
  mystery: MysteryCase;
  progress?: CaseProgress;
  record?: InvestigationRecord;
  isActive: boolean;
  onSelect: (caseId: string) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  mystery,
  progress,
  record,
  isActive,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);

  const isCompleted = !!record || !!progress?.submittedVerdict;
  const cluesDiscoveredCount = progress?.discoveredClueIds.length || 0;
  const totalClues = mystery.clues.length;
  const isStarted = !isCompleted && (cluesDiscoveredCount > 0 || (progress?.solvedPuzzleIds.length || 0) > 0);

  const handleCardClick = () => {
    soundManager.playClick();
    onSelect(mystery.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-[#1C2028] dark:bg-[#1C2028] bg-white border-[#C9A86A] shadow-md ring-1 ring-[#C9A86A]/40'
          : 'bg-[#161920] dark:bg-[#161920] bg-white border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 hover:border-[#C9A86A]/60 hover:shadow-lg'
      }`}
    >
      <div>
        {/* Cover Image Container with Zero-Broken-Image Policy */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111318]">
          {!imageError && mystery.coverImage ? (
            <img
              src={mystery.coverImage}
              alt={mystery.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1C2028] to-[#111318] p-6 text-center">
              <span className="font-display text-lg font-bold text-[#C9A86A] tracking-wider mb-1">
                {mystery.title}
              </span>
              <span className="text-xs text-[#A5A7AD]">Case Dossier #{mystery.id.slice(0, 8)}</span>
            </div>
          )}

          {/* Measured Scrim for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161920] dark:from-[#161920] from-white/90 via-transparent to-black/30" />

          {/* Active Case indicator */}
          {isActive && (
            <div className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold text-[#111318] bg-[#C9A86A] rounded shadow-sm">
              Current Active Case
            </div>
          )}

          {/* Status stamp */}
          {isCompleted && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved · {record?.verdict || progress?.submittedVerdict?.verdict || 'Closed'}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-500 mb-2.5">
            <span
              className={
                mystery.difficulty === 'Easy'
                  ? 'text-emerald-400 font-semibold'
                  : mystery.difficulty === 'Medium'
                  ? 'text-amber-400 font-semibold'
                  : 'text-rose-400 font-semibold'
              }
            >
              {mystery.difficulty}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#A5A7AD]" />
              <span>{mystery.estimatedTime}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[130px]">{mystery.location.split(',')[0]}</span>
          </div>

          {/* Case Title */}
          <h3 className="font-display text-lg font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 group-hover:text-[#C9A86A] transition-colors line-clamp-1 mb-1">
            {mystery.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-[#C9A86A] font-medium mb-2.5 line-clamp-1">
            {mystery.subtitle}
          </p>

          {/* Synopsis */}
          <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {mystery.synopsis}
          </p>

          {/* Clues Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-500">
              <span>Evidence Discovered</span>
              <span className="font-mono tabular-nums">
                {cluesDiscoveredCount} / {totalClues} clues
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A86A] transition-all duration-300"
                style={{ width: `${Math.min(100, (cluesDiscoveredCount / totalClues) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-[#2A2E39]/50 dark:border-[#2A2E39]/50 border-slate-100 flex items-center justify-between">
        <div className="text-xs text-[#A5A7AD]">
          {record ? (
            <span className="text-emerald-400 font-semibold font-mono tabular-nums">
              Score: {record.score} pts
            </span>
          ) : (
            <span className="font-mono tabular-nums text-slate-400 dark:text-[#A5A7AD]">
              Base: {mystery.basePoints} pts
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
            isActive
              ? 'text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E]'
              : isCompleted
              ? 'text-[#C9A86A] border border-[#C9A86A]/40 hover:bg-[#C9A86A]/10'
              : isStarted
              ? 'text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E]'
              : 'text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 hover:bg-[#C9A86A] hover:text-[#111318]'
          }`}
        >
          <span>{isCompleted ? 'Review Dossier' : isStarted ? 'Continue' : 'Investigate'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

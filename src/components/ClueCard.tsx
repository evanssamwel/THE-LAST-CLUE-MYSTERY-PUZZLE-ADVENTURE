/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clue } from '../types';
import { FileText, Search, Sparkles, User, Check, Eye, Lock, Copy } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ClueCardProps {
  clue: Clue;
  isDiscovered: boolean;
  onInspect?: (clue: Clue) => void;
  onAddNote?: (noteText: string) => void;
}

export const ClueCard: React.FC<ClueCardProps> = ({
  clue,
  isDiscovered,
  onInspect,
  onAddNote,
}) => {
  const [copied, setCopied] = useState(false);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Forensic':
        return 'text-cyan-400';
      case 'Physical':
        return 'text-amber-400';
      case 'Document':
        return 'text-emerald-400';
      case 'Testimony':
        return 'text-purple-400';
      default:
        return 'text-[#C9A86A]';
    }
  };

  const handleCopyNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    if (onAddNote) {
      onAddNote(`[Evidence: ${clue.title}] ${clue.description} - ${clue.details}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isDiscovered) {
    return (
      <div className="relative p-4 rounded-xl border border-dashed border-[#2A2E39] dark:border-[#2A2E39] border-slate-300 bg-[#161920]/40 dark:bg-[#161920]/40 bg-slate-50 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#1C2028] dark:bg-[#1C2028] bg-slate-200 flex items-center justify-center text-[#A5A7AD] shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-500">
            Undiscovered Evidence
          </div>
          <div className="text-xs text-[#A5A7AD]/70 dark:text-[#A5A7AD]/70 text-slate-400">
            Investigate the crime scene or solve encrypted locks to locate.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onInspect?.(clue)}
      className="group relative p-4 rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-white hover:border-[#C9A86A]/70 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Category & Status header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className={getCategoryColor(clue.category)}>{clue.category} Evidence</span>
            <span className="text-[#A5A7AD]" aria-hidden="true">·</span>
            <span className="text-xs text-[#A5A7AD] truncate max-w-[140px]">{clue.locationFound}</span>
          </div>

          {clue.isKeyEvidence && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#C9A86A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-1.5 py-0.5 rounded">
              Crucial
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 group-hover:text-[#C9A86A] transition-colors mb-1.5">
          {clue.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 leading-relaxed mb-3">
          {clue.description}
        </p>
      </div>

      {/* Action Strip */}
      <div className="pt-2 border-t border-[#2A2E39]/60 dark:border-[#2A2E39]/60 border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#A5A7AD] flex items-center gap-1 group-hover:text-[#F5F3EE] transition-colors">
          <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
          <span>Examine dossier</span>
        </span>

        {onAddNote && (
          <button
            onClick={handleCopyNote}
            className="flex items-center gap-1 text-[11px] text-[#A5A7AD] hover:text-[#C9A86A] transition-colors py-0.5 px-1.5 rounded hover:bg-[#111318]/40"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Added to Notes</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Note</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

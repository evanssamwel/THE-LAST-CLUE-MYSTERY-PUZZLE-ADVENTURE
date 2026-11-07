/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Suspect } from '../types';
import { User, AlertTriangle, Shield, MessageSquare, Copy, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SuspectsDossierProps {
  suspects: Suspect[];
  primarySuspectId?: string;
  onSelectPrimarySuspect?: (suspectId: string) => void;
  onAddNote?: (noteText: string) => void;
}

export const SuspectsDossier: React.FC<SuspectsDossierProps> = ({
  suspects,
  primarySuspectId,
  onSelectPrimarySuspect,
  onAddNote,
}) => {
  const [activeSuspectId, setActiveSuspectId] = useState<string>(suspects[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedSuspect = suspects.find((s) => s.id === activeSuspectId) || suspects[0];

  const handleCopy = (s: Suspect) => {
    soundManager.playClick();
    if (onAddNote) {
      onAddNote(`[Suspect: ${s.name}] Role: ${s.role}. Motive: ${s.motive}. Alibi: ${s.alibi}. Statement: "${s.statement}"`);
      setCopiedId(s.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Suspect Selector Pill-free list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {suspects.map((s) => {
          const isSelected = s.id === activeSuspectId;
          const isPrimary = s.id === primarySuspectId;

          return (
            <button
              key={s.id}
              onClick={() => {
                soundManager.playClick();
                setActiveSuspectId(s.id);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-[#C9A86A] bg-[#1C2028] dark:bg-[#1C2028] bg-white ring-1 ring-[#C9A86A] shadow-md'
                  : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-slate-50 hover:border-[#A5A7AD]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                    isSelected
                      ? 'bg-[#C9A86A] text-[#111318]'
                      : 'bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800'
                  }`}
                >
                  {s.avatar}
                </div>

                <div className="min-w-0">
                  <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 truncate">
                    {s.name}
                  </h4>
                  <p className="text-xs text-[#A5A7AD] truncate">{s.role}</p>
                </div>
              </div>

              {isPrimary && (
                <div className="absolute top-2 right-2 text-[10px] font-bold text-[#C9A86A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-1.5 py-0.5 rounded">
                  Target Suspect
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Suspect Comprehensive Profile */}
      {selectedSuspect && (
        <div className="p-6 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-white shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#C9A86A] text-[#111318] flex items-center justify-center font-display text-xl font-bold shadow-md shrink-0">
                {selectedSuspect.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A5A7AD] mb-0.5">
                  <span>Age {selectedSuspect.age}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedSuspect.role}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                  {selectedSuspect.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {onAddNote && (
                <button
                  onClick={() => handleCopy(selectedSuspect)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A5A7AD] hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-300 rounded-lg hover:bg-[#111318]/50 transition-colors cursor-pointer"
                >
                  {copiedId === selectedSuspect.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Notes</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy to Notes</span>
                    </>
                  )}
                </button>
              )}

              {onSelectPrimarySuspect && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPrimarySuspect(selectedSuspect.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    primarySuspectId === selectedSuspect.id
                      ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-400/40'
                      : 'bg-[#C9A86A] text-[#111318] hover:bg-[#D8BA7E]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {primarySuspectId === selectedSuspect.id
                      ? 'Marked as Primary Suspect'
                      : 'Designate as Primary Suspect'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700 leading-relaxed">
            {selectedSuspect.description}
          </p>

          {/* Structured Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Motive */}
            <div className="p-4 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Suspected Motive</span>
              </div>
              <p className="text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 leading-relaxed">
                {selectedSuspect.motive}
              </p>
            </div>

            {/* Alibi */}
            <div className="p-4 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1.5">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Claimed Alibi</span>
              </div>
              <p className="text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 leading-relaxed">
                {selectedSuspect.alibi}
              </p>
            </div>
          </div>

          {/* Statement & Forensic Discrepancy */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#161920] dark:bg-[#161920] bg-slate-100 border-l-2 border-[#C9A86A]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C9A86A] mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Official Interrogation Statement</span>
              </div>
              <p className="text-xs italic text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 leading-relaxed">
                {selectedSuspect.statement}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#161920] dark:bg-[#161920] bg-slate-100 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
              <span className="text-[11px] font-semibold text-[#A5A7AD] uppercase tracking-wider block mb-1">
                Investigator Observation / Discrepancy:
              </span>
              <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700 leading-relaxed">
                {selectedSuspect.suspiciousDetails}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

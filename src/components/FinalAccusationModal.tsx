/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MysteryCase, CaseProgress } from '../types';
import { X, ShieldAlert, CheckCircle, ArrowRight, User, AlertCircle, FileText, Target } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FinalAccusationModalProps {
  mystery: MysteryCase;
  progress: CaseProgress;
  onSubmitAccusation: (suspectId: string, motive: string, method: string, evidenceId: string) => void;
  onClose: () => void;
}

export const FinalAccusationModal: React.FC<FinalAccusationModalProps> = ({
  mystery,
  progress,
  onSubmitAccusation,
  onClose,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');
  const [selectedMotive, setSelectedMotive] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available evidence is only the discovered clues
  const discoveredClues = mystery.clues.filter((c) =>
    progress.discoveredClueIds.includes(c.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspectId || !selectedMotive || !selectedMethod || !selectedEvidenceId) {
      setErrorMsg('You must complete all four investigative deductions before submitting your verdict.');
      return;
    }

    soundManager.playAccusation();
    onSubmitAccusation(selectedSuspectId, selectedMotive, selectedMethod, selectedEvidenceId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#C9A86A]/40 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318] dark:bg-[#111318] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                Final Accusation & Verdict
              </h3>
              <p className="text-xs text-[#A5A7AD]">
                Submit your official forensic indictment for {mystery.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-[#A5A7AD] hover:text-[#F5F3EE] rounded-lg hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Part 1: Select Prime Suspect */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#C9A86A] text-[#111318] flex items-center justify-center font-mono font-bold text-[10px]">
                1
              </span>
              <span>Identify the Culprit</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {mystery.suspects.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedSuspectId(s.id);
                    setErrorMsg(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSuspectId === s.id
                      ? 'border-[#C9A86A] bg-[#C9A86A]/15 text-[#C9A86A] ring-1 ring-[#C9A86A]'
                      : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-slate-50 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:border-[#A5A7AD]'
                  }`}
                >
                  <div className="font-display text-xs font-bold truncate">{s.name}</div>
                  <div className="text-[11px] text-[#A5A7AD] truncate">{s.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Part 2: Select Motive */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#C9A86A] text-[#111318] flex items-center justify-center font-mono font-bold text-[10px]">
                2
              </span>
              <span>Primary Motive</span>
            </label>
            <div className="space-y-2">
              {mystery.solution.motiveOptions.map((motive, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedMotive(motive);
                    setErrorMsg(null);
                  }}
                  className={`w-full p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedMotive === motive
                      ? 'border-[#C9A86A] bg-[#C9A86A]/15 text-[#C9A86A] ring-1 ring-[#C9A86A]'
                      : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-slate-50 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:border-[#A5A7AD]'
                  }`}
                >
                  {motive}
                </button>
              ))}
            </div>
          </div>

          {/* Part 3: Select Method / Modus Operandi */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#C9A86A] text-[#111318] flex items-center justify-center font-mono font-bold text-[10px]">
                3
              </span>
              <span>Modus Operandi / Execution Method</span>
            </label>
            <div className="space-y-2">
              {mystery.solution.methodOptions.map((method, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedMethod(method);
                    setErrorMsg(null);
                  }}
                  className={`w-full p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedMethod === method
                      ? 'border-[#C9A86A] bg-[#C9A86A]/15 text-[#C9A86A] ring-1 ring-[#C9A86A]'
                      : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-slate-50 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:border-[#A5A7AD]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Part 4: Select Key Supporting Evidence */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#C9A86A] text-[#111318] flex items-center justify-center font-mono font-bold text-[10px]">
                4
              </span>
              <span>Key Supporting Evidence (Smoking Gun)</span>
            </label>
            {discoveredClues.length === 0 ? (
              <div className="p-3 rounded-xl border border-dashed border-[#2A2E39] text-xs text-[#A5A7AD]">
                You have not discovered any evidence yet! Inspect the crime scene first.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {discoveredClues.map((clue) => (
                  <button
                    type="button"
                    key={clue.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedEvidenceId(clue.id);
                      setErrorMsg(null);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedEvidenceId === clue.id
                        ? 'border-[#C9A86A] bg-[#C9A86A]/15 text-[#C9A86A] ring-1 ring-[#C9A86A]'
                        : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-slate-50 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:border-[#A5A7AD]'
                    }`}
                  >
                    <div className="font-semibold text-xs truncate">{clue.title}</div>
                    <div className="text-[11px] text-[#A5A7AD] truncate">{clue.category} · {clue.locationFound}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accusation Warning */}
          <p className="text-[11px] text-[#A5A7AD] leading-relaxed italic text-center">
            Once submitted, the magistrate will review your indictment. Points will be awarded for precision and deducted for wrongful accusations.
          </p>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#C9A86A] to-[#D8BA7E] hover:from-[#D8BA7E] hover:to-[#E5CB95] text-[#111318] font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Deliver Verdict & Arrest Culprit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

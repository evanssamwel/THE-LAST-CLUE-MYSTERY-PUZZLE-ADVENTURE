/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyChallengeData } from '../types';
import { X, Calendar, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DailyChallengeModalProps {
  challenge: DailyChallengeData;
  isCompleted: boolean;
  onSolve: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  challenge,
  isCompleted,
  onSolve,
  onClose,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isCompleted || justSolved) return;

    const normalizedInput = inputVal.trim().toUpperCase();
    const normalizedSolution = challenge.puzzle.solution.trim().toUpperCase();

    if (normalizedInput === normalizedSolution) {
      soundManager.playVictory();
      setJustSolved(true);
      setErrorMsg(null);
      onSolve();
    } else {
      soundManager.playPuzzleError();
      setErrorMsg('Incorrect answer. Consider checking the daily investigator hint.');
    }
  };

  const isFinished = isCompleted || justSolved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#C9A86A]/40 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318] dark:bg-[#111318] bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/20 text-[#C9A86A] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#C9A86A] font-semibold">
                <span>Daily Detective Dispatch</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{challenge.dateKey}</span>
              </div>
              <h3 className="font-display text-base font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                {challenge.title}
              </h3>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mystery Teaser */}
          <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700 leading-relaxed">
            <span className="font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 block mb-1">
              Field Dispatch Report:
            </span>
            <p>{challenge.mysterySnippet}</p>
          </div>

          {/* Question */}
          <div className="p-4 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#C9A86A]/30">
            <span className="text-[11px] font-semibold text-[#C9A86A] uppercase tracking-wider block mb-1">
              Today's Puzzle Objective
            </span>
            <p className="text-sm font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
              {challenge.puzzle.question}
            </p>
          </div>

          {/* Solved View */}
          {isFinished ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Daily Dispatch Resolved! (+{challenge.bonusPoints} pts)</span>
              </div>
              <p className="text-xs text-emerald-300/80">
                Daily streak updated! Your deductive sharpness continues to grow. Come back tomorrow for a new dispatch.
              </p>
            </div>
          ) : (
            /* Input / Options */
            <form onSubmit={handleSubmit} className="space-y-4">
              {challenge.puzzle.options ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {challenge.puzzle.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setInputVal(opt);
                        setErrorMsg(null);
                      }}
                      className={`p-3 text-xs font-semibold rounded-lg border text-left transition-all cursor-pointer ${
                        inputVal === opt
                          ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-[#C9A86A]'
                          : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:border-[#A5A7AD]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A5A7AD]">Enter Deduction / Code:</label>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="Enter answer..."
                    className="w-full px-4 py-2.5 bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-300 rounded-lg text-sm text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 focus:outline-none focus:border-[#C9A86A] font-mono"
                    autoFocus
                  />
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-full py-2.5 px-4 bg-[#C9A86A] hover:bg-[#D8BA7E] disabled:opacity-40 text-[#111318] font-bold text-sm rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Daily Solution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Hint */}
          {!isFinished && (
            <div className="pt-2 border-t border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
              {showHint ? (
                <div className="p-3 rounded-lg bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#2A2E39] text-xs text-[#A5A7AD]">
                  <span className="font-semibold text-[#C9A86A] block mb-0.5">Investigator Hint:</span>
                  <p>{challenge.puzzle.hint}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playHint();
                    setShowHint(true);
                  }}
                  className="text-xs text-[#C9A86A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Reveal Daily Clue Hint</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318]/50 dark:bg-[#111318]/50 bg-slate-50 flex items-center justify-between text-xs text-[#A5A7AD]">
          <span>Bonus: +{challenge.bonusPoints} points towards Detective Rank</span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-medium text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-700 hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Puzzle } from '../types';
import { X, Key, HelpCircle, CheckCircle, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PuzzleModalProps {
  puzzle: Puzzle;
  isSolved: boolean;
  usedHintLevel: number; // 0, 1, 2, or 3
  onSolve: (puzzleId: string) => void;
  onRequestHint: (puzzleId: string, level: number) => void;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  puzzle,
  isSolved,
  usedHintLevel,
  onSolve,
  onRequestHint,
  onClose,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [justSolved, setJustSolved] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSolved) return;

    const normalizedInput = answerInput.trim().toUpperCase();
    const normalizedSolution = puzzle.solution.trim().toUpperCase();

    if (normalizedInput === normalizedSolution) {
      soundManager.playPuzzleSolved();
      setErrorMsg(null);
      setJustSolved(true);
      onSolve(puzzle.id);
    } else {
      soundManager.playPuzzleError();
      setErrorMsg('Incorrect answer. Review the clues or request an investigative hint.');
    }
  };

  const handleSelectOption = (opt: string) => {
    soundManager.playClick();
    setAnswerInput(opt);
    setErrorMsg(null);
  };

  const handleRequestNextHint = () => {
    soundManager.playHint();
    const nextLevel = Math.min(3, usedHintLevel + 1);
    onRequestHint(puzzle.id, nextLevel);
  };

  const isActuallySolved = isSolved || justSolved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A86A]/20 text-[#C9A86A] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                {puzzle.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#A5A7AD]">
                <span className="capitalize">{puzzle.type} Challenge</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#C9A86A] font-mono tabular-nums">+{puzzle.pointsAwarded} pts</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-[#A5A7AD] hover:text-[#F5F3EE] rounded-lg hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 leading-relaxed">
            <p className="font-medium text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 mb-1">
              Investigator Instructions:
            </p>
            <p>{puzzle.instructions}</p>
          </div>

          {/* Question Banner */}
          <div className="p-4 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#C9A86A]/30">
            <span className="text-[11px] uppercase tracking-wider text-[#C9A86A] font-semibold block mb-1">
              Cipher Question
            </span>
            <p className="text-sm font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
              {puzzle.question}
            </p>
          </div>

          {/* Solved state view */}
          {isActuallySolved ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-emerald-300">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Cipher Solved! Correct answer: {puzzle.solution}</span>
              </div>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                {puzzle.explanation}
              </p>
            </div>
          ) : (
            /* Interactive Answer Input */
            <form onSubmit={handleSubmit} className="space-y-4">
              {puzzle.options && puzzle.options.length > 0 ? (
                /* Multiple Choice selection */
                <div className="grid grid-cols-2 gap-2.5">
                  {puzzle.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3 text-xs font-semibold rounded-lg border text-left transition-all cursor-pointer ${
                        answerInput === opt
                          ? 'border-[#C9A86A] bg-[#C9A86A]/20 text-[#C9A86A]'
                          : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:border-[#A5A7AD]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                /* Freeform text / number input */
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A5A7AD]">Enter Answer / Decrypted Code:</label>
                  <input
                    type="text"
                    value={answerInput}
                    onChange={(e) => {
                      setAnswerInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder={puzzle.placeholder || 'Type your solution...'}
                    className="w-full px-4 py-2.5 bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-300 rounded-lg text-sm text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 focus:outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] font-mono"
                    autoFocus
                  />
                </div>
              )}

              {/* Error feedback */}
              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!answerInput.trim()}
                className="w-full py-2.5 px-4 bg-[#C9A86A] hover:bg-[#D8BA7E] disabled:opacity-40 disabled:cursor-not-allowed text-[#111318] font-bold text-sm rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Solution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3-Tier Hint System Section */}
          <div className="pt-3 border-t border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A5A7AD]">
                <Lightbulb className="w-4 h-4 text-[#C9A86A]" />
                <span>Investigator Hints</span>
              </div>

              {!isActuallySolved && usedHintLevel < 3 && (
                <button
                  type="button"
                  onClick={handleRequestNextHint}
                  className="text-xs text-[#C9A86A] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Request Hint {usedHintLevel + 1}</span>
                  <span className="text-[10px] text-[#A5A7AD]">
                    ({usedHintLevel === 0 ? '-20 pts' : usedHintLevel === 1 ? '-40 pts' : '-75 pts'})
                  </span>
                </button>
              )}
            </div>

            {/* Revealed Hints List */}
            {usedHintLevel === 0 ? (
              <p className="text-[11px] text-[#A5A7AD]/80 italic">
                No hints used yet. Solve independently for maximum investigation score.
              </p>
            ) : (
              <div className="space-y-2">
                {puzzle.hints.slice(0, usedHintLevel).map((hintText, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#2A2E39] text-xs text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800"
                  >
                    <span className="text-[10px] uppercase font-bold text-[#C9A86A] block mb-0.5">
                      Hint Tier {idx + 1}
                    </span>
                    <p>{hintText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318]/50 dark:bg-[#111318]/50 bg-slate-50 flex items-center justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-medium text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-700 hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {isActuallySolved ? 'Close Dossier' : 'Return to Scene'}
          </button>
        </div>
      </div>
    </div>
  );
};

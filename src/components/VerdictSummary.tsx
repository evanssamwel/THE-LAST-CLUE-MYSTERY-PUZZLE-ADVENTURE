/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MysteryCase, CaseProgress } from '../types';
import { ScoreCalculationResult } from '../utils/scoring';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw, Award, Clock, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VerdictSummaryProps {
  mystery: MysteryCase;
  progress: CaseProgress;
  scoreResult: ScoreCalculationResult;
  onReplay: () => void;
  onNextCase?: () => void;
  onReturnToLibrary: () => void;
}

export const VerdictSummary: React.FC<VerdictSummaryProps> = ({
  mystery,
  progress,
  scoreResult,
  onReplay,
  onNextCase,
  onReturnToLibrary,
}) => {
  const culprit = mystery.suspects.find((s) => s.id === mystery.solution.culpritId);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left ${
          scoreResult.verdict === 'Conviction'
            ? 'border-emerald-600 bg-emerald-950/40 text-emerald-200'
            : scoreResult.verdict === 'Partial'
            ? 'border-amber-600 bg-amber-950/40 text-amber-200'
            : 'border-rose-600 bg-rose-950/40 text-rose-200'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
            scoreResult.verdict === 'Conviction'
              ? 'bg-emerald-500/20 text-emerald-400'
              : scoreResult.verdict === 'Partial'
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-rose-500/20 text-rose-400'
          }`}
        >
          {scoreResult.verdict === 'Conviction' ? (
            <CheckCircle2 className="w-9 h-9" />
          ) : scoreResult.verdict === 'Partial' ? (
            <AlertTriangle className="w-9 h-9" />
          ) : (
            <XCircle className="w-9 h-9" />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase tracking-widest font-semibold">
            <span>Case Resolution Verdict</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{scoreResult.accuracy}% Accuracy</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            {scoreResult.verdict === 'Conviction'
              ? 'Criminal Conviction Secured'
              : scoreResult.verdict === 'Partial'
              ? 'Incomplete Indictment'
              : 'Wrongful Accusation'}
          </h2>

          <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-xl">
            {scoreResult.verdict === 'Conviction'
              ? `Masterful investigation! You successfully deduced that ${culprit?.name} was the true perpetrator with unassailable forensic evidence.`
              : scoreResult.verdict === 'Partial'
              ? 'Your deduction had merit, but certain crucial aspects of the motive, method, or supporting evidence fell short of absolute proof.'
              : 'The evidence presented did not hold up before the magistrate. The true perpetrator slipped away under your scrutiny.'}
          </p>
        </div>
      </div>

      {/* Score Breakdown Ledger */}
      <div className="p-6 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#1C2028] dark:bg-[#1C2028] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C9A86A]" />
            <h3 className="font-display text-base font-bold">Investigation Score Ledger</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#A5A7AD] block">Total Points Awarded</span>
            <span className="font-mono text-xl font-bold text-[#C9A86A] tabular-nums">
              +{scoreResult.totalScore} pts
            </span>
          </div>
        </div>

        {/* Tabular Numerals Score Matrix */}
        <div className="py-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-[#A5A7AD]">
            <span>Base Case Bounty</span>
            <span className="font-mono tabular-nums text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
              +{scoreResult.basePoints} pts
            </span>
          </div>
          <div className="flex items-center justify-between text-[#A5A7AD]">
            <span>Evidence Discovered ({progress.discoveredClueIds.length} clues)</span>
            <span className="font-mono tabular-nums text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
              +{scoreResult.cluesScore} pts
            </span>
          </div>
          <div className="flex items-center justify-between text-[#A5A7AD]">
            <span>Ciphers & Puzzles Solved ({progress.solvedPuzzleIds.length})</span>
            <span className="font-mono tabular-nums text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
              +{scoreResult.puzzlesScore} pts
            </span>
          </div>
          <div className="flex items-center justify-between text-[#A5A7AD]">
            <span>Verdict Accuracy Bonus ({scoreResult.verdict})</span>
            <span className="font-mono tabular-nums text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
              +{scoreResult.verdictScore} pts
            </span>
          </div>

          {scoreResult.timeBonus > 0 && (
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Rapid Deduction Speed Bonus</span>
              </span>
              <span className="font-mono tabular-nums">+{scoreResult.timeBonus} pts</span>
            </div>
          )}

          {scoreResult.thoroughBonus > 0 && (
            <div className="flex items-center justify-between text-emerald-400">
              <span>All Crime Scene Clues Discovered</span>
              <span className="font-mono tabular-nums">+{scoreResult.thoroughBonus} pts</span>
            </div>
          )}

          {scoreResult.hintPenalty > 0 && (
            <div className="flex items-center justify-between text-rose-400">
              <span>Investigative Hint Deductions</span>
              <span className="font-mono tabular-nums">-{scoreResult.hintPenalty} pts</span>
            </div>
          )}
        </div>
      </div>

      {/* Culprit Confession & Detective Breakdown */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-slate-50 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-md space-y-5">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#C9A86A] font-semibold block mb-1">
            Forensic Reconstruction & Full Confession
          </span>
          <h3 className="font-display text-xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            How The Crime Was Committed: {culprit?.name}
          </h3>
        </div>

        <div className="p-5 rounded-xl bg-[#111318] dark:bg-[#111318] bg-white border border-[#2A2E39] text-xs leading-relaxed text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700 whitespace-pre-line">
          {mystery.solution.fullConfession}
        </div>

        <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 border border-[#2A2E39] text-xs">
          <span className="font-semibold text-[#C9A86A] block mb-1">Deduction Synthesis:</span>
          <p className="text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 leading-relaxed">
            {mystery.solution.deductionSummary}
          </p>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onReplay();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#A5A7AD] hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-300 rounded-xl hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Investigation</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onReturnToLibrary();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 hover:bg-[#3A3F4D] rounded-xl transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Case Library</span>
          </button>

          {onNextCase && (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextCase();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Next Mystery Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

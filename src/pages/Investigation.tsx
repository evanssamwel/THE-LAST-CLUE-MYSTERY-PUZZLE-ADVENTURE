/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MysteryCase, CaseProgress, Clue, Puzzle, PlayerProfile, InvestigationRecord } from '../types';
import { CrimeSceneView } from '../components/CrimeSceneView';
import { SuspectsDossier } from '../components/SuspectsDossier';
import { ClueCard } from '../components/ClueCard';
import { PuzzleModal } from '../components/PuzzleModal';
import { FinalAccusationModal } from '../components/FinalAccusationModal';
import { VerdictSummary } from '../components/VerdictSummary';
import { InvestigationNotes } from '../components/InvestigationNotes';
import { calculateCaseScore, evaluateAchievements, ScoreCalculationResult } from '../utils/scoring';
import { soundManager } from '../utils/audio';
import {
  FileText,
  Search,
  Users,
  Key,
  Layers,
  Edit3,
  Clock,
  ShieldAlert,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  X,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface InvestigationProps {
  mystery: MysteryCase;
  progress: CaseProgress;
  profile: PlayerProfile;
  showTimer: boolean;
  onUpdateProgress: (updated: CaseProgress) => void;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onBackToLibrary: () => void;
  onNextCase?: () => void;
}

export const Investigation: React.FC<InvestigationProps> = ({
  mystery,
  progress,
  profile,
  showTimer,
  onUpdateProgress,
  onUpdateProfile,
  onBackToLibrary,
  onNextCase,
}) => {
  type SubTab = 'story' | 'scene' | 'suspects' | 'puzzles' | 'evidence' | 'notes';
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('scene');

  // Modals state
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [inspectingClue, setInspectingClue] = useState<Clue | null>(null);
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [primarySuspectId, setPrimarySuspectId] = useState<string>('');

  // Timer interval
  useEffect(() => {
    if (progress.submittedVerdict) return;

    const interval = setInterval(() => {
      onUpdateProgress({
        ...progress,
        elapsedSeconds: progress.elapsedSeconds + 1,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progress, onUpdateProgress]);

  // Formatted timer string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Clue discovery handler
  const handleDiscoverClue = (clueId: string) => {
    if (!progress.discoveredClueIds.includes(clueId)) {
      onUpdateProgress({
        ...progress,
        discoveredClueIds: [...progress.discoveredClueIds, clueId],
      });
    }
  };

  // Puzzle solve handler
  const handleSolvePuzzle = (puzzleId: string) => {
    const puzzle = mystery.puzzles.find((p) => p.id === puzzleId);
    const updatedSolved = progress.solvedPuzzleIds.includes(puzzleId)
      ? progress.solvedPuzzleIds
      : [...progress.solvedPuzzleIds, puzzleId];

    let updatedClues = [...progress.discoveredClueIds];
    if (puzzle && puzzle.unlocksClueId && !updatedClues.includes(puzzle.unlocksClueId)) {
      updatedClues.push(puzzle.unlocksClueId);
    }

    onUpdateProgress({
      ...progress,
      solvedPuzzleIds: updatedSolved,
      discoveredClueIds: updatedClues,
    });
  };

  // Hint request handler
  const handleRequestHint = (puzzleId: string, level: number) => {
    onUpdateProgress({
      ...progress,
      usedHints: {
        ...progress.usedHints,
        [puzzleId]: level,
      },
    });
  };

  // Notes update
  const handleNotesChange = (newNotes: string) => {
    onUpdateProgress({
      ...progress,
      playerNotes: newNotes,
    });
  };

  const handleAppendNote = (noteText: string) => {
    const current = progress.playerNotes;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const appended = current ? `${current}\n\n[${timeStr}] ${noteText}` : `[${timeStr}] ${noteText}`;
    handleNotesChange(appended);
  };

  // Accusation verdict submit
  const handleSubmitVerdict = (
    suspectId: string,
    motive: string,
    method: string,
    evidenceId: string
  ) => {
    setShowAccusationModal(false);

    const scoreResult = calculateCaseScore(
      mystery,
      progress,
      suspectId,
      motive,
      method,
      evidenceId
    );

    const updatedProgress: CaseProgress = {
      ...progress,
      submittedVerdict: {
        suspectId,
        motive,
        method,
        evidenceId,
        score: scoreResult.totalScore,
        verdict: scoreResult.verdict,
        timestamp: new Date().toISOString(),
      },
    };

    onUpdateProgress(updatedProgress);

    // Update profile completed cases and history
    const record: InvestigationRecord = {
      caseId: mystery.id,
      caseTitle: mystery.title,
      score: scoreResult.totalScore,
      accuracy: scoreResult.accuracy,
      timeSpentSeconds: progress.elapsedSeconds,
      hintsUsed: Object.keys(progress.usedHints).length,
      verdict: scoreResult.verdict,
      completedAt: new Date().toISOString(),
    };

    const isNewlyCompleted = !profile.casesCompleted.includes(mystery.id);
    const updatedCasesCompleted = isNewlyCompleted
      ? [...profile.casesCompleted, mystery.id]
      : profile.casesCompleted;

    const updatedPerfectCases =
      scoreResult.accuracy === 100 && scoreResult.hintPenalty === 0 && !profile.perfectCases.includes(mystery.id)
        ? [...profile.perfectCases, mystery.id]
        : profile.perfectCases;

    const baseUpdatedProfile: PlayerProfile = {
      ...profile,
      totalPoints: profile.totalPoints + scoreResult.totalScore,
      casesCompleted: updatedCasesCompleted,
      perfectCases: updatedPerfectCases,
      history: [record, ...profile.history.filter((h) => h.caseId !== mystery.id)],
    };

    // Evaluate new achievements
    const { updatedProfile } = evaluateAchievements(baseUpdatedProfile, mystery, updatedProgress, scoreResult);
    onUpdateProfile(updatedProfile);

    // Audio cue
    if (scoreResult.verdict === 'Conviction') {
      soundManager.playVictory();
    } else {
      soundManager.playPuzzleSolved();
    }
  };

  // Replay Case handler
  const handleReplay = () => {
    soundManager.playClick();
    onUpdateProgress({
      caseId: mystery.id,
      startedAt: Date.now(),
      elapsedSeconds: 0,
      discoveredClueIds: [],
      solvedPuzzleIds: [],
      usedHints: {},
      playerNotes: '',
    });
    setActiveSubTab('scene');
  };

  // If already submitted verdict, render the VerdictSummary
  if (progress.submittedVerdict) {
    const scoreResult: ScoreCalculationResult = calculateCaseScore(
      mystery,
      progress,
      progress.submittedVerdict.suspectId,
      progress.submittedVerdict.motive,
      progress.submittedVerdict.method,
      progress.submittedVerdict.evidenceId
    );

    return (
      <div className="space-y-6 pb-16">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToLibrary();
          }}
          className="flex items-center gap-1.5 text-xs text-[#A5A7AD] hover:text-[#C9A86A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Library</span>
        </button>

        <VerdictSummary
          mystery={mystery}
          progress={progress}
          scoreResult={scoreResult}
          onReplay={handleReplay}
          onNextCase={onNextCase}
          onReturnToLibrary={onBackToLibrary}
        />
      </div>
    );
  }

  const activePuzzle = activePuzzleId
    ? mystery.puzzles.find((p) => p.id === activePuzzleId)
    : null;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Station Dossier Bar */}
      <div className="p-5 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToLibrary();
            }}
            className="flex items-center gap-1 text-xs text-[#A5A7AD] hover:text-[#C9A86A] transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Case Library</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#A5A7AD] mb-1">
            <span
              className={
                mystery.difficulty === 'Easy'
                  ? 'text-emerald-400 font-semibold'
                  : mystery.difficulty === 'Medium'
                  ? 'text-amber-400 font-semibold'
                  : 'text-rose-400 font-semibold'
              }
            >
              {mystery.difficulty} Inquiry
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A5A7AD]" />
              <span>{mystery.location}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#A5A7AD]" />
              <span>{mystery.incidentTime}</span>
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            {mystery.title}
          </h1>
          <p className="text-xs text-[#C9A86A] font-medium mt-0.5">{mystery.subtitle}</p>
        </div>

        {/* Right Station Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Optional Timer */}
          {showTimer && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#2A2E39] text-xs font-mono tabular-nums text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800">
              <Clock className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{formatTime(progress.elapsedSeconds)}</span>
            </div>
          )}

          {/* Evidence Counter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] dark:bg-[#111318] bg-slate-100 border border-[#2A2E39] text-xs font-mono tabular-nums text-[#A5A7AD]">
            <Search className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>
              {progress.discoveredClueIds.length}/{mystery.clues.length} clues
            </span>
          </div>

          {/* Deliver Verdict Primary CTA */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAccusationModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#111318] bg-gradient-to-r from-[#C9A86A] to-[#D8BA7E] hover:from-[#D8BA7E] hover:to-[#E5CB95] rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Deliver Verdict</span>
          </button>
        </div>
      </div>

      {/* Segmented Sub-Tab Navigation Bar */}
      <div className="flex items-center p-1.5 bg-[#161920] dark:bg-[#161920] bg-white rounded-xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 overflow-x-auto shadow-sm">
        {(
          [
            { id: 'scene', label: 'Crime Scene', icon: Search, badge: `${progress.discoveredClueIds.length}/${mystery.clues.length}` },
            { id: 'suspects', label: 'Suspects Dossier', icon: Users, badge: `${mystery.suspects.length}` },
            { id: 'puzzles', label: 'Ciphers & Locks', icon: Key, badge: `${progress.solvedPuzzleIds.length}/${mystery.puzzles.length}` },
            { id: 'evidence', label: 'Evidence Board', icon: Layers, badge: `${progress.discoveredClueIds.length}` },
            { id: 'story', label: 'Case Briefing', icon: FileText, badge: undefined },
            { id: 'notes', label: 'Field Notes', icon: Edit3, badge: undefined },
          ] as Array<{ id: SubTab; label: string; icon: typeof Search; badge?: string }>
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveSubTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#C9A86A] text-[#111318] font-bold shadow-sm'
                  : 'text-[#A5A7AD] hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-[#111318]/20 text-[#111318]' : 'bg-[#111318] text-[#A5A7AD]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Panels */}
      <div>
        {/* TAB 1: Crime Scene */}
        {activeSubTab === 'scene' && (
          <CrimeSceneView
            mystery={mystery}
            discoveredClueIds={progress.discoveredClueIds}
            solvedPuzzleIds={progress.solvedPuzzleIds}
            onDiscoverClue={handleDiscoverClue}
            onOpenPuzzle={(pId) => setActivePuzzleId(pId)}
            onInspectClue={(clue) => setInspectingClue(clue)}
          />
        )}

        {/* TAB 2: Suspects */}
        {activeSubTab === 'suspects' && (
          <SuspectsDossier
            suspects={mystery.suspects}
            primarySuspectId={primarySuspectId}
            onSelectPrimarySuspect={(sId) => setPrimarySuspectId(sId)}
            onAddNote={handleAppendNote}
          />
        )}

        {/* TAB 3: Puzzles & Ciphers */}
        {activeSubTab === 'puzzles' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-white border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                  Encrypted Security Locks & Mechanisms
                </h3>
                <p className="text-xs text-[#A5A7AD]">
                  Solve these logical ciphers and mechanisms to unlock sealed compartments and extract critical forensic clues.
                </p>
              </div>
              <div className="text-xs font-mono tabular-nums text-[#C9A86A]">
                {progress.solvedPuzzleIds.length} / {mystery.puzzles.length} Solved
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mystery.puzzles.map((p) => {
                const isSolved = progress.solvedPuzzleIds.includes(p.id);
                const hintLvl = progress.usedHints[p.id] || 0;

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSolved
                        ? 'border-emerald-800 bg-emerald-950/20 text-emerald-200'
                        : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold capitalize text-[#C9A86A]">
                          {p.type} Challenge
                        </span>
                        <span className="font-mono text-xs tabular-nums text-[#A5A7AD]">
                          +{p.pointsAwarded} pts
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold mb-1.5">{p.title}</h4>
                      <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {p.instructions}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#2A2E39]/60 dark:border-[#2A2E39]/60 border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        {isSolved ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cipher Cracked</span>
                          </span>
                        ) : hintLvl > 0 ? (
                          <span className="text-amber-400 font-mono text-[11px]">
                            {hintLvl} hint{hintLvl > 1 ? 's' : ''} used
                          </span>
                        ) : (
                          <span className="text-[#A5A7AD] text-[11px]">No hints used</span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setActivePuzzleId(p.id);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          isSolved
                            ? 'text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/30'
                            : 'text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E]'
                        }`}
                      >
                        {isSolved ? 'Review Decryption' : 'Engage Cipher'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Evidence Board */}
        {activeSubTab === 'evidence' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-white border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                  Case Evidence Board & Findings
                </h3>
                <p className="text-xs text-[#A5A7AD]">
                  Examine forensic, physical, document, and testimonial findings gathered from the crime scene.
                </p>
              </div>
              <div className="text-xs font-mono tabular-nums text-[#C9A86A]">
                {progress.discoveredClueIds.length} / {mystery.clues.length} Discovered
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mystery.clues.map((clue) => {
                const isDiscovered = progress.discoveredClueIds.includes(clue.id);

                return (
                  <ClueCard
                    key={clue.id}
                    clue={clue}
                    isDiscovered={isDiscovered}
                    onInspect={(c) => setInspectingClue(c)}
                    onAddNote={handleAppendNote}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: Story & Case Briefing */}
        {activeSubTab === 'story' && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-md space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#C9A86A] uppercase tracking-wider block mb-1">
                Official Incident Dossier
              </span>
              <h2 className="font-display text-2xl font-bold">{mystery.title}</h2>
              <p className="text-xs text-[#A5A7AD] mt-1">{mystery.location} · {mystery.incidentTime}</p>
            </div>

            <div className="p-5 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] text-xs sm:text-sm leading-relaxed text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700 whitespace-pre-line font-serif">
              {mystery.story}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 border border-[#2A2E39] text-xs">
                <span className="font-semibold text-[#C9A86A] block mb-1">Estimated Inquest Time</span>
                <span className="text-[#A5A7AD] font-mono tabular-nums">{mystery.estimatedTime}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 border border-[#2A2E39] text-xs">
                <span className="font-semibold text-[#C9A86A] block mb-1">Potential Bounty</span>
                <span className="text-[#A5A7AD] font-mono tabular-nums">+{mystery.basePoints} base pts</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 border border-[#2A2E39] text-xs">
                <span className="font-semibold text-[#C9A86A] block mb-1">Key Objective</span>
                <span className="text-[#A5A7AD]">Identify culprit, motive, method, & smoking gun evidence</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Field Notes Notebook */}
        {activeSubTab === 'notes' && (
          <InvestigationNotes
            notes={progress.playerNotes}
            onChangeNotes={handleNotesChange}
          />
        )}
      </div>

      {/* MODAL 1: Interactive Puzzle Solver */}
      {activePuzzle && (
        <PuzzleModal
          puzzle={activePuzzle}
          isSolved={progress.solvedPuzzleIds.includes(activePuzzle.id)}
          usedHintLevel={progress.usedHints[activePuzzle.id] || 0}
          onSolve={handleSolvePuzzle}
          onRequestHint={handleRequestHint}
          onClose={() => setActivePuzzleId(null)}
        />
      )}

      {/* MODAL 2: Clue Detailed Examination Modal */}
      {inspectingClue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A]">
                <Eye className="w-4 h-4" />
                <span>Forensic Evidence Examination</span>
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
                <span>{inspectingClue.category} Evidence</span>
                <span aria-hidden="true">·</span>
                <span>Found at: {inspectingClue.locationFound}</span>
              </div>
              <h3 className="font-display text-lg font-bold">{inspectingClue.title}</h3>
            </div>

            <div className="p-4 rounded-xl bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] text-xs leading-relaxed text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-700">
              <p className="font-medium text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 mb-2">
                Preliminary Finding:
              </p>
              <p className="mb-3">{inspectingClue.description}</p>
              <p className="font-medium text-[#C9A86A] mb-1">Deductive Significance:</p>
              <p>{inspectingClue.details}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  handleAppendNote(`[Evidence: ${inspectingClue.title}] ${inspectingClue.details}`);
                  setInspectingClue(null);
                }}
                className="text-xs text-[#C9A86A] hover:underline cursor-pointer"
              >
                + Copy details to Notebook
              </button>

              <button
                onClick={() => setInspectingClue(null)}
                className="px-4 py-1.5 text-xs font-semibold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Final Accusation Indictment */}
      {showAccusationModal && (
        <FinalAccusationModal
          mystery={mystery}
          progress={progress}
          onSubmitAccusation={handleSubmitVerdict}
          onClose={() => setShowAccusationModal(false)}
        />
      )}
    </div>
  );
};

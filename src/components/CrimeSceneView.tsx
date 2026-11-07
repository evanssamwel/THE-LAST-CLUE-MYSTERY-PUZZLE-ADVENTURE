/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MysteryCase, Hotspot, Clue } from '../types';
import { Search, Sparkles, Lock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CrimeSceneViewProps {
  mystery: MysteryCase;
  discoveredClueIds: string[];
  solvedPuzzleIds: string[];
  onDiscoverClue: (clueId: string) => void;
  onOpenPuzzle: (puzzleId: string) => void;
  onInspectClue: (clue: Clue) => void;
}

export const CrimeSceneView: React.FC<CrimeSceneViewProps> = ({
  mystery,
  discoveredClueIds,
  solvedPuzzleIds,
  onDiscoverClue,
  onOpenPuzzle,
  onInspectClue,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleHotspotClick = (hs: Hotspot) => {
    soundManager.playClick();
    setSelectedHotspot(hs);

    // If it's locked by an unsolved puzzle, don't unlock clue yet
    if (hs.lockedByPuzzleId && !solvedPuzzleIds.includes(hs.lockedByPuzzleId)) {
      return;
    }

    // Otherwise unlock the clue!
    if (!discoveredClueIds.includes(hs.clueId)) {
      soundManager.playClueFound();
      onDiscoverClue(hs.clueId);
    }
  };

  const currentHotspotClue = selectedHotspot
    ? mystery.clues.find((c) => c.id === selectedHotspot.clueId)
    : null;

  const isCurrentHotspotLocked =
    selectedHotspot?.lockedByPuzzleId &&
    !solvedPuzzleIds.includes(selectedHotspot.lockedByPuzzleId);

  return (
    <div className="space-y-6">
      {/* Crime Scene Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-white border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C9A86A] font-semibold">
            Crime Scene Examination
          </span>
          <h3 className="font-display text-lg font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
            {mystery.crimeScene.name}
          </h3>
          <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mt-0.5">
            {mystery.crimeScene.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#C9A86A] bg-[#111318] dark:bg-[#111318] bg-slate-100 px-3 py-1.5 rounded-lg border border-[#2A2E39] shrink-0 self-start sm:self-auto">
          <Search className="w-3.5 h-3.5" />
          <span>
            {discoveredClueIds.length} / {mystery.clues.length} Evidence Discovered
          </span>
        </div>
      </div>

      {/* Interactive Crime Scene Canvas */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318] shadow-2xl group select-none">
        {!imageError && mystery.crimeScene.image ? (
          <img
            src={mystery.crimeScene.image}
            alt={mystery.crimeScene.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1C2028] to-[#111318]">
            <Search className="w-12 h-12 text-[#C9A86A] mb-3 opacity-60" />
            <h4 className="font-display text-xl text-[#F5F3EE]">{mystery.crimeScene.name}</h4>
            <p className="text-xs text-[#A5A7AD] max-w-md text-center mt-1">
              Click the investigative markers below to inspect scene areas and uncover forensic evidence.
            </p>
          </div>
        )}

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Interactive Hotspot Pins */}
        {mystery.crimeScene.hotspots.map((hs) => {
          const isDiscovered = discoveredClueIds.includes(hs.clueId);
          const isLocked = hs.lockedByPuzzleId && !solvedPuzzleIds.includes(hs.lockedByPuzzleId);
          const isSelected = selectedHotspot?.id === hs.id;

          return (
            <button
              key={hs.id}
              onClick={() => handleHotspotClick(hs)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              title={`Inspect: ${hs.name}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A86A] ${
                isSelected
                  ? 'bg-[#C9A86A] text-[#111318] scale-125 shadow-lg ring-4 ring-[#C9A86A]/40 z-20'
                  : isLocked
                  ? 'bg-[#1C2028] border-2 border-amber-400 text-amber-400 hover:scale-115 hover:bg-amber-400 hover:text-[#111318] z-10'
                  : isDiscovered
                  ? 'bg-emerald-600 border border-emerald-400 text-white hover:scale-110 z-10'
                  : 'bg-[#1C2028]/90 border-2 border-[#C9A86A] text-[#C9A86A] hover:scale-115 hover:bg-[#C9A86A] hover:text-[#111318] shadow-md z-10'
              }`}
            >
              {isLocked ? (
                <Lock className="w-4 h-4" />
              ) : isDiscovered ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Hotspot Inspection Drawer / Card */}
      {selectedHotspot && (
        <div className="p-5 rounded-xl border border-[#C9A86A]/40 bg-[#1C2028] dark:bg-[#1C2028] bg-white text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrentHotspotLocked
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isCurrentHotspotLocked ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                  {selectedHotspot.name}
                </h4>
                <span className="text-xs text-[#A5A7AD]">
                  {isCurrentHotspotLocked ? 'Cipher Mechanism Encrypted' : 'Evidence Extracted'}
                </span>
              </div>
            </div>

            {/* Quick Action */}
            {isCurrentHotspotLocked && selectedHotspot.lockedByPuzzleId ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenPuzzle(selectedHotspot.lockedByPuzzleId!);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#111318] bg-amber-400 hover:bg-amber-300 rounded-md transition-colors shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Decrypt Puzzle Lock</span>
              </button>
            ) : currentHotspotClue ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onInspectClue(currentHotspotClue);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-md transition-colors shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Clue Dossier</span>
              </button>
            ) : null}
          </div>

          <p className="text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mb-2 leading-relaxed">
            {selectedHotspot.description}
          </p>

          <div className="p-3 rounded-lg bg-[#111318] dark:bg-[#111318] bg-slate-50 border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 text-xs">
            {isCurrentHotspotLocked ? (
              <p className="text-amber-300">
                This evidence is locked behind a security cipher. You must solve the puzzle to unlock this clue.
              </p>
            ) : (
              <p className="text-emerald-300 dark:text-emerald-300 text-emerald-800">
                {selectedHotspot.foundText}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Accessible Object List (especially helpful on mobile or keyboard navigation) */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[#A5A7AD] font-semibold block">
          Key Scene Objects & Points of Interest:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {mystery.crimeScene.hotspots.map((hs) => {
            const isDiscovered = discoveredClueIds.includes(hs.clueId);
            const isLocked = hs.lockedByPuzzleId && !solvedPuzzleIds.includes(hs.lockedByPuzzleId);

            return (
              <button
                key={hs.id}
                onClick={() => handleHotspotClick(hs)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedHotspot?.id === hs.id
                    ? 'border-[#C9A86A] bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 ring-1 ring-[#C9A86A]'
                    : 'border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white hover:border-[#A5A7AD]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="font-display text-xs font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 block truncate">
                    {hs.name}
                  </span>
                  <span className="text-[11px] text-[#A5A7AD]">
                    {isLocked ? 'Locked Cipher' : isDiscovered ? 'Discovered' : 'Click to inspect'}
                  </span>
                </div>

                <div className="shrink-0">
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-amber-400" />
                  ) : isDiscovered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#A5A7AD]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

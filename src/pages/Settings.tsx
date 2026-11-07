/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameSettings } from '../types';
import { Settings as SettingsIcon, Moon, Sun, Volume2, VolumeX, Sparkles, Clock, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SettingsProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleTheme = () => {
    soundManager.playClick();
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: nextTheme });
  };

  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    soundManager.setEnabled(nextSound);
    if (nextSound) {
      soundManager.playClick();
    }
    onUpdateSettings({ ...settings, soundEnabled: nextSound });
  };

  const handleToggleAnimations = () => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, animations: !settings.animations });
  };

  const handleToggleTimer = () => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, showTimer: !settings.showTimer });
  };

  const handleConfirmReset = () => {
    soundManager.playClick();
    onResetProgress();
    setShowConfirmReset(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86A] uppercase tracking-widest mb-1.5">
          <SettingsIcon className="w-4 h-4" />
          <span>System Preferences</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
          Game Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 mt-1">
          Customize your sensory atmosphere, timer visibility, and local storage data.
        </p>
      </div>

      {/* Settings Panel */}
      <div className="rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white divide-y divide-[#2A2E39] dark:divide-[#2A2E39] divide-slate-100 shadow-md">
        {/* Theme Setting */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 flex items-center justify-center text-[#C9A86A] shrink-0">
              {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                Visual Atmosphere
              </h4>
              <p className="text-xs text-[#A5A7AD]">
                {settings.theme === 'dark'
                  ? 'Noir Dark theme (#111318 canvas with antique gold accents)'
                  : 'Editorial Light theme (Warm cream canvas with soft charcoal type)'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-800 hover:bg-[#C9A86A] hover:text-[#111318] transition-colors cursor-pointer shrink-0"
          >
            <span>{settings.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>

        {/* Sound FX Setting */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 flex items-center justify-center text-[#C9A86A] shrink-0">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                Acoustic Sound Effects
              </h4>
              <p className="text-xs text-[#A5A7AD]">
                Web Audio procedural chimes for clue discovery, cipher solving, and verdicts
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
              settings.soundEnabled
                ? 'bg-[#C9A86A] text-[#111318]'
                : 'bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 text-[#A5A7AD]'
            }`}
          >
            <span>{settings.soundEnabled ? 'Enabled' : 'Muted'}</span>
          </button>
        </div>

        {/* Investigation Timer Setting */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 flex items-center justify-center text-[#C9A86A] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                Case Chronometer
              </h4>
              <p className="text-xs text-[#A5A7AD]">
                Display elapsed seconds during crime scene investigations
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleTimer}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
              settings.showTimer
                ? 'bg-[#C9A86A] text-[#111318]'
                : 'bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 text-[#A5A7AD]'
            }`}
          >
            <span>{settings.showTimer ? 'Visible' : 'Hidden'}</span>
          </button>
        </div>

        {/* Animations Setting */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1C2028] dark:bg-[#1C2028] bg-slate-100 flex items-center justify-center text-[#C9A86A] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
                Smooth UI Motion
              </h4>
              <p className="text-xs text-[#A5A7AD]">
                Compositor-level page transitions and clue discovery animations
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleAnimations}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
              settings.animations
                ? 'bg-[#C9A86A] text-[#111318]'
                : 'bg-[#2A2E39] dark:bg-[#2A2E39] bg-slate-200 text-[#A5A7AD]'
            }`}
          >
            <span>{settings.animations ? 'Active' : 'Reduced'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-5 rounded-2xl border border-rose-900/40 bg-rose-950/20 text-rose-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-sm font-bold text-rose-300">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reset Investigation Progress</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowConfirmReset(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 border border-rose-800 rounded-lg hover:bg-rose-900/40 transition-colors cursor-pointer"
          >
            Reset Progress
          </button>
        </div>
        <p className="text-xs text-rose-300/80 leading-relaxed">
          Clears discovered clues, solved ciphers, and completed case history from LocalStorage. Settings will be preserved.
        </p>
      </div>

      {/* About Section */}
      <div className="p-5 rounded-2xl border border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#161920] dark:bg-[#161920] bg-white text-xs text-[#A5A7AD] space-y-2">
        <h4 className="font-display text-sm font-bold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900">
          About THE LAST CLUE
        </h4>
        <p>
          Version 1.0.0 · A mystery-solving puzzle adventure game built with React, Vite, Tailwind CSS, and Web Audio API. All investigations, crime scenes, and cipher challenges are fully offline-capable and stored locally in your browser.
        </p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-rose-700 bg-[#161920] text-[#F5F3EE] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display text-lg font-bold">Confirm Full Reset</h3>
            </div>
            <p className="text-xs text-[#A5A7AD] leading-relaxed">
              Are you certain you want to wipe all investigation files, discovered evidence, solved ciphers, and achievements? This action cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs text-[#A5A7AD] hover:text-[#F5F3EE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer transition-colors"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

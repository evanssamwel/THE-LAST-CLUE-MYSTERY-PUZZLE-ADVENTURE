/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, BookOpen, Layers, Award, User, Settings, Volume2, VolumeX, Play } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type TabType = 'home' | 'cases' | 'investigation' | 'evidence' | 'achievements' | 'profile' | 'settings';

interface NavbarProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  activeCaseId: string | null;
  activeCaseTitle?: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'dark' | 'light';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  activeCaseId,
  activeCaseTitle,
  soundEnabled,
  onToggleSound,
}) => {
  const handleNavClick = (tab: TabType) => {
    soundManager.playClick();
    onNavigate(tab);
  };

  return (
    <>
      {/* Desktop Top Bar Contract: 3 zones, gap-8 */}
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 bg-[#111318]/95 dark:bg-[#111318]/95 bg-[#F9F8F5]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A86A] rounded-sm group cursor-pointer"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-900 group-hover:text-[#C9A86A] transition-colors whitespace-nowrap shrink-0">
              THE LAST CLUE
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-[#C9A86A] font-semibold">
              · INVESTIGATION
            </span>
          </button>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentTab === 'home'
                  ? 'text-[#C9A86A] font-semibold border-b-2 border-[#C9A86A]'
                  : 'text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('cases')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentTab === 'cases'
                  ? 'text-[#C9A86A] font-semibold border-b-2 border-[#C9A86A]'
                  : 'text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
              }`}
            >
              Case Library
            </button>
            <button
              onClick={() => handleNavClick('evidence')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentTab === 'evidence'
                  ? 'text-[#C9A86A] font-semibold border-b-2 border-[#C9A86A]'
                  : 'text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
              }`}
            >
              Evidence Board
            </button>
            <button
              onClick={() => handleNavClick('achievements')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentTab === 'achievements'
                  ? 'text-[#C9A86A] font-semibold border-b-2 border-[#C9A86A]'
                  : 'text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => handleNavClick('profile')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                currentTab === 'profile'
                  ? 'text-[#C9A86A] font-semibold border-b-2 border-[#C9A86A]'
                  : 'text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-600 hover:text-[#F5F3EE] dark:hover:text-[#F5F3EE] hover:text-slate-900'
              }`}
            >
              Detective Dossier
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick sound toggle */}
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute audio sound effects' : 'Unmute audio sound effects'}
              title={soundEnabled ? 'Audio Sound Effects Active' : 'Sound Muted'}
              className="p-2 text-[#A5A7AD] hover:text-[#F5F3EE] hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C9A86A]" /> : <VolumeX className="w-4 h-4 text-[#A5A7AD]" />}
            </button>

            {/* Quick settings button */}
            <button
              onClick={() => handleNavClick('settings')}
              aria-label="Game Settings"
              title="Settings"
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentTab === 'settings'
                  ? 'text-[#C9A86A] bg-[#1C2028] dark:bg-[#1C2028] bg-slate-200'
                  : 'text-[#A5A7AD] hover:text-[#F5F3EE] hover:bg-[#1C2028] dark:hover:bg-[#1C2028] hover:bg-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            {activeCaseId ? (
              <button
                onClick={() => handleNavClick('investigation')}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Resume:</span>
                <span className="max-w-[120px] truncate">{activeCaseTitle || 'Case'}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('cases')}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#111318] bg-[#C9A86A] hover:bg-[#D8BA7E] rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Dossiers</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (< 15% mobile viewport height) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161920] dark:bg-[#161920] bg-[#FFFFFF] border-t border-[#2A2E39] dark:border-[#2A2E39] border-slate-200 px-2 py-1 flex items-center justify-around h-14">
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] ${
            currentTab === 'home' ? 'text-[#C9A86A] font-semibold' : 'text-[#A5A7AD] hover:text-[#F5F3EE]'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavClick('cases')}
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] ${
            currentTab === 'cases' ? 'text-[#C9A86A] font-semibold' : 'text-[#A5A7AD] hover:text-[#F5F3EE]'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Cases</span>
        </button>
        {activeCaseId && (
          <button
            onClick={() => handleNavClick('investigation')}
            className={`flex flex-col items-center justify-center w-14 h-full text-[10px] ${
              currentTab === 'investigation' ? 'text-[#C9A86A] font-semibold' : 'text-[#C9A86A]/80 hover:text-[#C9A86A]'
            }`}
          >
            <Play className="w-4 h-4 mb-0.5 fill-current" />
            <span>Active</span>
          </button>
        )}
        <button
          onClick={() => handleNavClick('evidence')}
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] ${
            currentTab === 'evidence' ? 'text-[#C9A86A] font-semibold' : 'text-[#A5A7AD] hover:text-[#F5F3EE]'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>Evidence</span>
        </button>
        <button
          onClick={() => handleNavClick('achievements')}
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] ${
            currentTab === 'achievements' ? 'text-[#C9A86A] font-semibold' : 'text-[#A5A7AD] hover:text-[#F5F3EE]'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Badges</span>
        </button>
        <button
          onClick={() => handleNavClick('profile')}
          className={`flex flex-col items-center justify-center w-14 h-full text-[10px] ${
            currentTab === 'profile' ? 'text-[#C9A86A] font-semibold' : 'text-[#A5A7AD] hover:text-[#F5F3EE]'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
};

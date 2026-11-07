/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  loadProfile,
  saveProfile,
  loadSettings,
  saveSettings,
  loadAllProgress,
  loadCaseProgress,
  saveCaseProgress,
  getActiveCaseId,
  setActiveCaseId,
  resetAllData,
  DEFAULT_PROFILE,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { MYSTERY_CASES } from './data/cases';
import { getTodayDailyChallenge, getTodayDateKey } from './data/dailyChallenges';
import { PlayerProfile, GameSettings, CaseProgress, DailyChallengeData, Achievement } from './types';
import { Navbar, TabType } from './components/Navbar';
import { Home } from './pages/Home';
import { Cases } from './pages/Cases';
import { Investigation } from './pages/Investigation';
import { Evidence } from './pages/Evidence';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { Award, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [allProgress, setAllProgress] = useState<Record<string, CaseProgress>>(() => loadAllProgress());
  const [activeCaseIdState, setActiveCaseIdState] = useState<string | null>(() => getActiveCaseId());
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Daily challenge state
  const [dailyChallenge] = useState<DailyChallengeData>(() => getTodayDailyChallenge());
  const [showDailyModal, setShowDailyModal] = useState(false);

  // Achievement unlock notification toast
  const [unlockedToast, setUnlockedToast] = useState<Achievement | null>(null);

  // Synchronize theme class on <html> element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [settings.theme]);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist profile
  const handleUpdateProfile = useCallback((updated: PlayerProfile) => {
    setProfile(updated);
    saveProfile(updated);
  }, []);

  // Persist settings
  const handleUpdateSettings = useCallback((updated: GameSettings) => {
    setSettings(updated);
    saveSettings(updated);
  }, []);

  // Persist case progress
  const handleUpdateCaseProgress = useCallback((updated: CaseProgress) => {
    setAllProgress((prev) => {
      const next = { ...prev, [updated.caseId]: updated };
      return next;
    });
    saveCaseProgress(updated);
  }, []);

  // Open case for investigation
  const handleOpenCase = (caseId: string) => {
    setActiveCaseIdState(caseId);
    setActiveCaseId(caseId);
    // Ensure case progress exists
    if (!allProgress[caseId]) {
      const newProgress = loadCaseProgress(caseId);
      handleUpdateCaseProgress(newProgress);
    }
    setCurrentTab('investigation');
  };

  // Sound toggle helper
  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    handleUpdateSettings({ ...settings, soundEnabled: nextSound });
    soundManager.setEnabled(nextSound);
    if (nextSound) {
      soundManager.playClick();
    }
  };

  // Next case navigation
  const handleNextCase = () => {
    if (!activeCaseIdState) return;
    const currentIndex = MYSTERY_CASES.findIndex((c) => c.id === activeCaseIdState);
    const nextIndex = (currentIndex + 1) % MYSTERY_CASES.length;
    handleOpenCase(MYSTERY_CASES[nextIndex].id);
  };

  // Daily challenge solve handler
  const handleDailySolved = () => {
    const todayKey = getTodayDateKey();
    if (profile.lastDailyCompleted === todayKey) return;

    const streak = profile.dailyStreak + 1;
    const bonus = dailyChallenge.bonusPoints;
    const updatedPoints = profile.totalPoints + bonus;

    // Check achievement for daily detective
    const newAchievements = new Set(profile.unlockedAchievements);
    newAchievements.add('daily_detective');

    const updatedProfile: PlayerProfile = {
      ...profile,
      totalPoints: updatedPoints,
      dailyStreak: streak,
      lastDailyCompleted: todayKey,
      unlockedAchievements: Array.from(newAchievements),
    };

    handleUpdateProfile(updatedProfile);
  };

  // Full reset handler
  const handleResetAll = () => {
    resetAllData();
    setProfile(DEFAULT_PROFILE);
    setAllProgress({});
    setActiveCaseIdState(null);
    setCurrentTab('home');
  };

  // Is today's daily completed?
  const isDailyCompleted = profile.lastDailyCompleted === getTodayDateKey();

  // Active mystery case object
  const activeCase = activeCaseIdState
    ? MYSTERY_CASES.find((c) => c.id === activeCaseIdState) || MYSTERY_CASES[0]
    : MYSTERY_CASES[0];

  const currentCaseProgress = activeCaseIdState
    ? allProgress[activeCaseIdState] || loadCaseProgress(activeCaseIdState)
    : loadCaseProgress(MYSTERY_CASES[0].id);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col ${
        settings.theme === 'dark' ? 'bg-[#111318] text-[#F5F3EE]' : 'bg-[#F9F8F5] text-[#1F242E]'
      }`}
    >
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        activeCaseId={activeCaseIdState}
        activeCaseTitle={activeCase?.title}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        theme={settings.theme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <Home
            profile={profile}
            cases={MYSTERY_CASES}
            allProgress={allProgress}
            activeCaseId={activeCaseIdState}
            dailyChallenge={dailyChallenge}
            isDailyCompleted={isDailyCompleted}
            onOpenCase={handleOpenCase}
            onNavigateToCases={() => setCurrentTab('cases')}
            onNavigateToAchievements={() => setCurrentTab('achievements')}
            onNavigateToProfile={() => setCurrentTab('profile')}
            onOpenDaily={() => setShowDailyModal(true)}
          />
        )}

        {currentTab === 'cases' && (
          <Cases
            cases={MYSTERY_CASES}
            allProgress={allProgress}
            profile={profile}
            activeCaseId={activeCaseIdState}
            onSelectCase={handleOpenCase}
          />
        )}

        {currentTab === 'investigation' && (
          <Investigation
            mystery={activeCase}
            progress={currentCaseProgress}
            profile={profile}
            showTimer={settings.showTimer}
            onUpdateProgress={handleUpdateCaseProgress}
            onUpdateProfile={handleUpdateProfile}
            onBackToLibrary={() => setCurrentTab('cases')}
            onNextCase={handleNextCase}
          />
        )}

        {currentTab === 'evidence' && (
          <Evidence
            cases={MYSTERY_CASES}
            allProgress={allProgress}
            onOpenCase={handleOpenCase}
          />
        )}

        {currentTab === 'achievements' && <Achievements profile={profile} />}

        {currentTab === 'profile' && (
          <Profile
            profile={profile}
            onUpdateName={(newName) => handleUpdateProfile({ ...profile, name: newName })}
          />
        )}

        {currentTab === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetAll}
          />
        )}
      </main>

      {/* Daily Challenge Modal */}
      {showDailyModal && (
        <DailyChallengeModal
          challenge={dailyChallenge}
          isCompleted={isDailyCompleted}
          onSolve={handleDailySolved}
          onClose={() => setShowDailyModal(false)}
        />
      )}

      {/* Unlocked Toast Banner */}
      {unlockedToast && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border border-[#C9A86A] bg-[#1C2028] text-[#F5F3EE] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-10 h-10 rounded-lg bg-[#C9A86A] text-[#111318] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#C9A86A] tracking-wider">
              Achievement Unlocked!
            </div>
            <div className="font-display text-sm font-bold">{unlockedToast.title}</div>
            <div className="text-xs text-[#A5A7AD]">+{unlockedToast.rewardPoints} points awarded</div>
          </div>
          <button
            onClick={() => setUnlockedToast(null)}
            className="p-1 text-[#A5A7AD] hover:text-[#F5F3EE] ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#2A2E39]/40 dark:border-[#2A2E39]/40 border-slate-200 py-6 text-center text-xs text-[#A5A7AD] dark:text-[#A5A7AD] text-slate-500 mb-14 md:mb-0">
        <p className="font-display tracking-wider font-semibold text-[#F5F3EE] dark:text-[#F5F3EE] text-slate-700">
          THE LAST CLUE · MYSTERY PUZZLE ADVENTURE
        </p>
        <p className="text-[11px] mt-1 opacity-70">
          Built for consulting detectives and mystery puzzle enthusiasts.
        </p>
      </footer>
    </div>
  );
}

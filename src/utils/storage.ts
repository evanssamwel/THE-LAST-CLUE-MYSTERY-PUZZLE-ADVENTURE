/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerProfile, GameSettings, CaseProgress, InvestigationRecord } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'the_last_clue_profile',
  SETTINGS: 'the_last_clue_settings',
  PROGRESS: 'the_last_clue_case_progress',
  ACTIVE_CASE: 'the_last_clue_active_case_id',
};

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Detective Vance',
  title: 'Consulting Investigator',
  totalPoints: 0,
  level: 1,
  casesCompleted: [],
  perfectCases: [],
  unlockedAchievements: [],
  dailyStreak: 0,
  lastDailyCompleted: '',
  history: [],
};

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'dark',
  soundEnabled: true,
  animations: true,
  showTimer: true,
};

// Safe local storage helpers
export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (e) {
    console.error('Failed to load player profile from localStorage:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save player profile:', e);
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadAllProgress(): Record<string, CaseProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load case progress:', e);
    return {};
  }
}

export function loadCaseProgress(caseId: string): CaseProgress {
  const all = loadAllProgress();
  if (all[caseId]) {
    return all[caseId];
  }
  return {
    caseId,
    startedAt: Date.now(),
    elapsedSeconds: 0,
    discoveredClueIds: [],
    solvedPuzzleIds: [],
    usedHints: {},
    playerNotes: '',
  };
}

export function saveCaseProgress(progress: CaseProgress): void {
  try {
    const all = loadAllProgress();
    all[progress.caseId] = progress;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save case progress:', e);
  }
}

export function getActiveCaseId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CASE);
  } catch {
    return null;
  }
}

export function setActiveCaseId(caseId: string | null): void {
  try {
    if (caseId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CASE, caseId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CASE);
    }
  } catch (e) {
    console.error('Failed to set active case id:', e);
  }
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CASE);
    // Keep settings or restore default
  } catch (e) {
    console.error('Failed to reset data:', e);
  }
}

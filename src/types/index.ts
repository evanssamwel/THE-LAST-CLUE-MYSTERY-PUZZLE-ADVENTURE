/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ClueCategory = 'Physical' | 'Document' | 'Forensic' | 'Testimony';

export type PuzzleType = 'code' | 'cipher' | 'riddle' | 'sequence' | 'logic';

export interface Hotspot {
  id: string;
  name: string;
  x: number; // percentage coordinate 0-100
  y: number; // percentage coordinate 0-100
  icon: string;
  clueId: string;
  description: string;
  foundText: string;
  lockedByPuzzleId?: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  avatar: string;
  description: string;
  motive: string;
  alibi: string;
  statement: string;
  suspiciousDetails: string;
  isCulprit: boolean;
}

export interface Clue {
  id: string;
  title: string;
  category: ClueCategory;
  locationFound: string;
  description: string;
  details: string;
  isKeyEvidence: boolean;
  linkedSuspectId?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  type: PuzzleType;
  instructions: string;
  question: string;
  options?: string[];
  solution: string;
  placeholder?: string;
  hints: [string, string, string]; // Exactly 3 tiers
  unlocksClueId: string;
  pointsAwarded: number;
  explanation: string;
}

export interface CaseSolution {
  culpritId: string;
  culpritMotive: string;
  motiveOptions: string[];
  correctMethod: string;
  methodOptions: string[];
  keyEvidenceId: string;
  fullConfession: string;
  deductionSummary: string;
}

export interface MysteryCase {
  id: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  estimatedTime: string;
  location: string;
  incidentTime: string;
  coverImage: string;
  synopsis: string;
  story: string;
  crimeScene: {
    name: string;
    description: string;
    image?: string;
    hotspots: Hotspot[];
  };
  suspects: Suspect[];
  clues: Clue[];
  puzzles: Puzzle[];
  solution: CaseSolution;
  basePoints: number;
}

export interface InvestigationRecord {
  caseId: string;
  caseTitle: string;
  score: number;
  accuracy: number; // 0-100 percentage
  timeSpentSeconds: number;
  hintsUsed: number;
  verdict: 'Conviction' | 'Partial' | 'Wrong';
  completedAt: string;
}

export interface PlayerProfile {
  name: string;
  title: string;
  totalPoints: number;
  level: number;
  casesCompleted: string[];
  perfectCases: string[];
  unlockedAchievements: string[];
  dailyStreak: number;
  lastDailyCompleted: string;
  history: InvestigationRecord[];
}

export interface GameSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  animations: boolean;
  showTimer: boolean;
}

export interface CaseProgress {
  caseId: string;
  startedAt: number;
  elapsedSeconds: number;
  discoveredClueIds: string[];
  solvedPuzzleIds: string[];
  usedHints: Record<string, number>; // puzzleId -> hint level 1, 2, or 3
  playerNotes: string;
  submittedVerdict?: {
    suspectId: string;
    motive: string;
    method: string;
    evidenceId: string;
    score: number;
    verdict: 'Conviction' | 'Partial' | 'Wrong';
    timestamp: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'skill' | 'speed' | 'deduction';
  rewardPoints: number;
}

export interface DailyChallengeData {
  id: string;
  dateKey: string;
  title: string;
  description: string;
  mysterySnippet: string;
  puzzle: {
    question: string;
    type: 'cipher' | 'riddle' | 'logic';
    options?: string[];
    solution: string;
    hint: string;
  };
  bonusPoints: number;
}

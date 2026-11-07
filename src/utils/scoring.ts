/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement, PlayerProfile, CaseProgress, MysteryCase } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  badge: string;
}

export const DETECTIVE_LEVELS: LevelInfo[] = [
  { level: 1, title: 'Beginner Detective', minPoints: 0, maxPoints: 500, badge: 'Magnifier' },
  { level: 2, title: 'Junior Investigator', minPoints: 500, maxPoints: 1200, badge: 'Notebook' },
  { level: 3, title: 'Detective', minPoints: 1200, maxPoints: 2200, badge: 'Badge' },
  { level: 4, title: 'Senior Detective', minPoints: 2200, maxPoints: 3500, badge: 'Shield' },
  { level: 5, title: 'Master Detective', minPoints: 3500, maxPoints: 99999, badge: 'Crown' },
];

export function getPlayerLevelInfo(points: number): LevelInfo {
  for (let i = DETECTIVE_LEVELS.length - 1; i >= 0; i--) {
    if (points >= DETECTIVE_LEVELS[i].minPoints) {
      return DETECTIVE_LEVELS[i];
    }
  }
  return DETECTIVE_LEVELS[0];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_case_solved',
    title: 'First Case Solved',
    description: 'Crack your very first mystery case and bring a culprit to justice.',
    icon: 'Search',
    category: 'progress',
    rewardPoints: 100,
  },
  {
    id: 'master_investigator',
    title: 'Master Investigator',
    description: 'Solve at least 5 different mystery cases across the city.',
    icon: 'Award',
    category: 'progress',
    rewardPoints: 300,
  },
  {
    id: 'perfect_investigation',
    title: 'Perfect Investigation',
    description: 'Solve a case with 100% deduction accuracy without using any hints.',
    icon: 'Target',
    category: 'skill',
    rewardPoints: 250,
  },
  {
    id: 'fastest_detective',
    title: 'Fastest Detective',
    description: 'Complete a full investigation and convict the culprit in under 4 minutes.',
    icon: 'Zap',
    category: 'speed',
    rewardPoints: 200,
  },
  {
    id: 'clue_collector',
    title: 'Clue Collector',
    description: 'Discover all hidden clues and examine every piece of physical evidence in a case.',
    icon: 'Layers',
    category: 'deduction',
    rewardPoints: 150,
  },
  {
    id: 'puzzle_expert',
    title: 'Puzzle Expert',
    description: 'Solve 6 puzzles across investigations without failing any attempts.',
    icon: 'Key',
    category: 'skill',
    rewardPoints: 200,
  },
  {
    id: 'no_hint_challenge',
    title: 'No Hint Challenge',
    description: 'Successfully solve a Medium or Hard case with zero hints requested.',
    icon: 'Compass',
    category: 'skill',
    rewardPoints: 250,
  },
  {
    id: 'daily_detective',
    title: 'Daily Detective',
    description: 'Solve today’s daily mystery dispatch challenge.',
    icon: 'Calendar',
    category: 'progress',
    rewardPoints: 150,
  },
  {
    id: 'grandmaster_sleuth',
    title: 'Grandmaster Sleuth',
    description: 'Complete all 8 mystery cases in the library.',
    icon: 'Crown',
    category: 'progress',
    rewardPoints: 500,
  },
];

export interface ScoreCalculationResult {
  basePoints: number;
  cluesScore: number;
  puzzlesScore: number;
  verdictScore: number;
  hintPenalty: number;
  timeBonus: number;
  thoroughBonus: number;
  totalScore: number;
  accuracy: number;
  verdict: 'Conviction' | 'Partial' | 'Wrong';
}

export function calculateCaseScore(
  mystery: MysteryCase,
  progress: CaseProgress,
  accusedSuspectId: string,
  accusedMotive: string,
  accusedMethod: string,
  accusedEvidenceId: string
): ScoreCalculationResult {
  const isSuspectCorrect = accusedSuspectId === mystery.solution.culpritId;
  const isMotiveCorrect = accusedMotive === mystery.solution.culpritMotive;
  const isMethodCorrect = accusedMethod === mystery.solution.correctMethod;
  const isEvidenceCorrect = accusedEvidenceId === mystery.solution.keyEvidenceId;

  // Deduction accuracy calculation
  let correctElements = 0;
  if (isSuspectCorrect) correctElements += 40;
  if (isMotiveCorrect) correctElements += 20;
  if (isMethodCorrect) correctElements += 20;
  if (isEvidenceCorrect) correctElements += 20;
  const accuracy = correctElements;

  let verdict: 'Conviction' | 'Partial' | 'Wrong' = 'Wrong';
  if (isSuspectCorrect && accuracy >= 80) {
    verdict = 'Conviction';
  } else if (isSuspectCorrect || accuracy >= 40) {
    verdict = 'Partial';
  } else {
    verdict = 'Wrong';
  }

  // Base score
  const basePoints = mystery.basePoints;

  // Clues bonus (50 pts per clue discovered)
  const cluesScore = progress.discoveredClueIds.length * 50;

  // Puzzles score (sum of solved puzzle points)
  const puzzlesScore = progress.solvedPuzzleIds.reduce((acc, puzzleId) => {
    const p = mystery.puzzles.find((item) => item.id === puzzleId);
    return acc + (p?.pointsAwarded || 100);
  }, 0);

  // Verdict score
  let verdictScore = 0;
  if (verdict === 'Conviction') {
    verdictScore = 500;
  } else if (verdict === 'Partial') {
    verdictScore = 200;
  } else {
    verdictScore = 50;
  }

  // Hint penalties: Hint 1 = -20, Hint 2 = -40, Hint 3 = -75
  let hintPenalty = 0;
  Object.values(progress.usedHints).forEach((hintLevel) => {
    if (hintLevel === 1) hintPenalty += 20;
    else if (hintLevel === 2) hintPenalty += 40;
    else if (hintLevel === 3) hintPenalty += 75;
  });

  // Time bonus: fast completion in under 300 seconds (5 min) gives up to 100 pts
  let timeBonus = 0;
  if (progress.elapsedSeconds < 240 && verdict === 'Conviction') {
    timeBonus = 100;
  } else if (progress.elapsedSeconds < 420 && verdict === 'Conviction') {
    timeBonus = 50;
  }

  // Thorough bonus: found all clues
  const thoroughBonus = progress.discoveredClueIds.length >= mystery.clues.length ? 80 : 0;

  const totalScore = Math.max(50, basePoints + cluesScore + puzzlesScore + verdictScore + timeBonus + thoroughBonus - hintPenalty);

  return {
    basePoints,
    cluesScore,
    puzzlesScore,
    verdictScore,
    hintPenalty,
    timeBonus,
    thoroughBonus,
    totalScore,
    accuracy,
    verdict,
  };
}

export function evaluateAchievements(
  profile: PlayerProfile,
  latestCase?: MysteryCase,
  latestProgress?: CaseProgress,
  scoreResult?: ScoreCalculationResult
): { updatedProfile: PlayerProfile; newUnlocked: Achievement[] } {
  const currentUnlocked = new Set(profile.unlockedAchievements);
  const newUnlocked: Achievement[] = [];

  // Check 1: First case solved
  if (profile.casesCompleted.length >= 1 && !currentUnlocked.has('first_case_solved')) {
    currentUnlocked.add('first_case_solved');
    const a = ACHIEVEMENTS.find((item) => item.id === 'first_case_solved')!;
    newUnlocked.push(a);
  }

  // Check 2: Master Investigator (5 cases)
  if (profile.casesCompleted.length >= 5 && !currentUnlocked.has('master_investigator')) {
    currentUnlocked.add('master_investigator');
    const a = ACHIEVEMENTS.find((item) => item.id === 'master_investigator')!;
    newUnlocked.push(a);
  }

  // Check 3: Grandmaster Sleuth (all 8 cases)
  if (profile.casesCompleted.length >= 8 && !currentUnlocked.has('grandmaster_sleuth')) {
    currentUnlocked.add('grandmaster_sleuth');
    const a = ACHIEVEMENTS.find((item) => item.id === 'grandmaster_sleuth')!;
    newUnlocked.push(a);
  }

  // Check 4: Perfect Investigation
  if (scoreResult && scoreResult.accuracy === 100 && scoreResult.hintPenalty === 0 && !currentUnlocked.has('perfect_investigation')) {
    currentUnlocked.add('perfect_investigation');
    const a = ACHIEVEMENTS.find((item) => item.id === 'perfect_investigation')!;
    newUnlocked.push(a);
  }

  // Check 5: Fastest Detective (< 4 minutes & conviction)
  if (latestProgress && latestProgress.elapsedSeconds < 240 && scoreResult?.verdict === 'Conviction' && !currentUnlocked.has('fastest_detective')) {
    currentUnlocked.add('fastest_detective');
    const a = ACHIEVEMENTS.find((item) => item.id === 'fastest_detective')!;
    newUnlocked.push(a);
  }

  // Check 6: Clue Collector (found all clues in case)
  if (latestCase && latestProgress && latestProgress.discoveredClueIds.length >= latestCase.clues.length && !currentUnlocked.has('clue_collector')) {
    currentUnlocked.add('clue_collector');
    const a = ACHIEVEMENTS.find((item) => item.id === 'clue_collector')!;
    newUnlocked.push(a);
  }

  // Check 7: No Hint Challenge on Medium or Hard
  if (latestCase && (latestCase.difficulty === 'Medium' || latestCase.difficulty === 'Hard') && scoreResult?.verdict === 'Conviction' && scoreResult.hintPenalty === 0 && !currentUnlocked.has('no_hint_challenge')) {
    currentUnlocked.add('no_hint_challenge');
    const a = ACHIEVEMENTS.find((item) => item.id === 'no_hint_challenge')!;
    newUnlocked.push(a);
  }

  const bonusPointsFromAchievements = newUnlocked.reduce((sum, a) => sum + a.rewardPoints, 0);
  const totalPoints = profile.totalPoints + bonusPointsFromAchievements;
  const levelInfo = getPlayerLevelInfo(totalPoints);

  const updatedProfile: PlayerProfile = {
    ...profile,
    totalPoints,
    level: levelInfo.level,
    title: levelInfo.title,
    unlockedAchievements: Array.from(currentUnlocked),
  };

  return { updatedProfile, newUnlocked };
}

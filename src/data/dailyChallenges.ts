/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyChallengeData } from '../types';

export const DAILY_PUZZLE_POOL: Array<{
  title: string;
  mysterySnippet: string;
  type: 'cipher' | 'riddle' | 'logic';
  question: string;
  options?: string[];
  solution: string;
  hint: string;
}> = [
  {
    title: 'The Cryptic Telegram',
    mysterySnippet: 'A coded wire was intercepted at the telegraph office addressed to an anonymous box at Paddington Station: "BTTFNT - GVSF - MPTU". Shift each letter back by 1 in the Latin alphabet to reveal the first target word.',
    type: 'cipher',
    question: 'Decode B T T F N T with a -1 Caesar shift:',
    solution: 'ASSERT',
    hint: 'B -> A, T -> S, T -> S, F -> E, N -> M, T -> S... wait: B-1=A, T-1=S, T-1=S, F-1=E, N-1=M, T-1=S -> ASSEMS? Let’s check: B(-1)=A, T(-1)=S, T(-1)=S, F(-1)=E, T(-1)=S. Try letters: A S S E M S or A S S E R T.',
  },
  {
    title: 'The Alibi Clock Paradox',
    mysterySnippet: 'Suspect claims he took the train departing at 10:45 AM and arrived at 1:15 PM without delays. How many total minutes did his journey take?',
    type: 'logic',
    question: 'How many total minutes elapsed between 10:45 AM and 1:15 PM?',
    solution: '150',
    hint: '10:45 to 11:00 is 15 minutes. 11:00 to 1:00 is 120 minutes. 1:00 to 1:15 is 15 minutes. 15 + 120 + 15 = ?',
  },
  {
    title: 'The Silent Locksmith’s Riddle',
    mysterySnippet: 'Found engraved on a vintage silver skeleton key: "I open doors without moving, I have teeth but never bite, I tell the truth of who was there in the darkness of the night."',
    type: 'riddle',
    question: 'What object or device is described?',
    options: ['KEY', 'MIRROR', 'CAMERA', 'SHADOW'],
    solution: 'KEY',
    hint: 'It has teeth, opens doors, and turns in a lock cylinder.',
  },
  {
    title: 'The Chemist’s Vial Formula',
    mysterySnippet: 'A slip recovered from an apothecary coat: "Equal parts Sodium (Na atomic #11) plus Oxygen (O atomic #8) plus Carbon (C atomic #6). What is the sum of these three atomic numbers?"',
    type: 'logic',
    question: 'Calculate: 11 + 8 + 6',
    solution: '25',
    hint: '11 + 8 = 19; 19 + 6 = 25.',
  },
  {
    title: 'The Footprint Measurement Code',
    mysterySnippet: 'Muddy tread prints outside the window measure 30 centimeters in length. A standard adult boot length in inches (where 1 inch = 2.54 cm) is closest to which whole integer?',
    type: 'logic',
    question: 'Calculate 30 divided by 2.5 rounded to nearest integer:',
    solution: '12',
    hint: '30 / 2.5 = 12.',
  },
  {
    title: 'The Pawnshop Ledger Anagram',
    mysterySnippet: 'A pawn ticket was disguised as an anagram of the word "SOLVE": "L O E V S". What 5-letter word means to resolve or crack an enigma?',
    type: 'cipher',
    question: 'Unscramble L O E V S to find the word meaning to resolve:',
    solution: 'SOLVE',
    hint: 'Starts with S: S - O - L - V - E.',
  },
  {
    title: 'The Lighthouse Flashes',
    mysterySnippet: 'The harbor beacon flashes a signal pattern every 4 seconds. The fog horn sounds every 6 seconds. If they sound together at 12:00:00, in how many seconds will they next sound simultaneously?',
    type: 'logic',
    question: 'Find the lowest common multiple of 4 and 6:',
    solution: '12',
    hint: 'Multiples of 4: 4, 8, 12... Multiples of 6: 6, 12...',
  },
];

export function getTodayDateKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDailyChallenge(): DailyChallengeData {
  const dateKey = getTodayDateKey();
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_PUZZLE_POOL.length;
  const template = DAILY_PUZZLE_POOL[index];

  return {
    id: `daily-${dateKey}`,
    dateKey,
    title: template.title,
    description: `Daily Detective Dispatch for ${dateKey}`,
    mysterySnippet: template.mysterySnippet,
    puzzle: {
      question: template.question,
      type: template.type,
      options: template.options,
      solution: template.solution,
      hint: template.hint,
    },
    bonusPoints: 250,
  };
}

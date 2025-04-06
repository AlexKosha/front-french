// wordHelpers.ts

import {WordProgress} from '../types';

export const initializeWordStats = (
  progress: WordProgress[],
  level: number,
  setWordStats: (value: any) => void,
) => {
  const unfinishedWords = progress.filter(
    word => !word.completed.includes(level),
  );
  if (unfinishedWords.length === 0) return;

  const selectedWords = unfinishedWords.slice(0, 5);

  const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  shuffle(selectedWords);

  const repeatedWords = [];
  for (let i = 0; i < 3; i++) {
    repeatedWords.push(...selectedWords);
  }

  setWordStats(repeatedWords.map(word => ({word, correctCount: 0})));
};

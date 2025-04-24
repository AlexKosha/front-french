import AsyncStorage from '@react-native-async-storage/async-storage';
import {WordProgress, WordStat} from '../types';

export const markCurrentWordsAsCompleted = async (
  progress: WordProgress[],
  wordStats: WordStat[],
  level: number,
  titleName: string,
): Promise<void> => {
  try {
    const updatedProgress = progress.map(word => {
      if (wordStats.some(stat => stat.word._id === word._id)) {
        return {
          ...word,
          completed: word.completed.includes(level)
            ? word.completed
            : [...word.completed, level],
        };
      }
      return word;
    });

    await AsyncStorage.setItem(
      `progress_${titleName}`,
      JSON.stringify(updatedProgress),
    );
  } catch (error) {
    console.error('Помилка оновлення прогресу:', error);
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import {WordProgress, WordStat} from '../types';

export const markCurrentWordsAsCompleted = async (
  progress: WordProgress[],
  wordStats: WordStat[],
  level: number,
  titleName: string,
): Promise<void> => {
  try {
    // Оновлюємо слова в темі
    const updatedWords = progress.map(word => {
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

    // Отримуємо поточні дані
    const jsonValue = await AsyncStorage.getItem('progress_all');
    const allData = jsonValue != null ? JSON.parse(jsonValue) : {};

    // Ініціалізуємо прогрес
    allData.progress = allData.progress || {};

    // Оновлюємо тему з датою
    allData.progress[`progress_${titleName}`] = {
      updatedAt: Date.now(),
      words: updatedWords,
    };

    // Зберігаємо назад у сховище
    await AsyncStorage.setItem('progress_all', JSON.stringify(allData));
  } catch (error) {
    console.error('Помилка оновлення прогресу:', error);
  }
};

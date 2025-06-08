import AsyncStorage from '@react-native-async-storage/async-storage';
import {WordProgress, WordStat} from '../types'; // імпортуй thunk
import {AppDispatch} from '../store/store';
import {updateLocallyProgress} from '../store/progress/progressThunk';

export const markCurrentWordsAsCompleted = async (
  progress: WordProgress[],
  wordStats: WordStat[],
  level: number,
  titleName: string,
  dispatch: AppDispatch, // <- додано dispatch як аргумент
): Promise<void> => {
  try {
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

    const updatedTheme = {
      [`progress_${titleName}`]: {
        updatedAt: Date.now(),
        words: updatedWords,
      },
    };

    // Зберігаємо в AsyncStorage
    const jsonValue = await AsyncStorage.getItem('progress_all');
    const allData = jsonValue != null ? JSON.parse(jsonValue) : {};
    allData.progress = allData.progress || {};
    allData.progress[`progress_${titleName}`] =
      updatedTheme[`progress_${titleName}`];

    console.log('progressLocal', updatedTheme);
    await AsyncStorage.setItem('progress_all', JSON.stringify(allData));

    // 🧠 Передаємо оновлену тему в Redux
    dispatch(updateLocallyProgress(updatedTheme));
  } catch (error) {
    console.error('Помилка оновлення прогресу:', error);
  }
};

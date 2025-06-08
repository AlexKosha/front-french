import {ThemeSaveProgress} from './wordProgressTypes';

// Ключі: progress_назва_теми, значення: масив слів
export type ProgressMap = {
  [key: `progress_${string}`]: ThemeSaveProgress; // ✅ включає updatedAt + words
};

// Повний об'єкт, який ти відправляєш на бек
export interface ProgressPayload {
  userId: string;
  progress: ProgressMap;
}

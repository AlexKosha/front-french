import {ProgressPayload} from '../types';
import {instance} from './authService';

// Отримати прогрес поточного користувача
export const fetchProgress = async () => {
  const {data} = await instance.get('/progress');
  console.log(data);
  return data;
};

// Додати або оновити прогрес (перезапис усього об'єкта)
export const addProgress = async (progressData: ProgressPayload) => {
  const {data} = await instance.post('/progress', progressData);
  return data.progress;
};

export const updateProgressTheme = async (progressData: ProgressPayload) => {
  const {data} = await instance.patch('/progress', progressData);
  console.log(data);
  return data.progress;
};

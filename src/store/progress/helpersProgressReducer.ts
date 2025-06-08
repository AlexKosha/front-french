import {PayloadAction} from '@reduxjs/toolkit';
import {ProgressState} from './progressSlice';
import {ProgressMap, ProgressPayload} from '../../types';

export const handlePending = (state: ProgressState) => {
  state.isLoading = true;
};

export const handleFulfilledSaveProgress = (
  state: ProgressState,
  {payload}: PayloadAction<ProgressPayload>,
) => {
  state.isLoading = false;
  state.error = null;
  state.data = payload;
  state.updatedProgress = null;
};

export const handleOnlyUpdatedProgress = (
  state: ProgressState,
  {payload}: PayloadAction<ProgressMap>,
) => {
  if (!state.updatedProgress) {
    // 🔧 Якщо updatedProgress ще не існує — створюємо новий обʼєкт
    state.updatedProgress = {
      userId: 'local',
      progress: {...payload},
    };
  } else {
    // 🔁 Якщо вже існує — оновлюємо лише потрібні ключі
    for (const key in payload) {
      const typedKey = key as keyof ProgressMap;
      state.updatedProgress.progress[typedKey] = payload[typedKey];
    }
  }

  state.isLoading = false;
  state.error = null;
};

export const handleRejected = (
  state: ProgressState,
  {payload}: PayloadAction<string>,
) => {
  state.isLoading = false;
  state.error = payload;
};

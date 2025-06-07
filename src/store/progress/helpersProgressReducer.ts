import {PayloadAction} from '@reduxjs/toolkit';
import {ProgressState} from './progressSlice';
import {ProgressPayload} from '../../types';

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
};
export const handleFulfilledAddProgress = (
  state: ProgressState,
  {payload}: PayloadAction<ProgressPayload>,
) => {
  state.isLoading = false;
  state.error = null;
  state.data = payload;
};

export const handleRejected = (
  state: ProgressState,
  {payload}: PayloadAction<string>,
) => {
  state.isLoading = false;
  state.error = payload;
};

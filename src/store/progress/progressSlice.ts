import {createSlice} from '@reduxjs/toolkit';
import {ProgressPayload} from '../../types';
import * as progressThunk from './progressThunk';
import * as HelpersReducer from './helpersProgressReducer';
import {logoutThunk} from '../auth/authThunks';

export interface ProgressState {
  data: ProgressPayload | null;
  isLoading: boolean;
  error: string | null;
  updatedProgress: ProgressPayload | null;
}

const initialState: ProgressState = {
  data: null,
  isLoading: false,
  error: null,
  updatedProgress: null,
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        progressThunk.getProgress.fulfilled,
        HelpersReducer.handleFulfilledSaveProgress,
      )
      .addCase(
        progressThunk.addThunkProgress.fulfilled,
        HelpersReducer.handleFulfilledSaveProgress,
      )
      .addCase(
        progressThunk.updateThunkProgress.fulfilled,
        HelpersReducer.handleFulfilledSaveProgress,
      )
      .addCase(
        progressThunk.updateLocallyProgress.fulfilled, // <- твій новий thunk
        HelpersReducer.handleOnlyUpdatedProgress,
      )
      .addCase(logoutThunk.fulfilled, HelpersReducer.handleLogOutProgress)
      .addMatcher(
        action => action.type.endsWith('pending'),
        HelpersReducer.handlePending,
      )
      .addMatcher(
        action => action.type.endsWith('rejected'),
        HelpersReducer.handleRejected,
      );
  },
});

export const progressReducer = progressSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import {ProgressPayload} from '../../types';
import * as progressThunk from './progressThunk';
import * as HelpersReducer from './helpersProgressReducer';

export interface ProgressState {
  data: ProgressPayload | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  data: null,
  isLoading: false,
  error: null,
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
        progressThunk.addThunk.fulfilled,
        HelpersReducer.handleFulfilledSaveProgress,
      )
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

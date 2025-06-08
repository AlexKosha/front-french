import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  addProgress,
  fetchProgress,
  updateProgressTheme,
} from '../../services/progressSrvices';
import {ProgressPayload, ThemeSaveProgress} from '../../types';

export const getProgress = createAsyncThunk(
  '/progress',
  async (_, {rejectWithValue}) => {
    try {
      return await fetchProgress();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addThunkProgress = createAsyncThunk(
  '/progress/add',
  async (progressData: ProgressPayload, {rejectWithValue}) => {
    try {
      return await addProgress(progressData);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateThunkProgress = createAsyncThunk(
  '/progress/update',
  async (progressData: ProgressPayload, {rejectWithValue}) => {
    try {
      return await updateProgressTheme(progressData);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateLocallyProgress = createAsyncThunk(
  '/progress/updateLocal',
  async (newProgress: Record<string, ThemeSaveProgress>, {rejectWithValue}) => {
    try {
      return newProgress;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

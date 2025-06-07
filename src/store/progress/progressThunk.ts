import {createAsyncThunk} from '@reduxjs/toolkit';
import {addProgress, fetchProgress} from '../../services/progressSrvices';
import {ProgressPayload} from '../../types';

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

export const addThunk = createAsyncThunk(
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

import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchTopic} from '../../services/themeService';

export const getTopic = createAsyncThunk(
  '/theme',
  async (_, {rejectWithValue}) => {
    try {
      return await fetchTopic();
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

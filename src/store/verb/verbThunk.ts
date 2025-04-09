import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchVerb} from '../../services/verbService';

export const getVerbs = createAsyncThunk(
  '/verb',
  async (_, {rejectWithValue}) => {
    try {
      return await fetchVerb();
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

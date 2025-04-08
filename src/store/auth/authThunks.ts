import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfile,
  logIn,
  logout,
  setToken,
  signUp,
  updateLng,
  updatePassword,
  updateTheme,
  updateUser,
  forgotPass,
  restorePassword,
  updateProgressUser,
  // UpdatePasswordBody,
  // ThemeUpdateBody,
  // LanguageUpdateBody,
  // UpdateUserBody,
} from '../../services/authService';
import {
  LanguageUpdateBody,
  ThemeUpdateBody,
  UpdatePasswordBody,
  UpdateUserBody,
} from '../../types';

// Типи для тіла запиту (наприклад, для входу, реєстрації тощо)
interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  password: string;
  birthDate: string;
  name: string;
}

export const loginThunk = createAsyncThunk(
  '/users/login',
  async (body: LoginBody, {rejectWithValue}) => {
    try {
      return await logIn(body);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  '/users/register',
  async (body: RegisterBody, {rejectWithValue}) => {
    try {
      return await signUp(body);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const logoutThunk = createAsyncThunk(
  '/users/logout',
  async (_, {rejectWithValue}) => {
    try {
      return await logout();
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const getProfileThunk = createAsyncThunk(
  '/users/current',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as {auth: {token: string | null}};

    const token = state.auth.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No token provided');
    }
    setToken(token);
    try {
      const data = await getProfile();
      return data;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updaterPasswordThunk = createAsyncThunk(
  '/users/updatePassword',
  async (body: UpdatePasswordBody, {rejectWithValue}) => {
    try {
      return await updatePassword(body);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updaterUserThemeThunk = createAsyncThunk(
  '/users/theme',
  async (body: ThemeUpdateBody, {rejectWithValue}) => {
    try {
      const data = await updateTheme(body);
      return data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserLngThunk = createAsyncThunk(
  '/users/lng',
  async (body: LanguageUpdateBody, {rejectWithValue}) => {
    try {
      return await updateLng(body);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const updaterUserDataThunk = createAsyncThunk(
  '/users/update',
  async (body: UpdateUserBody, {rejectWithValue}) => {
    try {
      return await updateUser(body);
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  },
);

export const forgotPassThunk = createAsyncThunk(
  '/users/forgotPassword',
  async (body: {email: string}, {rejectWithValue}) => {
    try {
      return await forgotPass(body);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const restorePasswordThunk = createAsyncThunk(
  '/users/restorePassword',
  async (
    {body, otp}: {body: {email: string; password: string}; otp: string},
    {rejectWithValue},
  ) => {
    try {
      return await restorePassword(otp, body);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const loadThemeFromAsyncStorage = createAsyncThunk(
  '/users/storegeTheme',
  async (_: any, thunkAPI: any) => {
    try {
      const storedTheme: string | null = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        return JSON.parse(storedTheme); // Return the theme from AsyncStorage
      } else {
        return 'light'; // If no theme is found, return the default theme (e.g., 'light')
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message); // Reject the thunk with the error message
    }
  },
);

export const updaterProgressUserThunk = createAsyncThunk(
  'user/updateProgress',
  async (_, {rejectWithValue}) => {
    try {
      const data = await updateProgressUser();
      return data;
    } catch (error: any) {
      console.error('Помилка під час оновлення прогресу:', error.message);
      return rejectWithValue(error.message);
    }
  },
);

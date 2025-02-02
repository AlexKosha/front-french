import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import * as authThunks from './authThunks';
import * as HelpersReducer from './helpersAuthReducer';

// Типи для користувача та токену
export interface User {
  name: string | null;
  email: string | null;
  birthDate: string | null;
  croissants: number;
  theme?: boolean;
  lng?: string;
}

export interface AuthState {
  user: User;
  token: string | null;
  theme: boolean;
  isRefreshing: boolean;
  error: string;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: {name: null, email: null, birthDate: null, croissants: 0},
  token: null,
  theme: false,
  isRefreshing: false,
  error: '',
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Редюсер для зміни теми
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.theme = action.payload; // Оновлюємо тему в стані Redux
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        authThunks.loginThunk.fulfilled,
        HelpersReducer.handleFulfilledLogin,
      )
      .addCase(
        authThunks.registerThunk.fulfilled,
        HelpersReducer.handleFulfilledRegister,
      )
      .addCase(
        authThunks.getProfileThunk.fulfilled,
        HelpersReducer.handleFulfilledProfile,
      )
      .addCase(
        authThunks.logoutThunk.fulfilled,
        HelpersReducer.handleFulfilledLogout,
      )
      .addCase(
        authThunks.updaterUserDataThunk.fulfilled,
        HelpersReducer.handleFulfilledUpdateUserData,
      )
      .addCase(
        authThunks.updaterUserThemeThunk.fulfilled,
        HelpersReducer.handleFulfilledUpdateTheme,
      )
      .addCase(
        authThunks.updaterPasswordThunk.fulfilled,
        HelpersReducer.handleFulfilledUpdatePassword,
      )
      .addCase(
        authThunks.updateUserLngThunk.fulfilled,
        HelpersReducer.handleFulfilledUpdateLng,
      )
      .addCase(
        authThunks.updaterProgressUserThunk.fulfilled,
        HelpersReducer.handleUpdateProggres,
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

export const {setTheme} = authSlice.actions;

export default authSlice.reducer;

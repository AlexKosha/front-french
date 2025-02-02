import {PayloadAction} from '@reduxjs/toolkit';
import {WritableDraft} from 'immer';
import {AuthState, User} from './authSlice';

export const handlePending = (state: AuthState) => {
  state.isRefreshing = true;
};

export const handleFulfilledLogin = (
  state: AuthState,
  {payload}: PayloadAction<{token: string; user: User}>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.token = payload.token;
  state.user = payload.user;
  state.isLoggedIn = true;
};

export const handleFulfilledRegister = (
  state: AuthState,
  {payload}: PayloadAction<{token: string; user: User}>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.token = payload.token;
  state.user = payload.user;
  state.isLoggedIn = true;
};

export const handleFulfilledProfile = (
  state: AuthState,
  action: PayloadAction<User>,
) => {
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.error = '';
  state.user = action.payload;
};

export const handleFulfilledLogout = (state: AuthState) => {
  state.isRefreshing = false;
  state.error = '';
  state.token = null;
  state.isLoggedIn = false;
};

export const handleFulfilledUpdateUserData = (
  state: AuthState,
  {payload}: PayloadAction<User>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.user = payload;
};

export const handleFulfilledUpdateTheme = (
  state: AuthState,
  {payload}: PayloadAction<{theme: boolean}>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.user.theme = payload.theme;
};

export const handleFulfilledUpdateLng = (
  state: AuthState,
  {payload}: PayloadAction<{lng: string}>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.user.lng = payload.lng;
};

export const handleFulfilledUpdatePassword = (state: AuthState) => {
  state.isRefreshing = false;
  state.error = '';
};

export const handleFulfilledForgotPass = (
  state: AuthState,
  {payload}: PayloadAction<User>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.user = payload;
};

export const handleUpdateProggres = (
  state: AuthState,
  {payload}: PayloadAction<number>,
) => {
  state.isRefreshing = false;
  state.error = '';
  state.user.croissants = payload;
};

export const handleRejected = (
  state: WritableDraft<AuthState>, // Тип у вигляді WritableDraft для обробки мутацій
  {payload}: PayloadAction<string>,
) => {
  state.isRefreshing = false;
  state.error = payload;
};

import {RootState} from '../store'; // Імпортуємо RootState з вашого store

// Селектор для отримання користувача
export const selectUser = (state: RootState) => state.auth.user;

export const selectUserId = (state: RootState) => state.auth.user.id;

// Селектор для отримання токену
export const selectToken = (state: RootState) => state.auth.token;

// Селектор для отримання статусу оновлення
export const selectIsRefreshing = (state: RootState) => state.auth.isRefreshing;

// Селектор для отримання статусу авторизації
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export const selectTheme = (state: RootState) => state.auth.theme;

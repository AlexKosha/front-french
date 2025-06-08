import axios from 'axios';
import {
  AuthResponse,
  ForgotPasswordBody,
  LanguageUpdateBody,
  RestorePasswordBody,
  SpeechToTextResponse,
  ThemeUpdateBody,
  UpdatePasswordBody,
  UpdateUserBody,
  User,
} from '../types';

// Створення axios-інстансу
export const instance = axios.create({
  // baseURL: 'http://172.20.10.3:2023',
  // baseURL: 'http://192.168.43.163:2023',
  baseURL: 'http://192.168.1.193:2023',
});

// Функції для роботи з токеном
export const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const deleteToken = () => {
  delete instance.defaults.headers.common.Authorization;
};

export const signUp = async (
  formData: Record<string, any>,
): Promise<AuthResponse> => {
  const {data} = await instance.post<AuthResponse>('/users/register', formData);
  setToken(data.token);
  return data;
};

export const logIn = async (
  body: Record<string, any>,
): Promise<AuthResponse> => {
  const {data} = await instance.post<AuthResponse>('/users/login', body);
  setToken(data.token);
  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await instance.post('/users/logout');
    deleteToken();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getProfile = async (): Promise<User> => {
  const {data} = await instance.get<User>('/users/current', {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });

  return data;
};

export const updateUser = async (body: UpdateUserBody): Promise<User> => {
  const {data} = await instance.put<User>('/users/update', body);
  return data;
};

export const updatePassword = async (
  body: UpdatePasswordBody,
): Promise<void> => {
  await instance.patch('/users/updatePassword', body);
};

export const verify = async (): Promise<void> => {
  await instance.post('/users/verify');
};

export const updateTheme = async (
  body: ThemeUpdateBody,
): Promise<ThemeUpdateBody> => {
  const {data} = await instance.patch<ThemeUpdateBody>('/users/theme', body);
  return data;
};

export const updateLng = async (
  body: LanguageUpdateBody,
): Promise<LanguageUpdateBody> => {
  const {data} = await instance.patch<LanguageUpdateBody>('/users/lng', body);
  return data;
};

// Відновлення пароля (запит на скидання)
export const forgotPass = async (body: ForgotPasswordBody): Promise<void> => {
  await instance.post('/users/forgotPassword', body);
};

// Відновлення пароля (введення нового пароля)
export const restorePassword = async (
  otp: string,
  body: RestorePasswordBody,
): Promise<void> => {
  await instance.post(`/users/restorePassword/${otp}`, body);
};

export const updateProgressUser = async (): Promise<number> => {
  const {data} = await instance.patch<{croissants: number}>(
    '/users/updateProgressUser',
  );
  return data.croissants;
};

export const sendAudio = async (
  formData: FormData,
): Promise<SpeechToTextResponse> => {
  const {data} = await instance.post('/speech-to-text', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

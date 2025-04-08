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

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  birthDate?: string;
}

export interface UpdatePasswordBody {
  password: string;
  newPassword: string;
}

export interface ThemeUpdateBody {
  theme: boolean;
}

export interface LanguageUpdateBody {
  lng: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface RestorePasswordBody {
  email: string;
  password: string;
}

export interface SpeechToTextResponse {
  transcript: string; // Наприклад, якщо відповідь включає тільки розпізнаний текст
  // Додаткові поля можна додати, якщо вони є в API
}

export interface RegisterBody {
  email: string;
  password: string;
  birthDate: string;
  name: string;
}

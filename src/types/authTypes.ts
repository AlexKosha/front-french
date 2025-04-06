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

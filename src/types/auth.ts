export interface User {
  id: string;
  username: string;
  createdAt: Date;
}

export interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

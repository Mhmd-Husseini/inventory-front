export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export enum AuthActionTypes {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',
}

export type AuthAction =
  | { type: AuthActionTypes.LOGIN_REQUEST }
  | { type: AuthActionTypes.LOGIN_SUCCESS; payload: { user: User; token: string } }
  | { type: AuthActionTypes.LOGIN_FAILURE; payload: string }
  | { type: AuthActionTypes.REGISTER_REQUEST }
  | { type: AuthActionTypes.REGISTER_SUCCESS; payload: { user: User; token: string } }
  | { type: AuthActionTypes.REGISTER_FAILURE; payload: string }
  | { type: AuthActionTypes.LOGOUT }; 
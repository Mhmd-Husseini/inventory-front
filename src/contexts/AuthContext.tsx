import { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { AuthState, AuthAction, AuthActionTypes, User } from '../types/auth';
import * as authService from '../services/authService';

const token = localStorage.getItem('token');
const userString = localStorage.getItem('user');
let initialUser = null;
let isInitiallyAuthenticated = false;

try {
  if (token && userString) {
    initialUser = JSON.parse(userString);
    isInitiallyAuthenticated = true;
  }
} catch (err) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const initialState: AuthState = {
  user: initialUser,
  token: token,
  isAuthenticated: isInitiallyAuthenticated,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
    case AuthActionTypes.REGISTER_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case AuthActionTypes.LOGIN_SUCCESS:
    case AuthActionTypes.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    
    case AuthActionTypes.LOGIN_FAILURE:
    case AuthActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    
    case AuthActionTypes.LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: AuthActionTypes.LOGIN_REQUEST });
    
    try {
      const data = await authService.login({ email, password });
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { user: data.user, token: data.token },
      });
    } catch (err) {
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    dispatch({ type: AuthActionTypes.REGISTER_REQUEST });
    
    try {
      const data = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      dispatch({
        type: AuthActionTypes.REGISTER_SUCCESS,
        payload: { user: data.user, token: data.token },
      });
    } catch (err) {
      dispatch({
        type: AuthActionTypes.REGISTER_FAILURE,
        payload: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 
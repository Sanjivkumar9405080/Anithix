import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SafeUser,
  RegisterPayload,
  VerifyOtpPayload,
  ApiResponse,
  apiGetCurrentUser,
  apiRegister,
  apiVerifyRegistrationOtp,
  apiLogin,
  apiRequestLoginOtp,
  apiVerifyLoginOtp,
  apiResendOtp,
  apiLogout,
  apiAdminLogin,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
} from '../services/api';

interface AuthContextType {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<ApiResponse<{ user: SafeUser; token?: string }>>;
  requestLoginOtp: (email: string) => Promise<ApiResponse<{ email: string; purpose: string }>>;
  verifyLoginOtp: (payload: VerifyOtpPayload) => Promise<ApiResponse<{ user: SafeUser }>>;
  register: (payload: RegisterPayload) => Promise<ApiResponse<{ email: string; purpose: string }>>;
  verifyRegistrationOtp: (payload: VerifyOtpPayload) => Promise<ApiResponse<{ user: SafeUser }>>;
  resendOtp: (email: string, purpose: 'registration' | 'login') => Promise<ApiResponse>;
  adminLogin: (email: string, password: string) => Promise<ApiResponse<{ user: SafeUser }>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: SafeUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check current session on application launch and page refresh
  const refreshUser = async () => {
    try {
      const res = await apiGetCurrentUser();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        removeAuthToken();
        setUser(null);
      }
    } catch (err) {
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const register = async (payload: RegisterPayload) => {
    const res = await apiRegister(payload);
    if (res.success && res.data?.user) {
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      setUser(res.data.user);
    }
    return res;
  };

  const verifyRegistrationOtp = async (payload: VerifyOtpPayload) => {
    const res = await apiVerifyRegistrationOtp(payload);
    if (res.success && res.data?.user) {
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      setUser(res.data.user);
    }
    return res;
  };

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    if (res.success && res.data?.user) {
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      setUser(res.data.user);
    }
    return res;
  };

  const requestLoginOtp = async (email: string) => {
    return apiRequestLoginOtp(email);
  };

  const verifyLoginOtp = async (payload: VerifyOtpPayload) => {
    const res = await apiVerifyLoginOtp(payload);
    if (res.success && res.data?.user) {
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      setUser(res.data.user);
    }
    return res;
  };

  const adminLogin = async (email: string, password: string) => {
    const res = await apiAdminLogin(email, password);
    if (res.success && res.data?.user) {
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      setUser(res.data.user);
    }
    return res;
  };

  const resendOtp = async (email: string, purpose: 'registration' | 'login') => {
    return apiResendOtp(email, purpose);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      removeAuthToken();
      setUser(null);
    }
  };

  const updateUser = (updatedUser: SafeUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: Boolean(user && user.role === 'admin'),
        isLoading,
        token: getAuthToken(),
        login,
        register,
        verifyRegistrationOtp,
        requestLoginOtp,
        verifyLoginOtp,
        adminLogin,
        resendOtp,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

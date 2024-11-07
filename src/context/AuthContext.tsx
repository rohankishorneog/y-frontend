/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    username: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
  }));
  const API_URL = import.meta.env.VITE_API_URL;

  const login = useCallback(async (credentials: LoginCredentials) => {
    console.log(credentials);
    try {
      const response = await axios.post<{ username: string; token: string }>(
        `${API_URL}/api/auth/login`,
        credentials
      );
      console.log(response);
      const { username, token } = response.data;
      localStorage.setItem("token", token);

      setAuthState({
        username,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    console.log(credentials);
    try {
      const response = await axios.post<{ username: string; token: string }>(
        `${API_URL}/api/auth/signup`,
        credentials
      );

      const { username, token } = response.data;
      localStorage.setItem("token", token);

      setAuthState({
        username,
        token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Signup failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("token");
      setAuthState({
        username: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      setAuthState({
        username: null,
        token: null,
        isAuthenticated: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username: authState.username,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

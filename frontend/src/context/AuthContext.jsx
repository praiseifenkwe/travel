import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, formatApiError } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [authError, setAuthError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Restore signed-in state on mount via GET /api/auth/me
  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      try {
        const currentUser = await apiService.auth.me();
        if (isMounted && currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        // 401 is expected when no active session cookie exists
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setAuthError(null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthError(null);
  };

  const login = async (email, password) => {
    setSubmitting(true);
    setAuthError(null);
    try {
      const userData = await apiService.auth.login({ email, password });
      setUser(userData);
      closeAuthModal();
      return userData;
    } catch (err) {
      const msg = formatApiError(err);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const signup = async (email, name, password) => {
    setSubmitting(true);
    setAuthError(null);
    try {
      const userData = await apiService.auth.signup({ email, name, password });
      setUser(userData);
      closeAuthModal();
      return userData;
    } catch (err) {
      const msg = formatApiError(err);
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setUser(null);
      // Clean up account-scoped session caches
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("travelforge_session_")) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authModalOpen,
        authMode,
        authError,
        submitting,
        setAuthError,
        openAuthModal,
        closeAuthModal,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

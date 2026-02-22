"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user cookie on mount
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (userCookie) {
      try {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split("=")[1]),
        );
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Important for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success && data.data) {
      const userData = {
        id: data.data.user.id || data.data.user._id,
        name: data.data.user.name,
        email: data.data.user.email,
        phone: data.data.user.phone,
        profile_image: data.data.user.profile_image,
        role: data.data.user.role?.name || "user",
      };
      setUser(userData);
    }

    return data;
  };

  const register = async (userData) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include", // Important for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.success && data.data) {
      // After registration, auto-login
      if (userData.email && userData.password) {
        return await login(userData.email, userData.password);
      }
    }

    return data;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return safe defaults when no provider is present (prevents runtime crashes)
    return {
      user: null,
      loading: false,
      login: async () => ({ success: false, message: "No auth provider" }),
      register: async () => ({ success: false, message: "No auth provider" }),
      logout: async () => {},
      isAuthenticated: false,
    };
  }
  return context;
}

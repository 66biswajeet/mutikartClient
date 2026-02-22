"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for account cookie on mount
    const accountCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("account="));

    if (accountCookie) {
      try {
        const userData = JSON.parse(
          decodeURIComponent(accountCookie.split("=")[1])
        );
        setUser(userData);
      } catch (error) {
        console.error("Error parsing account cookie:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${ADMIN_API_URL}/api/customer/login`, {
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
        _id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        profile_image: data.data.profile_image,
        isCustomer: true,
      };
      setUser(userData);
    }

    return data;
  };

  const register = async (userData) => {
    const response = await fetch(`${ADMIN_API_URL}/api/customer/register`, {
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
      const userData = {
        _id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        profile_image: data.data.profile_image,
        isCustomer: true,
      };
      setUser(userData);
    }

    return data;
  };

  const logout = async () => {
    await fetch(`${ADMIN_API_URL}/api/customer/logout`, {
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
      login: async () => ({ success: false, message: 'No auth provider' }),
      register: async () => ({ success: false, message: 'No auth provider' }),
      logout: async () => {},
      isAuthenticated: false,
    };
  }
  return context;
}

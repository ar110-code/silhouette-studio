"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: "ADMIN" | "CUSTOMER") => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      if (json.success && json.data?.user) {
        setUser(json.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success && json.data?.user) {
        setUser(json.data.user);
        return { success: true, message: json.message || "با موفقیت وارد شدید" };
      } else {
        return {
          success: false,
          message: json.error?.message || "خطا در برقراری ارتباط و ورود",
        };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "خطای غیرمنتظره در سرور" };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const json = await res.json();
      if (json.success && json.data?.user) {
        setUser(json.data.user);
        return { success: true, message: json.message || "ثبت‌نام با موفقیت انجام شد" };
      } else {
        return {
          success: false,
          message: json.error?.message || "خطا در ثبت‌نام کاربر",
        };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "خطای سرور در فرایند ثبت‌نام" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  const quickDemoLogin = async (role: "ADMIN" | "CUSTOMER") => {
    if (role === "ADMIN") {
      return login("admin@silhouette.ir", "Admin@123456");
    } else {
      return login("client@karlancer.com", "Customer@123");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
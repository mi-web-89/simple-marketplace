"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@/lib/types/auth";
import { fetchClient } from "@/lib/fetch-client";
import { useToast } from "./toast-context";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const data = await fetchClient<{ user: User }>("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          module: "auth-context",
        });

        setUser(data.user);
        addToast("Login berhasil", "success");

        window.location.href = "/dashboard";
      } catch (err) {
        addToast(
          err instanceof Error ? err.message : "Login gagal",
          "error",
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addToast],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchClient("/api/auth/logout", {
        method: "POST",
        module: "auth-context",
      });
      setUser(null);
      addToast("Logout berhasil", "success");

      window.location.href = "/login";
    } catch {
      addToast("Gagal logout. Coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}

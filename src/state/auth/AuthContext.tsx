import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthState = {
  token: string | null;
  user: any;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  setAuth: (input: Partial<AuthState>) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage(): AuthState {
  if (typeof window === "undefined") {
    return { token: null, user: null, isAuthenticated: false };
  }
  const token = localStorage.getItem("authToken");
  const rawUser = localStorage.getItem("authUser");
  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }
  return { token, user, isAuthenticated: Boolean(token) };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => readStorage());

  useEffect(() => {
    const sync = () => setState(readStorage());
    window.addEventListener("storage", sync);
    window.addEventListener("auth:changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth:changed", sync as EventListener);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      setAuth(input) {
        if (input.token !== undefined) {
          if (input.token) localStorage.setItem("authToken", input.token);
          else localStorage.removeItem("authToken");
        }
        if (input.user !== undefined) {
          if (input.user) localStorage.setItem("authUser", JSON.stringify(input.user));
          else localStorage.removeItem("authUser");
        }
        window.dispatchEvent(new Event("auth:changed"));
        setState(readStorage());
      },
      clearAuth() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        window.dispatchEvent(new Event("auth:changed"));
        setState(readStorage());
      },
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

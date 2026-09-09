import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  pendingCreatePrompt: string | null;
  setPendingCreatePrompt: (prompt: string | null) => void;
  showAuth: boolean;
  setShowAuth: (val: boolean) => void;
  user: any;
  signOut: () => Promise<void>;
}

interface UIStateContextType {
  generatePrompt: string;
  setGeneratePrompt: (prompt: string) => void;
  toasts: Array<{ id: string; message: string; type?: "success" | "error" | "info" }>;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("gather_auth_user"));
  });
  const [pendingCreatePrompt, setPendingCreatePrompt] = useState<string | null>(() => {
    return localStorage.getItem("gather_pending_prompt") || null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [generatePrompt, setGeneratePrompt] = useState<string>("");
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: "success" | "error" | "info" }>>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        setIsSignedIn(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser(session.user);
        setIsSignedIn(true);
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsSignedIn(false);
    setUser(null);
  };

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        pendingCreatePrompt,
        setPendingCreatePrompt,
        showAuth,
        setShowAuth,
        user,
        signOut,
      }}
    >
      <UIStateContext.Provider
        value={{
          generatePrompt,
          setGeneratePrompt,
          toasts,
          addToast,
          removeToast,
        }}
      >
        {children}
      </UIStateContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  return context;
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error("useUIState must be used within an AppProvider");
  }
  return context;
}

export function useCurrentApplication() {
  return { currentApp: null, setCurrentApp: () => {} };
}

export function useApplications() {
  return { applications: [], setApplications: () => {} };
}

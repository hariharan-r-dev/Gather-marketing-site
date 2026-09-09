import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};

export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: {
        async signUp({ email, password, options }: any) {
          console.warn("[Gather Marketing] Standalone mode: Supabase URL/Key not configured. Using local session mock.");
          const mockUser = {
            id: "mock-user-" + Date.now(),
            email,
            user_metadata: options?.data || { name: email.split("@")[0] },
          };
          localStorage.setItem("gather_auth_user", JSON.stringify(mockUser));
          return { data: { user: mockUser, session: { user: mockUser } }, error: null };
        },
        async signInWithPassword({ email }: any) {
          console.warn("[Gather Marketing] Standalone mode: Supabase URL/Key not configured. Using local session mock.");
          const mockUser = {
            id: "mock-user-" + Date.now(),
            email,
            user_metadata: { name: email.split("@")[0] },
          };
          localStorage.setItem("gather_auth_user", JSON.stringify(mockUser));
          return { data: { user: mockUser, session: { user: mockUser } }, error: null };
        },
        async signOut() {
          localStorage.removeItem("gather_auth_user");
          return { error: null };
        },
        async getSession() {
          const userJson = localStorage.getItem("gather_auth_user");
          if (userJson) {
            try {
              const user = JSON.parse(userJson);
              return { data: { session: { user } }, error: null };
            } catch {}
          }
          return { data: { session: null }, error: null };
        },
        onAuthStateChange(callback: any) {
          return {
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
          };
        },
      },
    } as any);

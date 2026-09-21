import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  fetchAuthProfile,
  signInWithEmail,
  signOut as authSignOut,
  signUpWithEmail,
  type AuthProfile,
} from "../services/auth";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<{
    needsEmailConfirmation: boolean;
  }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    try {
      const nextProfile = await fetchAuthProfile(nextUser.id);
      setProfile(nextProfile);
    } catch (error) {
      console.error("[auth] falha ao carregar perfil", error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error("[auth] getSession", error);
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      await loadProfile(data.session?.user ?? null);
      if (mounted) {
        setIsLoading(false);
      }
    }

    void bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        void loadProfile(nextSession?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmail({ email, password });
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const { session: nextSession } = await signUpWithEmail({
        name,
        email,
        password,
      });
      return { needsEmailConfirmation: !nextSession };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authSignOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      session,
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

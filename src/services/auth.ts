import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type AuthProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: User | null; session: Session | null }> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        name: input.name.trim(),
      },
    },
  });

  if (error) {
    throw error;
  }

  return { user: data.user, session: data.session };
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<{ user: User; session: Session }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    throw error;
  }

  if (!data.user || !data.session) {
    throw new Error("Não foi possível iniciar a sessão.");
  }

  return { user: data.user, session: data.session };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function fetchAuthProfile(
  userId: string,
): Promise<AuthProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id as string,
    email: data.email as string,
    name: data.name as string,
    avatarUrl: (data.avatar_url as string | null) ?? null,
  };
}

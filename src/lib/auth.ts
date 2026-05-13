import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}

export async function signUpWithEmail(params: {
  email: string;
  password: string;
}) {
  return supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });
}

export async function signInWithEmail(params: {
  email: string;
  password: string;
}) {
  return supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function createUserProfile(profile: Database["public"]["Tables"]["profiles"]["Insert"]) {
  return supabase.from("profiles").insert(profile);
}

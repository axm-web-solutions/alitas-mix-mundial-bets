import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { MatchInsert } from "./worldcup";

export type MatchRow = Database["public"]["Tables"]["matches"]["Row"];

export async function loadSavedMatches(): Promise<MatchRow[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function countSavedMatches(): Promise<number> {
  const { count, error } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function syncMatches(remoteMatches: MatchInsert[]): Promise<MatchRow[]> {
  const { data, error } = await supabase
    .from("matches")
    .upsert(remoteMatches, { onConflict: ["team_a", "team_b", "match_date"] });

  if (error) {
    throw error;
  }

  return data ?? [];
}

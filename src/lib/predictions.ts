import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type PredictionRow = Database["public"]["Tables"]["predictions"]["Row"];
export type MatchRow = Database["public"]["Tables"]["matches"]["Row"];

export async function loadUserPredictions(userId: string): Promise<PredictionRow[]> {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function submitPrediction(
  matchId: string,
  scoreA: number,
  scoreB: number,
  userId: string,
): Promise<PredictionRow> {
  const { data, error } = await supabase
    .from("predictions")
    .insert([{ match_id: matchId, score_a: scoreA, score_b: scoreB, user_id: userId }]);

  if (error) {
    throw error;
  }

  return (data ?? [])[0];
}

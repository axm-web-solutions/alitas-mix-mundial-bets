import { useSupabaseAuth } from "@/lib/auth";
import { loadUserPredictions, submitPrediction } from "@/lib/predictions";
import { loadSavedMatches, syncMatches } from "@/lib/supabaseMatches";
import { fetchWorldCupMatches, getCountryFlagEmoji } from "@/lib/worldcup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type DisplayMatch = {
  team_a: string;
  team_b: string;
  match_date: string;
  flag_a?: string | null;
  flag_b?: string | null;
  status?: string | null;
};

function formatMatchDate(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderFlag(flag: string | null | undefined, team: string) {
  if (!flag) {
    return <span className="text-5xl">{getCountryFlagEmoji(team)}</span>;
  }

  return flag.startsWith("http") ? (
    <img
      src={flag}
      alt={`${team} flag`}
      className="h-12 w-16 rounded-xl object-cover shadow-sm"
    />
  ) : (
    <span className="text-5xl">{flag}</span>
  );
}

type PredictionMutation = ReturnType<
  typeof useMutation<
    unknown,
    unknown,
    { matchId: string; scoreA: number; scoreB: number }
  >
>;

type MatchPredictionFormProps = {
  match: {
    id: string;
    team_a: string;
    team_b: string;
  };
  submitMutation: PredictionMutation;
};

function MatchPredictionForm({ match, submitMutation }: MatchPredictionFormProps) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitMutation.mutateAsync({ matchId: match.id, scoreA, scoreB });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-background p-4">
      <div className="text-sm font-semibold text-foreground">Haz tu pronóstico:</div>
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-2 text-sm text-muted-foreground">
          {match.team_a}
          <input
            type="number"
            min={0}
            value={scoreA}
            onChange={(event) => setScoreA(Number(event.target.value))}
            className="w-full h-12 rounded-lg border border-input bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
        <label className="space-y-2 text-sm text-muted-foreground">
          {match.team_b}
          <input
            type="number"
            min={0}
            value={scoreB}
            onChange={(event) => setScoreB(Number(event.target.value))}
            className="w-full h-12 rounded-lg border border-input bg-background px-4 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitMutation.isLoading}
        className="w-full h-12 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {submitMutation.isLoading ? "Enviando pronóstico..." : "Enviar pronóstico"}
      </button>
      {submitMutation.error ? (
        <p className="text-xs text-destructive">{String(submitMutation.error)}</p>
      ) : null}
    </form>
  );
}

function Dashboard() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const queryClient = useQueryClient();

  const {
    data: matches,
    error: matchesError,
    isLoading: matchesLoading,
  } = useQuery<ReturnType<typeof loadSavedMatches> extends Promise<infer T> ? T : never>({
    queryKey: ["saved-matches"],
    queryFn: loadSavedMatches,
    enabled: hasSupabase,
    staleTime: 1000 * 60,
  });

  const {
    data: predictions,
    error: predictionsError,
    isLoading: predictionsLoading,
  } = useQuery<ReturnType<typeof loadUserPredictions> extends Promise<infer T> ? T : never>(
    {
      queryKey: ["user-predictions", user?.id],
      queryFn: () => (user ? loadUserPredictions(user.id) : Promise.resolve([])),
      enabled: Boolean(user && hasSupabase),
      staleTime: 1000 * 60,
    },
  );

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!hasSupabase) {
        throw new Error("Supabase no está configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.");
      }

      const remoteMatches = await fetchWorldCupMatches();
      return await syncMatches(remoteMatches);
    },
    onSuccess: () => queryClient.invalidateQueries(["saved-matches"]),
  });

  const submitMutation = useMutation({
    mutationFn: async ({ matchId, scoreA, scoreB }: { matchId: string; scoreA: number; scoreB: number }) => {
      if (!user) {
        throw new Error("Debes iniciar sesión para pronosticar.");
      }
      return submitPrediction(matchId, scoreA, scoreB, user.id);
    },
    onSuccess: () => queryClient.invalidateQueries(["user-predictions", user?.id]),
  });

  const hasMatches = Array.isArray(matches) && matches.length > 0;
  const hasUserPredictions = Array.isArray(predictions) && predictions.length > 0;

  const getPredictionForMatch = (matchId: string) => predictions?.find((prediction) => prediction.match_id === matchId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic text-foreground">
            Programación <span className="text-primary">del Mundial</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Esta vista carga partidos desde un API público. Si configuras Supabase, también podrás guardarlos.
          </p>
        </div>

        <button
          type="button"
          disabled={!hasSupabase || syncMutation.isLoading}
          onClick={() => syncMutation.mutate()}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-xl transition hover:bg-primary/90 disabled:opacity-60"
        >
          {hasSupabase ? (syncMutation.isLoading ? "Sincronizando..." : "Sincronizar programación") : "Configura Supabase para guardar"}
        </button>
      </div>

      {matchesError || predictionsError ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-semibold">No se pudo cargar la programación o tus pronósticos.</p>
          <p>{matchesError?.message ?? predictionsError?.message}</p>
        </div>
      ) : null}

      {!hasMatches && !matchesLoading ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-xl font-bold text-foreground">Aún no hay partidos disponibles</p>
          <p className="mt-3 text-muted-foreground">
            Sincroniza los partidos con Supabase para poder pronosticar.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {(matchesLoading || authLoading || predictionsLoading) ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl bg-card p-6 h-72" />
          ))
        ) : (
          matches?.map((match, index) => {
            const userPrediction = match.id ? getPredictionForMatch(match.id) : undefined;
            const isFinished = match.status === "finished";
            return (
              <div key={match.id ?? `${match.team_a}-${match.team_b}-${index}`} className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/10">
                <div className="bg-muted px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
                  {formatMatchDate(match.match_date)}
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-3">
                      {renderFlag(match.flag_a, match.team_a)}
                      <span className="font-bold text-foreground text-sm uppercase text-center">{match.team_a}</span>
                    </div>
                    <div className="text-xl font-black text-muted-foreground italic">VS</div>
                    <div className="flex flex-col items-center gap-3">
                      {renderFlag(match.flag_b, match.team_b)}
                      <span className="font-bold text-foreground text-sm uppercase text-center">{match.team_b}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-background p-4 text-center text-sm text-muted-foreground">
                    Estado: <span className="font-semibold text-foreground">{isFinished ? "Finalizado" : "Pendiente"}</span>
                  </div>

                  {userPrediction ? (
                    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                      <p className="font-semibold">Pronóstico registrado</p>
                      <p className="mt-2">Resultado: {match.team_a} {userPrediction.score_a} - {userPrediction.score_b} {match.team_b}</p>
                      <p className="mt-1 text-xs text-muted-foreground">No puedes modificar este pronóstico.</p>
                    </div>
                  ) : isFinished ? (
                    <div className="rounded-3xl border border-border bg-background p-4 text-sm text-muted-foreground">
                      Este partido ya terminó y no puedes pronosticar.
                    </div>
                  ) : (
                    <MatchPredictionForm
                      match={match}
                      submitMutation={submitMutation}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <p>Para pronosticar necesitas iniciar sesión y sincronizar los partidos desde el botón de arriba.</p>
        {hasUserPredictions ? (
          <p className="mt-2 text-foreground">Ya has enviado {predictions?.length ?? 0} pronostic{predictions?.length === 1 ? "o" : "os"}.</p>
        ) : null}
      </div>
    </div>
  );
}

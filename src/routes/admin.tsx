import { countSavedMatches, syncMatches } from "@/lib/supabaseMatches";
import { fetchWorldCupMatches } from "@/lib/worldcup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const queryClient = useQueryClient();
  const {
    data: matchCount,
    error,
    isLoading,
  } = useQuery<number>({
    queryKey: ["match-count"],
    queryFn: countSavedMatches,
    staleTime: 1000 * 60,
    enabled: hasSupabase,
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!hasSupabase) {
        throw new Error("Supabase no está configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.");
      }
      const remoteMatches = await fetchWorldCupMatches();
      return syncMatches(remoteMatches);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["match-count"]);
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic text-foreground">
            PANEL <span className="text-primary">ADMINISTRATIVO</span>
          </h1>
          <p className="text-muted-foreground mt-2">Carga el calendario oficial y controla los partidos registrados en Supabase.</p>
        </div>
        <button
          type="button"
          disabled={!hasSupabase || syncMutation.isLoading}
          onClick={() => syncMutation.mutate()}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-xl transition hover:bg-primary/90 disabled:opacity-60"
        >
          {syncMutation.isLoading
            ? "Sincronizando..."
            : hasSupabase
            ? "Sincronizar partidos"
            : "Configura Supabase para usar"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Partidos guardados</div>
          <div className="mt-4 text-4xl font-black text-foreground">{isLoading ? "..." : matchCount ?? 0}</div>
          <div className="mt-2 text-sm text-muted-foreground">Partidos cargados en la tabla de Supabase</div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Estado de sincronización</div>
          <div className="mt-4 text-4xl font-black text-primary">
            {syncMutation.isLoading ? "Sincronizando" : syncMutation.isSuccess ? "Actualizado" : "Listo"}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Usa el botón para traer la programación oficial y guardarla directamente en Supabase.
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
          <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Acciones</div>
          <div className="mt-4 text-sm text-foreground">
            {syncMutation.isError ? (
              <p className="text-sm text-destructive">Error: {syncMutation.error instanceof Error ? syncMutation.error.message : "No se pudo sincronizar."}</p>
            ) : (
              <p>La sincronización de partidos usa la API de fútbol y luego persiste los datos en Supabase.</p>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-semibold">No se pudo cargar el conteo de partidos.</p>
          <p>{error.message}</p>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Guía rápida</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>1. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.</li>
            <li>2. Registra tu clave en `VITE_FOOTBALL_DATA_API_KEY`.</li>
            <li>3. Presiona "Sincronizar partidos" para importar la programación.</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Notas</h2>
          <p className="text-sm text-muted-foreground">
            Si quieres usar otra API, cambia `VITE_FOOTBALL_DATA_API_URL` en tu entorno. La app intentará traer los partidos y guardarlos en Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}

import { createUserProfile, signInWithEmail, signUpWithEmail, useSupabaseAuth } from "@/lib/auth";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [idType, setIdType] = useState("Cédula de Ciudadanía");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error: loginError } = await signInWithEmail({ email, password });
        if (loginError) throw loginError;
        router.navigate({ to: "/dashboard" });
        return;
      }

      const { data, error: signUpError } = await signUpWithEmail({ email, password });
      if (signUpError) throw signUpError;

      if (data?.user?.id) {
        const { error: profileError } = await createUserProfile({
          id: data.user.id,
          name,
          email,
          id_type: idType,
          id_number: idNumber,
        });

        if (profileError) {
          throw profileError;
        }
      }

      router.navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-lg bg-card p-8 rounded-2xl border border-border shadow-2xl text-center">
          <h1 className="text-3xl font-black text-foreground mb-4">Ya estás conectado</h1>
          <p className="text-muted-foreground">Puedes ir al dashboard para comenzar a pronosticar.</p>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/dashboard" })}
            className="mt-8 inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-lg bg-card p-8 rounded-2xl border border-border shadow-2xl animate-scale-in relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="text-center mb-6 relative z-10">
          <h1 className="text-3xl font-black text-foreground uppercase italic tracking-tight">
            {mode === "login" ? "Bienvenido de nuevo" : "Únete a la Polla"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "login" ? "Ingresa con tu correo para empezar a pronosticar." : "Crea tu cuenta y participa en el Mundial."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "register" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground border border-input"
            }`}
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground border border-input"
            }`}
          >
            Iniciar sesión
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {mode === "register" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Nombre Completo</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Tipo de ID</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                  >
                    <option>Cédula de Ciudadanía</option>
                    <option>Tarjeta de Identidad</option>
                    <option>Cédula de Extranjería</option>
                    <option>Pasaporte</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Número de ID</label>
                  <input
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    type="text"
                    placeholder="1020304050"
                    className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Correo Electrónico</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="juan@ejemplo.com"
              className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Contraseña</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {error ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (mode === "login" ? "Iniciando sesión..." : "Registrando...") : mode === "login" ? "Ingresar" : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}

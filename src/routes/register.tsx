import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Registro exitoso! (Mock)");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-lg bg-card p-8 rounded-2xl border border-border shadow-2xl animate-scale-in relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-black text-foreground uppercase italic tracking-tight">
            Únete a la <span className="text-primary">Polla</span>
          </h1>
          <p className="text-muted-foreground mt-2">Ingresa tus datos para empezar a pronosticar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Nombre Completo</label>
            <input
              required
              type="text"
              placeholder="Ej: Juan Pérez"
              className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Tipo de ID</label>
              <select className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
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
                type="text"
                placeholder="1020304050"
                className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Correo Electrónico</label>
            <input
              required
              type="email"
              placeholder="juan@ejemplo.com"
              className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Contraseña</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}

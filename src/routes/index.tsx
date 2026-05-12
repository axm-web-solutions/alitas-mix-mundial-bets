import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

// Componente para animar números de registro
function RegistrationsTicker() {
  const [count, setCount] = useState(1204);
  const [recentUsers, setRecentUsers] = useState([
    "Carlos R. - 10**89",
    "Maria P. - 11**34",
    "Juan D. - 10**11",
    "Andrea M. - 12**55",
    "Felipe G. - 10**00",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
      // Simulate new user
      const names = ["Luis", "Ana", "Jorge", "Laura", "Pedro"];
      const letters = ["A.", "B.", "C.", "D.", "E."];
      const randomName = `${names[Math.floor(Math.random() * names.length)]} ${letters[Math.floor(Math.random() * letters.length)]}`;
      const randomId = `1${Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 9)}**${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
      
      setRecentUsers((prev) => [
        `${randomName} - ${randomId}`,
        ...prev.slice(0, 4),
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card py-4 shadow-lg border-y border-border">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold text-foreground">
            <span className="text-primary text-xl">{count}</span> participantes registrados
          </span>
        </div>
        
        <div className="overflow-hidden w-full md:w-1/2 h-8 relative relative">
          <div className="absolute top-0 flex flex-col transition-transform duration-500 ease-in-out">
            {recentUsers.map((user, i) => (
              <div key={i} className="h-8 flex items-center text-sm text-muted-foreground animate-fade-in">
                Nuevo registro: <span className="font-semibold text-foreground ml-2">{user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src={heroBanner}
          alt="Alitas Mix Betting Pool"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 container px-4 mx-auto text-center space-y-6 animate-fade-in">
          <div className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/30 mb-4 animate-bounce">
            🔥 ¡LA POLLA MUNDIALISTA OFICIAL!
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground uppercase italic drop-shadow-lg">
            Pronostica y <span className="text-primary">Gana</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium">
            Únete a la Polla Alitas Mix, demuestra cuánto sabes de fútbol y compite por premios espectaculares. ¡Tu pasión tiene recompensa!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-primary/25"
            >
              ¡Registrarme Ahora!
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 text-lg font-bold text-primary transition-all hover:bg-primary/10 hover:scale-105"
            >
              Ver Partidos
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker de Registros */}
      <RegistrationsTicker />

      {/* Premios Section */}
      <section className="w-full py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-foreground uppercase italic">Premios Increíbles</h2>
            <p className="text-muted-foreground text-lg">Los mejores pronosticadores se llevan todo esto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col items-center text-center space-y-4 shadow-xl transition-transform hover:-translate-y-2 hover:shadow-primary/20">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-4xl">
                🥇
              </div>
              <h3 className="text-2xl font-bold text-foreground">1er Puesto</h3>
              <p className="text-muted-foreground">Consola de última generación + 1 Año de Alitas Gratis</p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col items-center text-center space-y-4 shadow-xl transition-transform hover:-translate-y-2 hover:shadow-primary/20 relative md:-mt-8">
              <div className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                GRAN PREMIO
              </div>
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-5xl">
                🏆
              </div>
              <h3 className="text-3xl font-black text-primary">Pozo Acumulado</h3>
              <p className="text-foreground font-medium">Bono en efectivo gigante para el mejor del torneo</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col items-center text-center space-y-4 shadow-xl transition-transform hover:-translate-y-2 hover:shadow-primary/20">
              <div className="w-20 h-20 bg-gray-400/20 rounded-full flex items-center justify-center text-4xl">
                🥈
              </div>
              <h3 className="text-2xl font-bold text-foreground">2do Puesto</h3>
              <p className="text-muted-foreground">TV 65" 4K + Bonos de consumo Alitas Mix</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor / Footer */}
      <footer className="w-full bg-card py-12 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-primary italic mb-4">ALITAS MIX</h2>
          <p className="text-muted-foreground text-sm">El sabor oficial del mundial.</p>
        </div>
      </footer>
    </div>
  );
}

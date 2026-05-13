import heroBanner from "@/assets/hero-banner.jpg";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function ParticipantsLiveCard() {
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
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
      const names = ["Luis", "Ana", "Jorge", "Laura", "Pedro"];
      const letters = ["A.", "B.", "C.", "D.", "E."];
      const randomName = `${names[Math.floor(Math.random() * names.length)]} ${letters[Math.floor(Math.random() * letters.length)]}`;
      const randomId = `1${Math.floor(Math.random() * 2)}${Math.floor(Math.random() * 9)}**${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
      setRecentUsers((prev) => [
        `${randomName} - ${randomId}`,
        ...prev.slice(0, 4),
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl text-white">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-200/80">Participantes activos</p>
          <p className="mt-2 text-5xl font-black">{count.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl bg-primary/15 px-4 py-3 text-primary font-semibold">Top Live</div>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-background/80 p-4">
          <p className="text-sm text-slate-200/80">Próximo partido</p>
          <p className="mt-1 font-semibold">Argentina vs Brasil</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-background/80 p-4">
          <p className="text-sm text-slate-200/80">Partido más votado</p>
          <p className="mt-1 font-semibold">Argentina vs Brasil</p>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-background/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-200/60 mb-3">Últimos registros</p>
        <div className="space-y-2 text-sm text-slate-100">
          {recentUsers.slice(0, 3).map((user, index) => (
            <p key={index}>+ {user}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-[68vh] overflow-hidden">
        <img
          src={heroBanner}
          alt="Alitas Mix Betting Pool"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_35%)]" />
        <div className="relative z-10 container px-4 mx-auto grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-center py-16">
          <div className="space-y-6 text-center lg:text-left">
              <div className="inline-block rounded-full bg-primary/20 px-5 py-2 text-sm font-semibold text-primary border border-primary/30 uppercase tracking-[0.18em] shadow-sm">
              Polla Mundialista 2026
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black uppercase leading-tight text-white tracking-tight drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]">
              Predice, compite y gana con el sabor del Mundial
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg text-slate-200/90 leading-relaxed">
              Únete a la experiencia Alitas Mix y vive el Mundial con premios exclusivos, combos especiales y una competencia diseñada para los fanáticos del fútbol.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105"
              >
                ¡Inscríbete ya!
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-lg font-bold text-white transition-all hover:bg-white/20 hover:scale-105"
              >
                Ver partidos
              </Link>
            </div>
          </div>

          <ParticipantsLiveCard />
        </div>
      </section>

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
                🍗
              </div>
              <h3 className="text-2xl font-bold text-foreground">Combo Familiar</h3>
              <p className="text-muted-foreground">8 alitas + 4 bebidas + papas + descuento especial para compartir.</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col items-center text-center space-y-4 shadow-xl transition-transform hover:-translate-y-2 hover:shadow-primary/20 relative md:-mt-8">
              <div className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                COMBO DUO
              </div>
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-5xl">
                🥂
              </div>
              <h3 className="text-3xl font-black text-primary">Combo Duo</h3>
              <p className="text-foreground font-medium">4 alitas + 2 bebidas + papas para la dupla campeona.</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border flex flex-col items-center text-center space-y-4 shadow-xl transition-transform hover:-translate-y-2 hover:shadow-primary/20">
              <div className="w-20 h-20 bg-gray-400/20 rounded-full flex items-center justify-center text-4xl">
                🧉
              </div>
              <h3 className="text-2xl font-bold text-foreground">Combo Individual</h3>
              <p className="text-muted-foreground">2 alitas + 1 bebida + papas para el fanático que juega solo.</p>
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

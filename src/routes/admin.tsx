import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const stats = [
  { label: "Usuarios Registrados", value: "1,204", change: "+12% hoy", icon: "👥" },
  { label: "Pronósticos Hoy", value: "847", change: "+34%", icon: "⚽" },
  { label: "Partidos Activos", value: "16", change: "Esta semana", icon: "🏆" },
  { label: "Premios Entregados", value: "$2.4M", change: "Este mes", icon: "💰" },
];

const topMatches = [
  { match: "Colombia vs Brasil", bets: 542, percent: 95 },
  { match: "Argentina vs Uruguay", bets: 478, percent: 84 },
  { match: "España vs Francia", bets: 412, percent: 72 },
  { match: "Alemania vs Inglaterra", bets: 389, percent: 68 },
  { match: "Ecuador vs Chile", bets: 256, percent: 45 },
];

function Admin() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic text-foreground">
            PANEL <span className="text-primary">ADMINISTRATIVO</span>
          </h1>
          <p className="text-muted-foreground mt-2">Gestiona y monitorea la polla mundialista</p>
        </div>
        <select className="h-10 px-4 bg-card border border-border rounded-lg text-foreground">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Todo el tiempo</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:border-primary/50 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-black text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-primary font-semibold mt-2">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Top Apostados */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Top Partidos Apostados</h2>
          <div className="space-y-3">
            {topMatches.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{m.match}</span>
                  <span className="text-muted-foreground">{m.bets} apuestas</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Registros Recientes</h2>
          <div className="space-y-3">
            {[
              { name: "Carlos R.", id: "10**89", time: "Hace 2 min" },
              { name: "Maria P.", id: "11**34", time: "Hace 5 min" },
              { name: "Juan D.", id: "10**11", time: "Hace 8 min" },
              { name: "Andrea M.", id: "12**55", time: "Hace 15 min" },
              { name: "Felipe G.", id: "10**00", time: "Hace 22 min" },
            ].map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{u.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {u.id}</div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{u.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

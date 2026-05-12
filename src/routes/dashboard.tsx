import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const mockMatches = [
  { id: 1, teamA: "Colombia", teamB: "Brasil", flagA: "🇨🇴", flagB: "🇧🇷", date: "Hoy, 7:00 PM", status: "pending" },
  { id: 2, teamA: "Argentina", teamB: "Uruguay", flagA: "🇦🇷", flagB: "🇺🇾", date: "Mañana, 5:00 PM", status: "pending" },
  { id: 3, teamA: "Ecuador", teamB: "Chile", flagA: "🇪🇨", flagB: "🇨🇱", date: "Jueves, 4:00 PM", status: "pending" },
];

function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black italic text-foreground">
          TUS <span className="text-primary">PRONÓSTICOS</span>
        </h1>
        <p className="text-muted-foreground mt-2">Ingresa tus resultados antes de que inicie el partido.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockMatches.map((match) => (
          <div key={match.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-all animate-fade-in">
            <div className="bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground text-center border-b border-border">
              {match.date}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">{match.flagA}</span>
                  <span className="font-bold text-foreground text-sm uppercase">{match.teamA}</span>
                </div>
                <div className="text-xl font-black text-muted-foreground italic">VS</div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">{match.flagB}</span>
                  <span className="font-bold text-foreground text-sm uppercase">{match.teamB}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <input 
                  type="number" 
                  min="0" 
                  className="w-16 h-14 text-center text-2xl font-black bg-background border border-input rounded-lg focus:border-primary outline-none" 
                  placeholder="-"
                />
                <span className="text-muted-foreground">-</span>
                <input 
                  type="number" 
                  min="0" 
                  className="w-16 h-14 text-center text-2xl font-black bg-background border border-input rounded-lg focus:border-primary outline-none" 
                  placeholder="-"
                />
              </div>
              
              <button className="w-full mt-6 h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-lg transition-colors">
                Guardar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

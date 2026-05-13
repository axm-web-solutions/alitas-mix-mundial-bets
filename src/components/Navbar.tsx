import alitasLogo from "@/assets/alitas-logo.svg";
import { signOut, useSupabaseAuth } from "@/lib/auth";
import { Link, useRouter } from "@tanstack/react-router";

export function Navbar() {
  const { user } = useSupabaseAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={alitasLogo} alt="Alitas Mix" className="h-10 w-auto" />
          <div className="flex flex-col leading-[1]">
            <span className="text-lg font-black text-primary italic tracking-tighter">
              ALITAS MIX
            </span>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              La polla mundialista
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Admin
          </Link>
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              to="/register"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Registrarse
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

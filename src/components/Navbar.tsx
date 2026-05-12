import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary italic tracking-tighter">
            ALITAS MIX
          </span>
          <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
            POLLA
          </span>
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
          <Link
            to="/register"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  );
}

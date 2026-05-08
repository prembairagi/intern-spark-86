import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, logout } = useAuth();
  return (
    <header className="glass sticky top-0 z-40 w-full border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Briefcase className="h-5 w-5" />
          </span>
          InternHub
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/internships" className="hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            Internships
          </Link>
          <Link to="/" hash="for-companies" className="hover:text-foreground">
            For companies
          </Link>
          <Link to="/" hash="how-it-works" className="hover:text-foreground">
            How it works
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

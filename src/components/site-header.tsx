import { Link } from "@tanstack/react-router";
import { Briefcase, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass sticky top-0 z-40 w-full border-b border-border/60 transition-shadow duration-300 ${
        scrolled ? "scroll-shadow" : ""
      }`}
    >
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
        <div className="hidden items-center gap-2 md:flex">
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
        <button
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-card md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm">
            <Link to="/internships" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">Internships</Link>
            <Link to="/" hash="for-companies" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">For companies</Link>
            <Link to="/" hash="how-it-works" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">How it works</Link>
            <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
              {user ? (
                <>
                  <Button asChild size="sm" className="flex-1"><Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { logout(); setOpen(false); }}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/login" onClick={() => setOpen(false)}>Sign in</Link></Button>
                  <Button asChild size="sm" className="flex-1"><Link to="/register" onClick={() => setOpen(false)}>Get started</Link></Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

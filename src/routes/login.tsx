import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — InternHub" },
      { name: "description", content: "Sign in to your InternHub account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    const u = login(email.trim(), password);
    if (!u) {
      setError("Invalid credentials. Try one of the demo accounts below.");
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const fill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)]" />
        <div className="animate-scale-in w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-elevated)]">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-semibold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to continue to InternHub.</p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="hover-lift w-full">Sign in</Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            New here? <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
          </div>
          <div className="mt-6 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs">
            <div className="mb-1 font-medium text-foreground">Try a demo account:</div>
            <div className="grid gap-1">
              <button type="button" onClick={() => fill("priya@student.edu", "student123")} className="text-left hover:text-primary">
                Student → priya@student.edu / student123
              </button>
              <button type="button" onClick={() => fill("hr@nimbusworks.com", "company123")} className="text-left hover:text-primary">
                Company → hr@nimbusworks.com / company123
              </button>
              <button type="button" onClick={() => fill("admin@portal.com", "admin123")} className="text-left hover:text-primary">
                Admin → admin@portal.com / admin123
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

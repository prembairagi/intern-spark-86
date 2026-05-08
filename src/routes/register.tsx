import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import type { Role } from "@/lib/data";
import { GraduationCap, Building2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — InternHub" },
      { name: "description", content: "Sign up as a student or company on InternHub." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    industry: "",
    university: "",
    degree: "",
  });
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const res = register({
      name: form.name,
      email: form.email.trim(),
      password: form.password,
      role,
      extra: {
        companyName: form.companyName,
        industry: form.industry,
        university: form.university,
        degree: form.degree,
      },
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-elevated)]">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Pick the role that fits you best.</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {(
              [
                { v: "student", label: "Student", icon: GraduationCap },
                { v: "company", label: "Company", icon: Building2 },
              ] as const
            ).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setRole(opt.v)}
                className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition ${
                  role === opt.v
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <opt.icon className="h-5 w-5 text-primary" />
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className="text-xs text-muted-foreground">
                  {opt.v === "student" ? "Apply to internships" : "Post and manage roles"}
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={form.name} onChange={update("name")} required />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={update("email")} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={update("password")} required />
            </div>

            {role === "student" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>University</Label>
                  <Input value={form.university} onChange={update("university")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Degree</Label>
                  <Input value={form.degree} onChange={update("degree")} />
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Company name</Label>
                  <Input value={form.companyName} onChange={update("companyName")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Input value={form.industry} onChange={update("industry")} />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">Create account</Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

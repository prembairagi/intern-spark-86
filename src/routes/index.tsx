import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, GraduationCap, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternHub — Internship Management Portal" },
      {
        name: "description",
        content:
          "Discover internships, post roles, and manage applications in one polished portal for students, companies, and admins.",
      },
      { property: "og:title", content: "InternHub — Internship Management Portal" },
      {
        property: "og:description",
        content:
          "Discover internships, post roles, and manage applications in one polished portal.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.12),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="max-w-3xl text-primary-foreground animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Built for students, companies and campus admins
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Internships, organized<br />end-to-end.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-primary-foreground/90">
                InternHub is a complete portal for posting internships, applying to roles, and
                tracking every application. Role-based dashboards keep students, companies, and
                admins focused on what matters.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-slide-up">
                <Button asChild size="lg" variant="secondary" className="hover-lift shadow-lg">
                  <Link to="/internships">
                    Browse internships <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="hover-lift border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"
                >
                  <Link to="/register">Create an account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">One portal, three workflows</h2>
            <p className="mt-2 text-muted-foreground">
              Each role gets a dedicated dashboard, designed around their daily tasks.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                desc: "Browse roles, filter by stipend or domain, upload your resume, and track every application status.",
              },
              {
                icon: Building2,
                title: "Companies",
                desc: "Post internships, review applicants, shortlist candidates, and manage hiring pipelines.",
              },
              {
                icon: ShieldCheck,
                title: "Admins",
                desc: "Approve companies, monitor activity, manage listings, and view portal-wide analytics.",
              },
            ].map((r, idx) => (
              <div
                key={r.title}
                className="hover-lift group rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent text-primary transition-transform group-hover:scale-110">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For companies */}
        <section
          id="for-companies"
          className="border-y border-border/60 bg-card/60 py-20"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <Briefcase className="h-3.5 w-3.5" /> For companies
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Hire interns without the spreadsheet chaos.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Publish polished internship posts, get a structured pipeline of applicants, and
                update statuses in one click. New companies are reviewed by admins before going live
                to keep the marketplace high quality.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link to="/register">Post an internship</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/internships">See live roles</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "120+", v: "Active internships" },
                { k: "3,200", v: "Student profiles" },
                { k: "94%", v: "Application response" },
                { k: "48 hrs", v: "Avg. time to shortlist" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-xl border border-border/60 bg-background p-5 shadow-[var(--shadow-soft)]"
                >
                  <div className="text-2xl font-semibold">{s.k}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to get started?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Create your account in under a minute. Pick a role and get a dashboard built for you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/register">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

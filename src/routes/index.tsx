import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Building2,
  ShieldCheck,
  Sparkles,
  Search,
  UserPlus,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternHub – Internship Management Portal" },
      {
        name: "description",
        content:
          "A role-based internship portal for students, companies, and admins. Browse internships, manage applications, and track hiring pipelines.",
      },
      { property: "og:title", content: "InternHub – Internship Management Portal" },
      {
        property: "og:description",
        content:
          "A role-based internship portal for students, companies, and admins.",
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
        <section className="hero-gradient relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-3xl text-center animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Built for students, companies and campus admins
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Find Your Perfect <span className="gradient-text">Internship</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
                The smarter way for students to land roles and for companies to hire interns — all in one polished portal.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 animate-slide-up">
                <Button asChild size="lg" className="hover-lift shadow-lg">
                  <Link to="/internships">
                    Browse Internships <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="hover-lift">
                  <Link to="/register">Post an Internship</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
        </section>

        {/* Roles */}
        <section id="how-it-works" className="bg-muted/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-semibold tracking-tight">One portal, three workflows</h2>
              <p className="mt-2 text-muted-foreground">
                Each role gets a dedicated dashboard, designed around their daily tasks.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                  className="group rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[var(--shadow-elevated)] animate-slide-up"
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
          </div>
        </section>

        {/* How it works (numbered steps) */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-2 text-muted-foreground">Get started in three simple steps.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: 1, icon: UserPlus, title: "Create your account", desc: "Sign up as a student, company, or admin in under a minute." },
              { n: 2, icon: Search, title: "Browse or post roles", desc: "Discover internships that match, or publish a polished posting." },
              { n: 3, icon: Send, title: "Apply & track", desc: "Send applications and follow every status update in real time." },
            ].map((s, idx) => (
              <div
                key={s.n}
                className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md">
                  {s.n}
                </div>
                <div className="mb-3 mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For companies */}
        <section id="for-companies" className="border-y border-border/60 bg-card/60 py-20">
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
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="hover-lift">
                  <Link to="/register">Post an internship</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="hover-lift">
                  <Link to="/internships">See live roles</Link>
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Portal stats
                </span>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Demo data
                </span>
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
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to get started?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Create your account in under a minute. Pick a role and get a dashboard built for you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg" className="hover-lift">
              <Link to="/register">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hover-lift">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

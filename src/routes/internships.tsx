import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useDb } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, IndianRupee, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Browse internships — InternHub" },
      { name: "description", content: "Filter and apply to internships across domains and locations." },
    ],
  }),
  component: InternshipsPage,
});

function InternshipsPage() {
  const data = useDb();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("all");
  const [mode, setMode] = useState("all");
  const [minStipend, setMinStipend] = useState("");

  const domains = useMemo(
    () => Array.from(new Set(data.internships.map((i) => i.domain))),
    [data.internships],
  );

  const filtered = data.internships.filter((i) => {
    if (!i.active) return false;
    if (q && !`${i.title} ${i.companyName} ${i.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (domain !== "all" && i.domain !== domain) return false;
    if (mode !== "all" && i.mode !== mode) return false;
    if (minStipend && i.stipend < Number(minStipend)) return false;
    return true;
  });

  const Wrapper = user ? PlainWrapper : PublicWrapper;

  return (
    <Wrapper>
      <PageHeader
        title="Find your next internship"
        description={`${filtered.length} active roles across ${domains.length} domains`}
      />

      <div className="mb-6 grid gap-3 rounded-xl border border-border/60 bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5 lg:col-span-2">
          <Label className="text-xs"><Filter className="mr-1 inline h-3 w-3" />Search</Label>
          <Input placeholder="Title, company or location" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Domain</Label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              {domains.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="On-site">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Min stipend</Label>
          <Input type="number" placeholder="0" value={minStipend} onChange={(e) => setMinStipend(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matches" description="Try clearing some filters to see more roles." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i, idx) => (
            <article
              key={i.id}
              className="hover-lift group flex flex-col rounded-xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] animate-fade-in"
              style={{ animationDelay: `${Math.min(idx, 8) * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{i.companyName}</div>
                  <h3 className="mt-1 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">{i.title}</h3>
                </div>
                <Badge variant="secondary">{i.domain}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{i.location}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{i.durationWeeks} weeks</span>
                <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" />{i.stipend.toLocaleString()}/mo</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{i.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <Badge variant="outline">{i.mode}</Badge>
                <Button asChild size="sm" className="hover-lift">
                  <Link to="/internships/$id" params={{ id: i.id }}>View role</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Wrapper>
  );
}

function PublicWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}

function PlainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

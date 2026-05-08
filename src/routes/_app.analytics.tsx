import { createFileRoute } from "@tanstack/react-router";
import { useDb } from "@/lib/auth";
import { PageHeader, StatCard } from "@/components/ui-bits";
import { Briefcase, Users, FileText, Building2 } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const data = useDb();

  const byDomain = data.internships.reduce<Record<string, number>>((acc, i) => {
    acc[i.domain] = (acc[i.domain] ?? 0) + 1;
    return acc;
  }, {});
  const byStatus = data.applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});
  const maxDomain = Math.max(1, ...Object.values(byDomain));
  const maxStatus = Math.max(1, ...Object.values(byStatus));

  return (
    <div>
      <PageHeader title="Portal analytics" description="Live snapshot of activity across the portal." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Internships" value={data.internships.length} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Applications" value={data.applications.length} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Companies" value={data.companyProfiles.length} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Students" value={data.studentProfiles.length} icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border/60 bg-card p-5">
          <h2 className="mb-4 font-semibold">Internships by domain</h2>
          <ul className="space-y-3">
            {Object.entries(byDomain).map(([domain, n]) => (
              <li key={domain}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{domain}</span>
                  <span className="text-muted-foreground">{n}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${(n / maxDomain) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border/60 bg-card p-5">
          <h2 className="mb-4 font-semibold">Applications by status</h2>
          <ul className="space-y-3">
            {Object.entries(byStatus).map(([status, n]) => (
              <li key={status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="capitalize">{status.replace("_", " ")}</span>
                  <span className="text-muted-foreground">{n}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-info" style={{ width: `${(n / maxStatus) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

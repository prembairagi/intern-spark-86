import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useDb } from "@/lib/auth";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-bits";
import { StatusBadge, CompanyStatusBadge } from "@/components/status-badge";
import { Briefcase, FileText, Users, Building2, BarChart3, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const data = useDb();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "student") return <StudentDashboard userId={user.id} data={data} />;
  if (user.role === "company") return <CompanyDashboard userId={user.id} data={data} />;
  return <AdminDashboard data={data} />;
}

function StudentDashboard({ userId, data }: { userId: string; data: ReturnType<typeof useDb> }) {
  const apps = data.applications.filter((a) => a.studentId === userId);
  const recent = useMemo(
    () => [...data.internships].sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt)).slice(0, 4),
    [data.internships],
  );
  const unread = data.notifications.filter((n) => n.userId === userId && !n.read).length;

  return (
    <div>
      <PageHeader
        title="Welcome back"
        description="Here's a quick view of your internship search."
        actions={
          <Button asChild>
            <Link to="/internships">Browse internships</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={apps.length} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Shortlisted" value={apps.filter((a) => a.status === "shortlisted").length} />
        <StatCard label="Open internships" value={data.internships.filter((i) => i.active).length} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Unread notifications" value={unread} icon={<Bell className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent applications</h2>
            <Link to="/applications" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {apps.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Browse internships and apply in a couple of clicks."
              action={<Button asChild><Link to="/internships">Find a role</Link></Button>}
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {apps.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{a.internshipTitle}</div>
                    <div className="text-xs text-muted-foreground">{a.companyName}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent internships</h2>
            <Link to="/internships" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-border/60">
            {recent.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <Link to="/internships/$id" params={{ id: i.id }} className="font-medium hover:text-primary">
                    {i.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {i.companyName} · {i.location} · {i.mode}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/internships/$id" params={{ id: i.id }}>View</Link>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function CompanyDashboard({ userId, data }: { userId: string; data: ReturnType<typeof useDb> }) {
  const profile = data.companyProfiles.find((c) => c.userId === userId);
  const myInternships = data.internships.filter((i) => i.companyId === userId);
  const myInternshipIds = new Set(myInternships.map((i) => i.id));
  const myApps = data.applications.filter((a) => myInternshipIds.has(a.internshipId));

  return (
    <div>
      <PageHeader
        title={profile?.companyName ?? "Company dashboard"}
        description={
          profile?.status === "approved"
            ? "Your account is approved. Post and manage internships below."
            : "Your account is awaiting admin approval. Posts will go live once approved."
        }
        actions={
          <Button asChild>
            <Link to="/company/internships">Manage internships</Link>
          </Button>
        }
      />

      {profile && profile.status !== "approved" && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <span>Your company status:</span>
          <CompanyStatusBadge status={profile.status} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Posted internships" value={myInternships.length} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Applicants" value={myApps.length} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Shortlisted" value={myApps.filter((a) => a.status === "shortlisted").length} />
        <StatCard label="Active roles" value={myInternships.filter((i) => i.active).length} />
      </div>

      <section className="mt-8 rounded-xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent applicants</h2>
          <Link to="/company/applicants" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {myApps.length === 0 ? (
          <EmptyState
            title="No applicants yet"
            description="Once students apply, you'll see them here."
            action={<Button asChild><Link to="/company/internships">Post a role</Link></Button>}
          />
        ) : (
          <ul className="divide-y divide-border/60">
            {myApps.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{a.studentName}</div>
                  <div className="text-xs text-muted-foreground">{a.internshipTitle}</div>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AdminDashboard({ data }: { data: ReturnType<typeof useDb> }) {
  const pending = data.companyProfiles.filter((c) => c.status === "pending");
  return (
    <div>
      <PageHeader
        title="Admin overview"
        description="Manage the portal, approve companies, and monitor activity."
        actions={
          <Button asChild>
            <Link to="/analytics">View analytics</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={data.users.filter((u) => u.role === "student").length} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Companies" value={data.users.filter((u) => u.role === "company").length} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Internships" value={data.internships.length} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Applications" value={data.applications.length} icon={<BarChart3 className="h-4 w-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Companies awaiting approval</h2>
            <Link to="/admin/companies" className="text-sm text-primary hover:underline">Review</Link>
          </div>
          {pending.length === 0 ? (
            <EmptyState title="All caught up" description="No pending companies right now." />
          ) : (
            <ul className="divide-y divide-border/60">
              {pending.map((c) => (
                <li key={c.userId} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{c.companyName}</div>
                    <div className="text-xs text-muted-foreground">{c.industry || "—"}</div>
                  </div>
                  <CompanyStatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border/60 bg-card p-5">
          <h2 className="mb-4 font-semibold">Recent activity</h2>
          {data.adminLogs.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <ul className="divide-y divide-border/60">
              {data.adminLogs.slice(-6).reverse().map((l) => (
                <li key={l.id} className="py-3 text-sm">
                  <span className="font-medium">{l.action}</span>{" "}
                  <span className="text-muted-foreground">— {l.target}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

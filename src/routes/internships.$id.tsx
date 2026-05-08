import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useDb, useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, IndianRupee, ArrowLeft } from "lucide-react";
import { db } from "@/lib/data";

export const Route = createFileRoute("/internships/$id")({
  component: InternshipDetail,
});

function InternshipDetail() {
  const { id } = useParams({ from: "/internships/$id" });
  const data = useDb();
  const { user } = useAuth();
  const internship = data.internships.find((i) => i.id === id);
  const alreadyApplied =
    user?.role === "student" &&
    data.applications.some((a) => a.internshipId === id && a.studentId === user.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Link to="/internships" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to internships
        </Link>
        {!internship ? (
          <div className="mt-6 rounded-xl border border-border/60 bg-card p-8 text-center">
            <h1 className="text-xl font-semibold">Internship not found</h1>
            <p className="mt-1 text-sm text-muted-foreground">It may have been removed by the company.</p>
          </div>
        ) : (
          <article className="mt-4 rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{internship.companyName}</div>
                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{internship.title}</h1>
              </div>
              <Badge variant="secondary">{internship.domain}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{internship.location}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{internship.durationWeeks} weeks</span>
              <span className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4" />{internship.stipend.toLocaleString()}/month</span>
              <Badge variant="outline">{internship.mode}</Badge>
            </div>
            <section className="mt-6">
              <h2 className="text-base font-semibold">About the role</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{internship.description}</p>
            </section>
            <section className="mt-6">
              <h2 className="text-base font-semibold">Requirements</h2>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {internship.requirements.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </section>
            <div className="mt-8 flex flex-wrap gap-3">
              {!user && (
                <>
                  <Button asChild><Link to="/login">Sign in to apply</Link></Button>
                  <Button asChild variant="outline"><Link to="/register">Create account</Link></Button>
                </>
              )}
              {user?.role === "student" && !alreadyApplied && (
                <Button asChild>
                  <Link to="/apply/$id" params={{ id: internship.id }}>Apply now</Link>
                </Button>
              )}
              {user?.role === "student" && alreadyApplied && (
                <Button asChild variant="outline"><Link to="/applications">View your application</Link></Button>
              )}
              {user?.role === "company" && user.id === internship.companyId && (
                <Button asChild variant="outline"><Link to="/company/internships">Manage this role</Link></Button>
              )}
              {user?.role === "admin" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const d = db.get();
                    d.internships = d.internships.filter((x) => x.id !== internship.id);
                    d.adminLogs.push({ id: "l_" + db.uid(), action: "Removed internship", target: internship.title, createdAt: new Date().toISOString() });
                    db.set(d);
                  }}
                >
                  Remove listing
                </Button>
              )}
            </div>
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

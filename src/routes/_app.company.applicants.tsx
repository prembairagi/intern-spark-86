import { createFileRoute } from "@tanstack/react-router";
import { useAuth, useDb } from "@/lib/auth";
import { db, type ApplicationStatus } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { StatusBadge } from "@/components/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/company/applicants")({
  component: ApplicantsPage,
});

const STATUSES: ApplicationStatus[] = ["submitted", "under_review", "shortlisted", "rejected", "accepted"];

function ApplicantsPage() {
  const { user } = useAuth();
  const data = useDb();
  if (!user || user.role !== "company") return null;
  const ids = new Set(data.internships.filter((i) => i.companyId === user.id).map((i) => i.id));
  const apps = data.applications.filter((a) => ids.has(a.internshipId));

  const updateStatus = (appId: string, status: ApplicationStatus) => {
    const d = db.get();
    const a = d.applications.find((x) => x.id === appId);
    if (a) {
      a.status = status;
      d.notifications.push({
        id: "n_" + db.uid(),
        userId: a.studentId,
        title: "Application updated",
        message: `${a.companyName} marked your application as ${status.replace("_", " ")}.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      db.set(d);
    }
  };

  return (
    <div>
      <PageHeader title="Applicants" description="Review applications and update their status." />
      {apps.length === 0 ? (
        <EmptyState title="No applicants yet" description="Once students apply, they'll appear here." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Internship</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-48">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium">{a.studentName}</div>
                    <div className="text-xs text-muted-foreground">{a.studentEmail}</div>
                  </TableCell>
                  <TableCell>{a.internshipTitle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.resumeName}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as ApplicationStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

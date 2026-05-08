import { createFileRoute } from "@tanstack/react-router";
import { useDb } from "@/lib/auth";
import { db } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { CompanyStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/admin/companies")({
  component: AdminCompaniesPage,
});

function AdminCompaniesPage() {
  const data = useDb();
  const setStatus = (userId: string, status: "approved" | "rejected") => {
    const d = db.get();
    const c = d.companyProfiles.find((x) => x.userId === userId);
    if (c) {
      c.status = status;
      d.adminLogs.push({ id: "l_" + db.uid(), action: status === "approved" ? "Approved company" : "Rejected company", target: c.companyName, createdAt: new Date().toISOString() });
      d.notifications.push({ id: "n_" + db.uid(), userId, title: `Company ${status}`, message: `Your company has been ${status}.`, read: false, createdAt: new Date().toISOString() });
      db.set(d);
    }
  };
  return (
    <div>
      <PageHeader title="Companies" description="Review, approve, and manage companies." />
      {data.companyProfiles.length === 0 ? <EmptyState title="No companies yet" /> : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Industry</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.companyProfiles.map((c) => (
                <TableRow key={c.userId}>
                  <TableCell className="font-medium">{c.companyName}</TableCell>
                  <TableCell>{c.industry || "—"}</TableCell>
                  <TableCell><CompanyStatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-right space-x-2">
                    {c.status !== "approved" && <Button size="sm" onClick={() => setStatus(c.userId, "approved")}>Approve</Button>}
                    {c.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setStatus(c.userId, "rejected")}>Reject</Button>}
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useDb } from "@/lib/auth";
import { db } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/admin/internships")({
  component: AdminInternshipsPage,
});

function AdminInternshipsPage() {
  const data = useDb();
  const remove = (id: string) => {
    const d = db.get();
    const i = d.internships.find((x) => x.id === id);
    d.internships = d.internships.filter((x) => x.id !== id);
    d.applications = d.applications.filter((a) => a.internshipId !== id);
    if (i) d.adminLogs.push({ id: "l_" + db.uid(), action: "Removed internship", target: i.title, createdAt: new Date().toISOString() });
    db.set(d);
  };
  return (
    <div>
      <PageHeader title="All internships" description="Moderate listings across the portal." />
      {data.internships.length === 0 ? <EmptyState title="No internships yet" /> : (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Company</TableHead><TableHead>Domain</TableHead><TableHead>Mode</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.internships.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell>{i.companyName}</TableCell>
                  <TableCell>{i.domain}</TableCell>
                  <TableCell>{i.mode}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild size="sm" variant="outline"><Link to="/internships/$id" params={{ id: i.id }}>View</Link></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(i.id)}>Remove</Button>
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

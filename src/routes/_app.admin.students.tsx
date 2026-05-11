import { createFileRoute } from "@tanstack/react-router";
import { useDb } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/admin/students")({
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const data = useDb();
  const rows = data.studentProfiles.map((p) => ({ p, u: data.users.find((u) => u.id === p.userId) }));
  return (
    <div>
      <PageHeader title="Students" description="Registered student accounts." />
      {rows.length === 0 ? <EmptyState title="No students yet" /> : (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>University</TableHead><TableHead>Skills</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map(({ p, u }) => (
                <TableRow key={p.userId}>
                  <TableCell className="font-medium">{u?.name}</TableCell>
                  <TableCell>{u?.email}</TableCell>
                  <TableCell>{p.university || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.skills.join(", ") || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

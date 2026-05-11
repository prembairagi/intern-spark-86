import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth, useDb } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_app/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { user } = useAuth();
  const data = useDb();
  if (!user) return null;
  const apps = data.applications.filter((a) => a.studentId === user.id);

  return (
    <div>
      <PageHeader title="Your applications" description="Track every internship application in one place." />
      {apps.length === 0 ? (
        <EmptyState
          title="You haven't applied yet"
          description="Browse open internships and apply with your resume."
          action={<Button asChild><Link to="/internships">Browse internships</Link></Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Internship</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.internshipTitle}</TableCell>
                  <TableCell>{a.companyName}</TableCell>
                  <TableCell>{new Date(a.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/internships/$id" params={{ id: a.internshipId }}>View</Link>
                    </Button>
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

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, useDb } from "@/lib/auth";
import { db } from "@/lib/data";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Power } from "lucide-react";

export const Route = createFileRoute("/_app/company/internships")({
  component: CompanyInternshipsPage,
});

function CompanyInternshipsPage() {
  const { user } = useAuth();
  const data = useDb();
  if (!user || user.role !== "company") return null;

  const profile = data.companyProfiles.find((c) => c.userId === user.id);
  const mine = data.internships.filter((i) => i.companyId === user.id);

  const toggleActive = (id: string) => {
    const d = db.get();
    const i = d.internships.find((x) => x.id === id);
    if (i) { i.active = !i.active; db.set(d); }
  };
  const remove = (id: string) => {
    const d = db.get();
    d.internships = d.internships.filter((x) => x.id !== id);
    d.applications = d.applications.filter((a) => a.internshipId !== id);
    db.set(d);
  };

  return (
    <div>
      <PageHeader
        title="My internships"
        description="Create, edit, and manage your internship postings."
        actions={
          <NewInternshipDialog
            disabled={profile?.status !== "approved"}
            companyId={user.id}
            companyName={profile?.companyName ?? user.name}
          />
        }
      />
      {profile?.status !== "approved" && (
        <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Posting is disabled until an admin approves your company.
        </div>
      )}

      {mine.length === 0 ? (
        <EmptyState title="No internships yet" description="Create your first internship to start receiving applications." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((i) => {
            const apps = data.applications.filter((a) => a.internshipId === i.id);
            return (
              <article key={i.id} className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{i.title}</h3>
                    <div className="mt-1 text-xs text-muted-foreground">{i.location} · {i.mode} · {i.durationWeeks}w</div>
                  </div>
                  <Badge variant={i.active ? "default" : "secondary"}>{i.active ? "Active" : "Paused"}</Badge>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{i.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{apps.length} applicant{apps.length === 1 ? "" : "s"}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(i.id)}>
                      <Power className="mr-1 h-3.5 w-3.5" /> {i.active ? "Pause" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(i.id)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NewInternshipDialog({ disabled, companyId, companyName }: { disabled: boolean; companyId: string; companyName: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", domain: "Software Engineering", location: "", mode: "Remote",
    stipend: 30000, durationWeeks: 12, description: "", requirements: "",
  });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.description) return setError("Please fill in all fields.");
    const d = db.get();
    d.internships.push({
      id: "i_" + db.uid(),
      companyId,
      companyName,
      title: form.title,
      domain: form.domain,
      location: form.location,
      mode: form.mode as "Remote" | "Hybrid" | "On-site",
      stipend: Number(form.stipend) || 0,
      durationWeeks: Number(form.durationWeeks) || 12,
      description: form.description,
      requirements: form.requirements.split(",").map((s) => s.trim()).filter(Boolean),
      postedAt: new Date().toISOString(),
      active: true,
    });
    db.set(d);
    setOpen(false);
    setForm({ title: "", domain: "Software Engineering", location: "", mode: "Remote", stipend: 30000, durationWeeks: 12, description: "", requirements: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}><Plus className="mr-1 h-4 w-4" />New internship</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Post a new internship</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Domain</Label><Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Mode</Label>
              <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Stipend</Label><Input type="number" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: Number(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Weeks</Label><Input type="number" value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Requirements (comma-separated)</Label><Input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></div>
          {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Publish</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, useDb } from "@/lib/auth";
import { db } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/apply/$id")({
  component: ApplyPage,
});

function ApplyPage() {
  const { id } = useParams({ from: "/apply/$id" });
  const { user } = useAuth();
  const data = useDb();
  const navigate = useNavigate();
  const internship = data.internships.find((i) => i.id === id);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeName, setResumeName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
    else if (user.role !== "student") navigate({ to: "/internships/$id", params: { id } });
  }, [user, id, navigate]);

  useEffect(() => {
    if (user) {
      const profile = data.studentProfiles.find((p) => p.userId === user.id);
      if (profile?.resumeName) setResumeName(profile.resumeName);
    }
  }, [user, data.studentProfiles]);

  if (!user || !internship) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!coverLetter.trim()) return setError("Please write a brief cover letter.");
    if (!resumeName) return setError("Please upload your resume.");
    const d = db.get();
    if (d.applications.some((a) => a.internshipId === id && a.studentId === user.id)) {
      return setError("You've already applied to this internship.");
    }
    const appId = "a_" + db.uid();
    const now = new Date().toISOString();
    d.applications.push({
      id: appId,
      internshipId: id,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      status: "submitted",
      coverLetter,
      resumeName,
      appliedAt: now,
    });
    d.notifications.push({
      id: "n_" + db.uid(),
      userId: internship.companyId,
      title: "New application received",
      message: `${user.name} applied to ${internship.title}.`,
      read: false,
      createdAt: now,
    });
    // persist resume to profile
    const p = d.studentProfiles.find((x) => x.userId === user.id);
    if (p) p.resumeName = resumeName;
    db.set(d);
    setSuccess(true);
    setTimeout(() => navigate({ to: "/applications" }), 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold">Apply to {internship.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">at {internship.companyName} · {internship.location}</p>

        <form onSubmit={submit} className="animate-fade-in mt-6 space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="space-y-1.5">
            <Label>Cover letter</Label>
            <Textarea rows={6} placeholder="Why are you a great fit for this role?" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Resume (PDF)</Label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-border bg-background px-3 py-3 text-sm hover:border-primary/40">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Upload className="h-4 w-4" />
                {resumeName || "Click to upload your resume"}
              </span>
              <span className="text-xs text-primary">Browse</span>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setResumeName(f.name);
                }}
              />
            </label>
          </div>
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}
          {success && (
            <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">Application submitted! Redirecting…</div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/internships/$id" params={{ id }}>Cancel</Link>
            </Button>
            <Button type="submit">Submit application</Button>
          </div>
        </form>
      </main>
    </div>
  );
}

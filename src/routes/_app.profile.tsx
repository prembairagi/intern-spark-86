import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, useDb } from "@/lib/auth";
import { db } from "@/lib/data";
import { PageHeader } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const data = useDb();
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  if (!user) return null;

  if (user.role === "student") {
    return <StudentProfileForm onSaved={() => setSavedMsg("Profile saved.")} savedMsg={savedMsg} />;
  }
  if (user.role === "company") {
    return <CompanyProfileForm onSaved={() => setSavedMsg("Profile saved.")} savedMsg={savedMsg} />;
  }
  return (
    <div>
      <PageHeader title="Admin profile" description="Account information." />
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <div className="text-sm"><span className="text-muted-foreground">Name:</span> {user.name}</div>
        <div className="mt-1 text-sm"><span className="text-muted-foreground">Email:</span> {user.email}</div>
      </div>
    </div>
  );

  function StudentProfileForm({ onSaved, savedMsg }: { onSaved: () => void; savedMsg: string | null }) {
    const profile = data.studentProfiles.find((p) => p.userId === user!.id);
    const [form, setForm] = useState({
      university: profile?.university ?? "",
      degree: profile?.degree ?? "",
      graduationYear: profile?.graduationYear ?? new Date().getFullYear() + 1,
      skills: (profile?.skills ?? []).join(", "),
      bio: profile?.bio ?? "",
      resumeName: profile?.resumeName ?? "",
    });
    useEffect(() => {
      if (savedMsg) {
        const t = setTimeout(() => onSaved(), 0); // noop; keep compiler happy
        return () => clearTimeout(t);
      }
    }, [savedMsg]);

    const save = (e: React.FormEvent) => {
      e.preventDefault();
      const d = db.get();
      const p = d.studentProfiles.find((x) => x.userId === user!.id);
      if (p) {
        p.university = form.university;
        p.degree = form.degree;
        p.graduationYear = Number(form.graduationYear) || p.graduationYear;
        p.skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
        p.bio = form.bio;
        p.resumeName = form.resumeName;
        db.set(d);
        onSaved();
      }
    };

    return (
      <div>
        <PageHeader title="Your profile" description="Companies see this when reviewing your application." />
        <form onSubmit={save} className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>University</Label><Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Degree</Label><Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Graduation year</Label><Input type="number" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Resume file name</Label><Input value={form.resumeName} onChange={(e) => setForm({ ...form, resumeName: e.target.value })} placeholder="resume.pdf" /></div>
          </div>
          <div className="space-y-1.5"><Label>Skills (comma-separated)</Label><Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Bio</Label><Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          {savedMsg && <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">{savedMsg}</div>}
          <Button type="submit">Save profile</Button>
        </form>
      </div>
    );
  }

  function CompanyProfileForm({ onSaved, savedMsg }: { onSaved: () => void; savedMsg: string | null }) {
    const profile = data.companyProfiles.find((p) => p.userId === user!.id);
    const [form, setForm] = useState({
      companyName: profile?.companyName ?? "",
      industry: profile?.industry ?? "",
      website: profile?.website ?? "",
      description: profile?.description ?? "",
    });
    const save = (e: React.FormEvent) => {
      e.preventDefault();
      const d = db.get();
      const p = d.companyProfiles.find((x) => x.userId === user!.id);
      if (p) {
        Object.assign(p, form);
        db.set(d);
        onSaved();
      }
    };
    return (
      <div>
        <PageHeader title="Company profile" description="Shown to students reviewing your roles." />
        <form onSubmit={save} className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Company name</Label><Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Industry</Label><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>About</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          {savedMsg && <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">{savedMsg}</div>}
          <Button type="submit">Save profile</Button>
        </form>
      </div>
    );
  }
}

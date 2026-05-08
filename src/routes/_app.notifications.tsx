import { createFileRoute } from "@tanstack/react-router";
import { useAuth, useDb } from "@/lib/auth";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/data";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const data = useDb();
  if (!user) return null;
  const items = data.notifications.filter((n) => n.userId === user.id).slice().reverse();

  const markAll = () => {
    const d = db.get();
    d.notifications.forEach((n) => { if (n.userId === user.id) n.read = true; });
    db.set(d);
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Updates about your applications, postings, and account."
        actions={items.some((n) => !n.read) && <Button variant="outline" onClick={markAll}>Mark all read</Button>}
      />
      {items.length === 0 ? (
        <EmptyState title="No notifications yet" description="You'll see activity here as it happens." />
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card">
          {items.map((n) => (
            <li key={n.id} className="flex items-start gap-3 p-4">
              <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
              {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

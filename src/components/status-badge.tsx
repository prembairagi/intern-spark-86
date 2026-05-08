import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus, CompanyStatus } from "@/lib/data";

const dot = "mr-1.5 inline-block h-1.5 w-1.5 rounded-full";

const appColors: Record<ApplicationStatus, string> = {
  submitted: "bg-info/15 text-info-foreground border-info/30",
  under_review: "bg-warning/20 text-warning-foreground border-warning/40",
  shortlisted: "bg-primary/10 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  accepted: "bg-success/15 text-success border-success/30",
};

const dotColors: Record<ApplicationStatus, string> = {
  submitted: "bg-info",
  under_review: "bg-warning",
  shortlisted: "bg-primary",
  rejected: "bg-destructive",
  accepted: "bg-success",
};

const appLabel: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  accepted: "Accepted",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={`${appColors[status]} font-medium`}>
      <span className={`${dot} ${dotColors[status]}`} />
      {appLabel[status]}
    </Badge>
  );
}

const compColors: Record<CompanyStatus, string> = {
  pending: "bg-warning/20 text-warning-foreground border-warning/40",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  return (
    <Badge variant="outline" className={compColors[status]}>
      {status[0].toUpperCase() + status.slice(1)}
    </Badge>
  );
}

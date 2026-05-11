import { Link } from "@tanstack/react-router";
import { Briefcase, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              <Briefcase className="h-4 w-4" />
            </span>
            InternHub
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A modern internship management portal connecting students, companies, and campus admins.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <Github className="h-4 w-4" /> View on GitHub
          </a>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/internships" className="hover:text-foreground">Browse internships</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Post an internship</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Demo accounts</div>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li>student: priya@student.edu / student123</li>
            <li>company: hr@nimbusworks.com / company123</li>
            <li>admin: admin@portal.com / admin123</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} InternHub · Built by{" "}
        <span className="font-medium text-foreground">Prem Bairagi – BCS 2026</span>
      </div>
    </footer>
  );
}

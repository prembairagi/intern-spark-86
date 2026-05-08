import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-foreground">InternHub</div>
          <p className="mt-2 text-sm text-muted-foreground">
            A modern internship management portal connecting students, companies, and campus admins.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Product</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/internships" className="hover:text-foreground">Browse internships</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Post an internship</Link></li>
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">Demo accounts</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>student: priya@student.edu / student123</li>
            <li>company: hr@nimbusworks.com / company123</li>
            <li>admin: admin@portal.com / admin123</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} InternHub. Built as a demo portal.
      </div>
    </footer>
  );
}

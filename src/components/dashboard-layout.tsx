import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bell,
  User as UserIcon,
  BarChart3,
  Building2,
  Users,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/data";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type NavItem = { label: string; to: string; icon: React.ComponentType<{ className?: string }> };

const navByRole: Record<Role, NavItem[]> = {
  student: [
    { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "Browse internships", to: "/internships", icon: Briefcase },
    { label: "My applications", to: "/applications", icon: FileText },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Profile", to: "/profile", icon: UserIcon },
  ],
  company: [
    { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "My internships", to: "/company/internships", icon: Briefcase },
    { label: "Applicants", to: "/company/applicants", icon: Users },
    { label: "Notifications", to: "/notifications", icon: Bell },
    { label: "Profile", to: "/profile", icon: UserIcon },
  ],
  admin: [
    { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "Companies", to: "/admin/companies", icon: Building2 },
    { label: "Students", to: "/admin/students", icon: Users },
    { label: "Internships", to: "/admin/internships", icon: Briefcase },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
    { label: "Notifications", to: "/notifications", icon: Bell },
  ],
};

function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return null;
  const items = navByRole[user.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">InternHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{user.role.toUpperCase()}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.to;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        to={item.to}
                        className={`flex items-center gap-2 rounded-md transition-colors ${
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-sidebar-accent/60"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function DashboardLayout({
  allow,
}: {
  allow?: Role[];
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    } else if (allow && !allow.includes(user.role)) {
      navigate({ to: "/dashboard" });
    }
  }, [user, allow, navigate]);

  if (!user) return null;
  if (allow && !allow.includes(user.role)) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-muted/40 via-background to-muted/30">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="glass sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/60 px-4">
            <SidebarTrigger className="hover:bg-accent/60">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
            <div className="flex-1" />
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
              <Button asChild size="sm" variant="outline" className="hover-lift">
                <Link to="/profile">{user.name.split(" ")[0]}</Link>
              </Button>
            </div>
          </header>
          <main key={pathname} className="animate-fade-in flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

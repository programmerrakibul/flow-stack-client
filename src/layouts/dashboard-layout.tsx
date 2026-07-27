import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/user";
import { signOut } from "@/utils/auth-actions";
import { cn } from "@/utils/utils";
import {
  BarChart3,
  ListTodo,
  Menu,
  PlusCircle,
  Shield,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
}

const userNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/overview", icon: BarChart3 },
  { label: "Add Task", href: "/dashboard/add-task", icon: PlusCircle },
  { label: "My Tasks", href: "/dashboard/my-tasks", icon: ListTodo },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: BarChart3 },
  { label: "All Tasks", href: "/admin/all-tasks", icon: ListTodo },
  { label: "All Users", href: "/admin/all-users", icon: Users },
  { label: "Profile", href: "/admin/profile", icon: User },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const navItems = isAdmin ? adminNavItems : userNavItems;
  const prefix = isAdmin ? "/admin" : "/dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              to={prefix}
              className="flex items-center gap-2 font-heading text-lg font-bold"
            >
              <Zap className="h-5 w-5 text-primary" />
              Flow Stack
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <Separator />

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-none px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 px-3 py-2">
              {isAdmin && <Shield className="size-4 text-purple-500" />}
              <span className="text-sm font-medium truncate">{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          <AnimatedThemeToggler className="size-9 inline-flex items-center justify-center rounded-none border border-border bg-transparent hover:bg-accent transition-colors" />
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

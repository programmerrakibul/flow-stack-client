import Logo from "@/components/shared/logo";
import ThemeToggle from "@/components/shared/theme-toggle";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { signOut, useAuthStore } from "@/stores/auth-store";
import { Role } from "@/types/user";
import { cn } from "@/utils/utils";
import {
  BarChart3,
  ListTodo,
  Menu,
  PlusCircle,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const userNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Add Task", href: "/dashboard/add-task", icon: PlusCircle },
  { label: "My Tasks", href: "/dashboard/my-tasks", icon: ListTodo },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "All Tasks", href: "/dashboard/all-tasks", icon: ListTodo },
  { label: "All Users", href: "/dashboard/all-users", icon: Users },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const DashboardLayout = () => {
  const data = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!data.isAuthenticated) return <Navigate to="/sign-in" replace />;

  const isAdmin = data.user.role === Role.ADMIN;
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card flex flex-col lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Logo />
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

        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-1">
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
        </ScrollArea>

        <div className="shrink-0 border-t border-border p-3 space-y-2">
          <div className="flex items-center gap-3 px-1">
            <AspectRatio ratio={1} className="size-10 shrink-0 overflow-hidden rounded-full bg-muted">
              {data.user.image ? (
                <img
                  src={data.user.image}
                  alt={data.user.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm font-medium text-muted-foreground">
                  {data.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </AspectRatio>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{data.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{data.user.email}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full justify-start"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

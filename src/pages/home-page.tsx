import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/container";
import { useAuth } from "@/hooks/use-auth";
import { Zap, ListTodo, Shield, BarChart3 } from "lucide-react";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  const getStartedPath = isAuthenticated
    ? user?.role === "ADMIN"
      ? "/admin/dashboard"
      : "/dashboard/overview"
    : "/sign-up";

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[calc(100vh-8rem)] items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-none border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Zap className="size-4" />
              Built for productivity
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Flow Stack
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A modern task management platform. Organize your work,
              track progress, and stay productive with your team.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link to={getStartedPath}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg">
                  <Link to="/sign-in">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-muted/30 py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-heading text-2xl font-bold">
              Everything you need
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Powerful features to help you manage tasks efficiently.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: ListTodo,
                  title: "Task Management",
                  description:
                    "Create, organize, and track tasks with priorities and status updates.",
                },
                {
                  icon: BarChart3,
                  title: "Dashboard Analytics",
                  description:
                    "Get insights into your productivity with real-time stats and activity.",
                },
                {
                  icon: Shield,
                  title: "Role-Based Access",
                  description:
                    "Secure platform with user and admin roles for team management.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="space-y-3 rounded-none border border-border bg-card p-6"
                  >
                    <div className="flex size-10 items-center justify-center rounded-none bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-sm font-bold">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;

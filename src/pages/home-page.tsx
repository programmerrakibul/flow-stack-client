import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import {
  BarChart3,
  CheckCircle,
  ListTodo,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  const getStartedPath =
    !isLoading && isAuthenticated ? "/dashboard" : "/sign-up";

  const features = [
    {
      icon: ListTodo,
      title: "Task Management",
      description:
        "Create, organize, and track tasks with priorities and status updates in real-time.",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analytics",
      description:
        "Get insights into your productivity with real-time stats and visual activity tracking.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure platform with user and admin roles for effective team management.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor task completion and track your productivity trends over time.",
    },
    {
      icon: CheckCircle,
      title: "Status Workflow",
      description:
        "Move tasks through Todo, In Progress, and Completed stages seamlessly.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description: "Sign up in seconds and set up your profile.",
    },
    {
      number: "02",
      title: "Add Your Tasks",
      description:
        "Create tasks with titles, descriptions, and priority levels.",
    },
    {
      number: "03",
      title: "Track Progress",
      description: "Update statuses and monitor your productivity.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/[0.07] via-transparent to-primary/12" />
        <div
          className="absolute inset-0 bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)",
          }}
        />
        <Container className="relative z-10 py-20">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Zap className="size-3.5" />
              Built for productivity
            </motion.div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Streamline Your{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Workflow
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
              A modern task management platform. Organize your work, track
              progress, and stay productive with your team.
            </p>
            <motion.div
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Button size="lg" onClick={() => navigate(getStartedPath)}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign In
                </Button>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-20 lg:py-28">
        <Container>
          <motion.div
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Everything you need
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Powerful features to help you manage tasks efficiently.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="group space-y-3 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-sm font-bold">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* How it Works */}
      <section className="py-20 lg:py-28">
        <Container>
          <motion.div
            className="mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                How it works
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Get started in three simple steps.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                >
                  {i < steps.length - 1 && (
                    <div className="absolute top-6 left-[60%] hidden h-px w-[80%] bg-border sm:block" />
                  )}
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {step.number}
                  </div>
                  <h3 className="mt-4 font-heading text-sm font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <Container>
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join Flow Stack and start managing your tasks effectively.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate(getStartedPath)}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;

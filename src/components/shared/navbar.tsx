import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signOut, useAuthStore } from "@/stores/auth-store";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
  const data = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {data.isLoading ? (
              <Spinner className="size-6" />
            ) : data.isAuthenticated ? (
              <>
                <Button onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="size-4" />
                  <span className="sr-only">Dashboard</span>
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button variant="secondary" onClick={signOut}>
                  <LogOut className="size-4" />
                  <span className="sr-only">Sign Out</span>
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(
                    `/sign-in?to=${encodeURIComponent(location.pathname)}`,
                  )
                }
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;

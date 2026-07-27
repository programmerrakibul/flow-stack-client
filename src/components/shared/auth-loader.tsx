import { useEffect } from "react";
import { fetchProfile } from "@/utils/auth-actions";
import { useAuth } from "@/hooks/use-auth";

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLoader;

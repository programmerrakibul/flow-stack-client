import { fetchProfile, useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuthStore();

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

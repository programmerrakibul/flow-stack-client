import { fetchProfile, useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { Spinner } from "../ui/spinner";

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const isLoading = useAuthStore((s) => s.authLoading);

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLoader;

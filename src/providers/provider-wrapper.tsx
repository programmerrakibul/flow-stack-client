import AuthLoader from "@/components/shared/auth-loader";
import { fetchProfile } from "@/stores/auth-store";
import { useEffect } from "react";
import QueryProvider from "./query-provider";
import ThemeProvider from "./theme-provider";

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <AuthLoader>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </AuthLoader>
    </>
  );
};

export default ProviderWrapper;

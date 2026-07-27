import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Outlet, useLocation } from "react-router";

const RootLayout = () => {
  const location = useLocation();

  const isDashboard = location.pathname.includes("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {!isDashboard && <Navbar />}

      <main className="flex-1">
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default RootLayout;

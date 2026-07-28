import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;

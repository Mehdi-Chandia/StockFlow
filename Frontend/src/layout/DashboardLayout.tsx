import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/shared/Sidebar";
import Navbar from "../components/shared/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigateTo = useNavigate();

  console.log("user ", user);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigateTo("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigateTo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-[#111315] grid lg:grid-cols-[260px_1fr] min-h-screen">
      {/* menubar for mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden lg:hidden text-white block"
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      {/* dark overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
      <aside>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </aside>
      <main className="min-w-0 grid grid-rows-[80px_1fr] bg-[#111315]">
        {/* Navbar */}
        <nav>
          <Navbar />
        </nav>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

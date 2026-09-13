import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/shared/Sidebar";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen]=useState(false);

  return (
    <div className="bg-[#111315] grid lg:grid-cols-[280px_1fr]">
           {/* menubar for mobile */}
       <button
       onClick={()=> setIsSidebarOpen(!isSidebarOpen)}
       className="md:hidden lg:hidden text-white block">
        {isSidebarOpen ? <X size={18}/> : <Menu size={18}/>}
       </button>
        {/* dark overlay */}
          {isSidebarOpen && (
         <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"/>
        )}
        <aside>
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </aside>
        <main className="min-w-0 grid grid-rows-[100px_1fr] bg-blue-200">
            <nav className="bg-indigo-400">
                <h2>Stock Flow</h2>
            </nav>
            <section className="bg-amber-200">
                main content
            </section>
        </main>
    </div>
  )
}

export default DashboardLayout;
import {LayoutDashboard ,Package, Boxes, Warehouse, ArrowLeftRight,ClipboardList,Truck,ShoppingCart,Receipt,Layers,Users,User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const mainLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Inventory", path: "/inventory", icon: Boxes },
    { name: "WareHouse", path: "/warehouse", icon: Warehouse },
    { name: "Suppliers", path: "/suppliers", icon: Users },
  ];

  const opLinks = [
    { name: "Purchases", path: "/purchases", icon: ClipboardList },
    { name: "Shipments", path: "/shipments", icon: Truck },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Invoices", path: "/invoices", icon: Receipt },
  ];

  const managementLinks = [
    { name: "Users", path: "/users", icon: User },
    { name: "Audit Logs", path: "/audit-logs", icon: ArrowLeftRight },
  ];

  return (
    <div
      className={`bg-[#16191C] p-4 h-screen w-64 top-0 left-0 z-50
      transform transition-transform duration-300 overflow-y-auto
      fixed lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex gap-2 items-center p-2">
        <span>
          <Layers size={20} className="text-[#22D3EE]" />
        </span>

        <h3 className="text-[#22D3EE] text-xl font-bold">
          <span className="text-white">Stock</span> Flow
        </h3>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-3">
        {/* Main */}
        <p className="text-[#71717A] text-xs tracking-wider uppercase">Main</p>

        {mainLinks.map((m) => {
          const Icon = m.icon;

          return (
            <NavLink
              key={m.path}
              to={m.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex gap-2 group items-center p-2 cursor-pointer rounded-lg
                ${isActive ? "bg-[#164E63]" : "hover:bg-[#20252A]"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`group-hover:text-[#F3F4F6]
                    ${isActive ? "text-[#22D3EE]" : "text-[#94A3B8]"}`}
                  >
                    <Icon size={16} />
                  </span>

                  <p
                    className={`group-hover:text-[#F3F4F6]
                    ${isActive ? "text-[#67E8F9]" : "text-[#A1A1AA]"}`}
                  >
                    {m.name}
                  </p>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Operations */}
        <p className="text-[#71717A] text-xs tracking-wider uppercase">
          Operations
        </p>

        {opLinks.map((op) => {
          const Icon = op.icon;

          return (
            <NavLink
              key={op.path}
              to={op.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex gap-2 group items-center p-2 cursor-pointer rounded-lg
                ${isActive ? "bg-[#164E63]" : "hover:bg-[#20252A]"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`group-hover:text-[#F3F4F6]
                    ${isActive ? "text-[#22D3EE]" : "text-[#94A3B8]"}`}
                  >
                    <Icon size={16} />
                  </span>

                  <p
                    className={`group-hover:text-[#F3F4F6]
                    ${isActive ? "text-[#67E8F9]" : "text-[#A1A1AA]"}`}
                  >
                    {op.name}
                  </p>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Management */}
        <p className="text-[#71717A] text-xs tracking-wider uppercase">
          Management
        </p>

        {managementLinks.map((m) => {
          const Icon = m.icon;

          return (
            <NavLink
              key={m.path}
              to={m.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex gap-2 group items-center p-2 cursor-pointer rounded-lg
                ${isActive ? "bg-[#164E63]" : "hover:bg-[#20252A]"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`group-hover:text-[#F3F4F6]
                    ${isActive ? "text-[#22D3EE]" : "text-[#94A3B8]"}`}
                  >
                    <Icon size={16} />
                  </span>

                  <p
                    className={`group-hover:text-[#F3F4F6]
                    ${isActive ? "text-[#67E8F9]" : "text-[#A1A1AA]"}`}
                  >
                    {m.name}
                  </p>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Warehouse Status */}
      <div className="bg-[#1B1F23] p-4 border border-[#2A3036] rounded-md mt-4 shadow">
        <div className="flex gap-1 justify-center items-center">
          <span className="p-3">🏭</span>
          <p>WareHouse</p>
        </div>

        <div className="flex gap-2 justify-center items-center">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
          <p className="text-white">online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

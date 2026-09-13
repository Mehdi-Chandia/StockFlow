import {LayoutDashboard,Package, Boxes, Warehouse, ArrowLeftRight, ClipboardList,
     Truck, ShoppingCart, Receipt, Settings, Layers, Users, 
     User, Menu, X} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({isOpen, setIsOpen}: SidebarProps) => {

    const[selected, setSelected]=useState("dashboard");

    const mainLinks=[
      {name: "Dashboard", id: "dashboard", icon: LayoutDashboard},
      {name: "Products",  id: "products", icon: Package},
      {name: "Inventory", id: "inventory", icon: Boxes},
      {name: "WareHouse", id: "warehouse", icon: Warehouse},
      {name: "Suppliers", id: "suppliers", icon: Users},
    ];

    const opLinks=[
      {name: "Purchases", id: "purchases", icon: ClipboardList},
      {name: "Shipments", id: "shipments", icon: Truck},
      {name: "Orders",    id: "orders", icon: ShoppingCart},
      {name: "Invoices",  id: "invoices", icon: Receipt},
    ]

    const managementLinks=[
      {name: "Users", id: "users", icon: User},
      {name: "Audit Logs", id: "auditlogs", icon: ArrowLeftRight},

    ]

  return (
    <div className={`bg-[#16191C] p-4 h-screen w-64 top-0 left-0 z-50 transform transition-transform duration-300 overflow-y-auto
    fixed lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* header of sidebar */}
       <div className="flex gap-2 items-center p-2">
         <span><Layers size={20} className="text-[#22D3EE]"/></span>
         <h3 className="text-[#22D3EE] text-xl font-bold">   
        <span className="text-white">Stock</span> Flow
        </h3>
       </div>
    
       {/* sidebar links */}
        <div className="flex flex-col gap-3">
            {/* main links */}
            <p className="text-[#71717A] text-xs tracking-wider uppercase">Main</p>
           {mainLinks.map((m)=>{
            const Icon=m.icon;
            return(
                <div onClick={()=> {setSelected(m.id); setIsOpen(false)}} key={m.id} className={`flex gap-2 group items-center p-2 cursor-pointer rounded-lg
                  ${selected === m.id ? 'bg-[#164E63] hover:bg-[#164E63]' : 'hover:bg-[#20252A]'}`}>
                    <span className={` group-hover:text-[#F3F4F6] ${selected === m.id ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`}> <Icon size={16}/></span>
                    <p className={` group-hover:text-[#F3F4F6] ${selected === m.id ? 'text-[#67E8F9]' : 'text-[#A1A1AA]'}`}>{m.name}</p>
                </div>
            )
           })}
           {/* op links */}
           <p className="text-[#71717A] text-xs tracking-wider uppercase">Operations</p>
             {opLinks.map((op)=>{
            const Icon=op.icon;
            return(
                <div onClick={()=> {setSelected(op.id); setIsOpen(false)}} key={op.id} className={`flex gap-2 group items-center p-2 cursor-pointer rounded-lg 
                ${selected === op.id ? 'bg-[#164E63] hover:bg-[#164E63]' : 'hover:bg-[#20252A]'}`}>
                    <span className={` group-hover:text-[#F3F4F6] ${selected === op.id ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`}> <Icon size={16}/></span>
                    <p className={` group-hover:text-[#F3F4F6] ${selected === op.id ? 'text-[#67E8F9]' : 'text-[#A1A1AA]'}`}>{op.name}</p>
                </div>
            )
           })}

           {/* management links */}
           <p className="text-[#71717A] text-xs tracking-wider uppercase">Management</p>
             {managementLinks.map((m)=>{
            const Icon=m.icon;
            return(
                <div onClick={()=> {setSelected(m.id); setIsOpen(false)}} key={m.id} className={`flex gap-2 items-center p-2 group
                 rounded-lg cursor-pointer ${selected === m.id ? 'bg-[#164E63] hover:bg-[#164E63]' : 'hover:bg-[#20252A]'} `}>
                   <span className={` group-hover:text-[#F3F4F6] ${selected === m.id ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`}> <Icon size={16}/></span>
                   <p className={` group-hover:text-[#F3F4F6] ${selected === m.id ? 'text-[#67E8F9]' : 'text-[#A1A1AA]'}`}>{m.name}</p>
                </div>
            )
           })}
        </div>
        
        <div className="bg-[#1B1F23] p-4 border border-[#2A3036] rounded-md mt-4 shadow">
          <div className="flex gap-1 justify-center items-center">
            <span className="p-3">🏭</span>
            <p >WareHouse</p>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]"></span>
            <p className="text-white">online</p>
          </div>
        </div>
    </div>
  )
}

export default Sidebar;
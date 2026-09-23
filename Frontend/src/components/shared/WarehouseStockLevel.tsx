import {ClipboardList, Truck, UserPlus, ArrowLeftRight, TriangleAlert, Warehouse } from "lucide-react";


const WarehouseStockLevel = () => {

       const recentActivities = [
  {
    text: "Main WareHouse",
    detail: "Main road, Lahore",
    icon: Warehouse,
    iconColor: "text-[#71717A]",
    iconBg: "bg-[#71717A]/10",
    time: "78%",
    width: "w-10"
  },
  {
    text: "East WareHouse",
    detail: "College road, Karachi",
    icon: Warehouse,
    iconColor: "text-[#71717A]",
    iconBg: "bg-[#71717A]/10",
    time: "48%",
    width:"w-6"
  },
 {
    text: "New WareHouse",
    detail: "Bosan road, Multan",
    icon: Warehouse,
    iconColor: "text-[#71717A]",
    iconBg: "bg-[#71717A]/10",
    time: "89%",
    width: "w-14"
  },
];
  return (
    <div className="ml-4 flex flex-col gap-3 bg-[#1B1F23] border border-[#2A3036] p-4 rounded-xl h-full">
        {/* heading  */}
        <div className="flex justify-between items-center ">
            <h3 className="text-[#F3F4F6]">Warehouse Stock Level</h3>
            <button className="text-[#A1A1AA] text-xs hover:scale-105 hover:text-blue-500"> View All →</button>
        </div>
        {/* activities */}
     {recentActivities.map((act)=>{
        const Icon=act.icon
        return(
               <div key={act.text} className="flex gap-3 items-center justify-between border border-[#2A3036] p-2 rounded-2xl hover:bg-[#20252A]">
            <span className={`${act.iconBg} ${act.iconColor} p-2 rounded-full`}><Icon size={18}/></span>
            <div className="">
                <p className="text-sm">{act.text}</p>
                <span className="text-[#A1A1AA] text-xs ">{act.detail}</span>
            </div>
           
            <span className={`h-1 ${act.width} rounded-full bg-[#22D3EE]`}></span>
         
            <p className="text-[#71717A] text-sm">{act.time}</p>
        </div>
        )
     })}
    </div>
  )
}

export default WarehouseStockLevel;
import {ClipboardList, Truck, UserPlus, ArrowLeftRight, TriangleAlert, } from "lucide-react";


const RecentActivity = () => {

    const recentActivities = [
  {
    text: "New Purchase Order",
    detail: "PO #PO-1042 created",
    icon: ClipboardList,
    iconColor: "text-[#22D3EE]",
    iconBg: "bg-[#22D3EE]/10",
    time: "2h ago",
  },
  {
    text: "Shipment Dispatched",
    detail: "Shipment #SH-208 sent",
    icon: Truck,
    iconColor: "text-[#818CF8]",
    iconBg: "bg-[#818CF8]/10",
    time: "3h ago",
  },
  {
    text: "New User Registered",
    detail: "Ali Raza joined",
    icon: UserPlus,
    iconColor: "text-[#A78BFA]",
    iconBg: "bg-[#A78BFA]/10",
    time: "5h ago",
  },
  {
    text: "Stock Movement",
    detail: "MacBook moved to WH-02",
    icon: ArrowLeftRight,
    iconColor: "text-[#34D399]",
    iconBg: "bg-[#34D399]/10",
    time: "6h ago",
  },
  {
    text: "Low Stock Alert",
    detail: "Mouse inventory dropped",
    icon: TriangleAlert,
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
    time: "8h ago",
  },
];

  return (
    <div className="flex flex-col gap-3 bg-[#1B1F23] border border-[#2A3036] p-4 rounded-xl h-full">
        {/* heading  */}
        <div className="flex justify-between items-center ">
            <h3 className="text-[#F3F4F6]">Recent Activities</h3>
            <button className="text-[#A1A1AA] text-xs hover:scale-105"> View All →</button>
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
            <p className="text-[#71717A] text-sm">{act.time}</p>
        </div>
        )
     })}
    </div>
  )
}

export default RecentActivity;


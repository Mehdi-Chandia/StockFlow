import { Package, Boxes, Truck, ShoppingCart } from "lucide-react";

const StatCard = () => {
const stats = [
  {
    title: "Total Products",
    value: "2,589",
    icon: Package,
    iconColor: "text-[#22D3EE]",
    iconBg: "bg-[#22D3EE]/10",
    change: "↑ 34%",
    changeText: "up",
  },
  {
    title: "Total Inventory",
    value: "12,480",
    icon: Boxes,
    iconColor: "text-[#818CF8]",
    iconBg: "bg-[#818CF8]/10",
    change: "↑ 18%",
    changeText: "up",
  },
  {
    title: "Shipments",
    value: "846",
    icon: Truck,
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
    change: "↓ 8%",
    changeText: "down",
  },
  {
    title: "Orders",
    value: "3,742",
    icon: ShoppingCart,
    iconColor: "text-[#A78BFA]",
    iconBg: "bg-[#A78BFA]/10",
    change: "↑ 27%",
    changeText: "up",
  },
];

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {/* card 1 */}
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title}
            className="bg-[#1B1F23] flex flex-col gap-2 justify-center items-center p-5 rounded-xl 
                     border border-[#2A3036] text-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex gap-1 items-center">
              <h3 className="text-[#A1A1AA]">{stat.title}</h3>
              <span className={`px-2 py-2 rounded-full ${stat.iconBg} `}>
                <Icon className={stat.iconColor} />
              </span>
            </div>
            <p className="text-[#F3F4F6] text-2xl font-semibold">
              {stat.value}
            </p>
            <div className="text-xs flex gap-2 items-center">
              <p className="text-green-500"> {stat.change}</p>
              <span className="text-[#71717A] text-sm">{stat.changeText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCard;

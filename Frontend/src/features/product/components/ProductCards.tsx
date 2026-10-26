import {
  Package,
  PackageCheck,
  PackageX,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const ProductCards = () => {
  const productStats = [
    {
      title: "Total Products",
      value: "1,284",
      change: 5.2,
      comparison: "vs last month",
      iconColor: "text-[#06B6D4]",
      iconBg: "bg-[#06B6D4]/10",
      icon: Package,
    },
    {
      title: "Active Products",
      value: "1,156",
      change: 8.4,
      comparison: "vs last month",
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      icon: PackageCheck,
    },
    {
      title: "Inactive Products",
      value: "128",
      change: -2.1,
      comparison: "vs last month",
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10",
      icon: PackageX,
    },
    {
      title: "Total Stock Value",
      value: "$284,560",
      change: 6.7,
      comparison: "vs last month",
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#8B5CF6]/10",
      icon: CircleDollarSign,
    },
  ];
  return (
    <div className=" ">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ">
        {productStats.map((stat) => {
          const Icon = stat.icon;

          const isPositive = stat.change >= 0;

          const isGood =
            stat.title === "Inactive Products" ? !isPositive : isPositive;

          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <div
            key={stat.title}
              className="bg-[#111B25] border border-[#25313D] flex gap-3 p-4 rounded-2xl  
                         transition-colors duration-200 hover:border-[#3B4B5C]"
            >
              <Icon
                className={`${stat.iconBg} ${stat.iconColor} rounded-2xl p-1`}
                size={35}
              />
              <TrendIcon
                size={18}
                className={isGood ? "text-emerald-400" : "text-red-400"}
              />
              <div className="space-y-2">
                <p className="text-sm text-[#94A3B8]">{stat.title}</p>
                <p className="text-2xl font-semibold text-[#F1F5F9]">
                  {stat.value}
                </p>
                <p className="text-[#10B981]">
                    
                    {stat.change}%</p>
                <span className="text-xs text-[#94A3B8]">
                  {stat.comparison}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCards;

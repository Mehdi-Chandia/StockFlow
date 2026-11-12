
import {
  Package,
  PackageCheck,
  PackageX,
  CircleDollarSign,
} from "lucide-react";

import StatsCards, {
  type IStatCard,
} from "../../../components/common/StatCard";

const ProductCards = () => {
  const productStats: IStatCard[] = [
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
      inverseTrend: true,
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

  return <StatsCards stats={productStats} />;
};

export default ProductCards;

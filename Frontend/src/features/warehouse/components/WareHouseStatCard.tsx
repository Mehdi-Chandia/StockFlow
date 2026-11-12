
import {
  Warehouse,
  WarehouseIcon,
  MapPin,
  Building2,
} from "lucide-react";

import StatsCards, {
  type IStatCard,
} from "../../../components/common/StatCard";

const WarehouseCards = () => {
  const warehouseStats: IStatCard[] = [
    {
      title: "Total Warehouses",
      value: 24,
      icon: Warehouse,
      iconColor: "text-[#06B6D4]",
      iconBg: "bg-[#06B6D4]/10",
      supportingText: "Registered locations",
    },
    {
      title: "Active Warehouses",
      value: 20,
      icon: WarehouseIcon,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      supportingText: "Currently operational",
    },
    {
      title: "Inactive Warehouses",
      value: 4,
      icon: Building2,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10",
      supportingText: "Currently unavailable",
    },
    {
      title: "Cities Covered",
      value: 12,
      icon: MapPin,
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#8B5CF6]/10",
      supportingText: "Across all locations",
    },
  ];

  return <StatsCards stats={warehouseStats} />;
};

export default WarehouseCards;

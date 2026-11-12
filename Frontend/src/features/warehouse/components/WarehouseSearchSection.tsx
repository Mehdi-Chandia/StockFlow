
import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import type { WareHouseFilters } from "../types/warehouse";

interface WarehouseSearchSectionProps {
  filters: WareHouseFilters;
  onFiltersChange: (filters: WareHouseFilters) => void;
}

const WarehouseSearchSection = ({
  filters,
  onFiltersChange,
}: WarehouseSearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: searchTerm,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.status]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="bg-[#111B25] border border-[#25313D] rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        {/* Search */}
        <div className="w-full lg:flex-1">
          <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
            Search Warehouses
          </label>

          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by warehouse, city, address..."
              className="w-full bg-[#0B1118] border border-[#25313D] rounded-xl pl-11 pr-11 py-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B] outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/20 transition-all"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <p className="text-xs text-[#64748B] mt-2">
            Search warehouses by name, location or contact details.
          </p>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-60">
          <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
            Warehouse Status
          </label>

          <div className="relative">
            <SlidersHorizontal
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
            />

            <select
              value={filters.status}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  status: e.target.value,
                })
              }
              className="w-full appearance-none bg-[#0B1118] border border-[#25313D] rounded-xl pl-10 pr-10 py-3 text-sm text-[#F1F5F9] outline-none focus:border-[#22D3EE] cursor-pointer transition-all"
            >
              <option value="">All Warehouses</option>
              <option value="ACTIVE">Active Warehouses</option>
              <option value="INACTIVE">Inactive Warehouses</option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
            />
          </div>

          <p className="text-xs text-[#64748B] mt-2">
            Filter by operational status.
          </p>
        </div>

      </div>
    </div>
  );
};

export default WarehouseSearchSection;

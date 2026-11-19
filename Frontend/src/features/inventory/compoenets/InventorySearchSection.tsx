
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { InventoryFilters } from "../types/inventory";

interface InventoryProps {
  filters: InventoryFilters;
  onFilterChange: (filters: InventoryFilters) => void;
}

const InventorySearchSection = ({
  filters,
  onFilterChange,
}: InventoryProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({
          ...filters,
          search: searchTerm,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.status]);

  return (
    <div className="bg-[#111B25] border border-[#25313D] rounded-xl p-4 mb-5">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product or warehouse..."
            className="w-full bg-[#0B1118] border border-[#2A3036] rounded-lg pl-10 pr-10 py-3 text-sm text-white outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 md:w-56">
          <SlidersHorizontal size={17} className="text-cyan-400" />

          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as InventoryFilters["status"],
              })
            }
            className="w-full bg-[#0B1118] border border-[#2A3036] rounded-lg px-3 py-3 text-sm text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Search by product name, warehouse name or city.
      </p>
    </div>
  );
};

export default InventorySearchSection;

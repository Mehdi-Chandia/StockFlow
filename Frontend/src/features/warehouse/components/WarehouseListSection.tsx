import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  UserRound,
  Warehouse,
  MoreVertical,
  Eye,
  Pencil,
  Power,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import type {
  WareHouseFilters,
  WarehouseI,
  WareHousePagination,
  WareHouseStatus,
} from "../types/warehouse";
import axios from "axios";
import { toast } from "react-toastify";
import { getWareHouses } from "../services/warehouseService";
import { useNavigate } from "react-router-dom";

interface WareHouseListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filters: WareHouseFilters;
  onStatusClick: (warehouse: WarehouseI) => void;
  updatedWarehouse: {
    warehouseId: string;
    status: WareHouseStatus;
  } | null;
}

const WarehouseListSection = ({
  page,
  setPage,
  filters,
  updatedWarehouse,
  onStatusClick,
}: WareHouseListProps) => {
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseI[]>([]);
  const [pagination, setPagination] = useState<WareHousePagination>();

  const navigate = useNavigate();

  const fetchWareHouses = async () => {
    setLoading(true);

    try {
      const response = await getWareHouses(page, 7, filters);
      // console.log("response ", response?.warehouses);

      setWarehouses(response.warehouses);
      setPagination(response.pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error fetching warehouses:", error.response?.data);
        toast.error(
          error.response?.data?.message || "Unable to fetch warehouses",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWareHouses();
  }, [filters, page]);

  useEffect(() => {
    if (!updatedWarehouse) return;

    setWarehouses((currentWH) =>
      currentWH.map((warehouse) =>
        warehouse._id === updatedWarehouse.warehouseId
          ? { ...warehouse, status: updatedWarehouse.status }
          : warehouse,
      ),
    );
  }, [updatedWarehouse]);

  return (
    <div className="w-full max-w-full min-w-0 bg-[#111B25] border border-[#25313D] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-[#25313D]">
        <div>
          <h2 className="text-lg font-semibold text-[#F1F5F9]">
            Warehouse Locations
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            View and manage all registered warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <Warehouse size={17} className="text-[#22D3EE]" />
          <span>
            {pagination?.totalRecords ?? warehouses.length} Warehouses
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="text-[#22D3EE] animate-spin" />
          <p className="text-sm text-[#94A3B8] mt-3">Loading warehouses...</p>
        </div>
      ) : warehouses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/10">
            <Search size={27} className="text-[#22D3EE]" />
          </div>

          <h3 className="text-[#F1F5F9] font-semibold mt-4">
            No warehouses found
          </h3>

          <p className="text-sm text-[#64748B] mt-2 text-center">
            No warehouses match your current search or filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block w-full min-w-0 overflow-hidden">
            <table className="w-full table-fixed text-left">
              <thead className="bg-[#0B1118] text-xs uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="w-[23%] px-3 xl:px-5 py-4 font-medium">
                    Warehouse
                  </th>
                  <th className="w-[19%] px-3 xl:px-5 py-4 font-medium">
                    Location
                  </th>
                  <th className="w-[13%] px-3 xl:px-5 py-4 font-medium">
                    Manager
                  </th>
                  <th className="w-[19%] px-3 xl:px-5 py-4 font-medium">
                    Contact
                  </th>
                  <th className="w-[12%] px-3 xl:px-5 py-4 font-medium">
                    Status
                  </th>
                  <th className="w-[14%] px-3 xl:px-5 py-4 font-medium text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#25313D]">
                {warehouses.map((warehouse) => (
                  <tr
                    key={warehouse._id}
                    className="hover:bg-[#172431] transition-colors"
                  >
                    {/* Warehouse */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#22D3EE]/10">
                          <Warehouse size={19} className="text-[#22D3EE]" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#F1F5F9] truncate">
                            {warehouse.name}
                          </p>
                          <p className="text-xs text-[#64748B] mt-1 truncate">
                            {warehouse.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={15}
                          className="text-[#22D3EE] mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-sm text-[#CBD5E1]">
                            {warehouse.city}
                          </p>
                          <p className="text-xs text-[#64748B] mt-1 max-w-[180px] truncate">
                            {warehouse.address}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Manager */}
                    <td className="px-5 py-4 max-w-2">
                      <div className="flex items-center gap-2">
                        <UserRound size={15} className="text-[#64748B]" />
                        <span className="text-sm text-[#CBD5E1] break-all">
                          {warehouse.manager}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Phone size={13} />
                          {warehouse.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <Mail size={13} />
                          {warehouse.email}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                          warehouse.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            warehouse.status === "ACTIVE"
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          }`}
                        />
                        {warehouse.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center flex-col justify-end gap-2">
                        <button
                        onClick={()=> navigate(`/warehouses/${warehouse._id}`)}
                          type="button"
                          title="View warehouse"
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-colors"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit warehouse"
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-colors"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Change warehouse status"
                          onClick={() => onStatusClick(warehouse)}
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                        >
                          <Power size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse._id}
                className="bg-[#0B1118] border border-[#25313D] rounded-xl p-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-[#22D3EE]/10">
                      <Warehouse size={20} className="text-[#22D3EE]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#F1F5F9] truncate">
                        {warehouse.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1">
                        {warehouse.city}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0 ${
                      warehouse.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {warehouse.status}
                  </span>
                </div>

                <div className="border-t border-[#25313D] mt-4 pt-4 space-y-3">
                  <div className="flex gap-2 text-xs text-[#94A3B8]">
                    <MapPin size={14} className="text-[#22D3EE] shrink-0" />
                    <span>{warehouse.address}</span>
                  </div>

                  <div className="flex gap-2 text-xs text-[#94A3B8]">
                    <UserRound size={14} className="shrink-0" />
                    <span>{warehouse.manager}</span>
                  </div>

                  <div className="flex gap-2 text-xs text-[#94A3B8]">
                    <Phone size={14} className="shrink-0" />
                    <span>{warehouse.phone}</span>
                  </div>

                  <div className="flex gap-2 text-xs text-[#94A3B8]">
                    <Mail size={14} className="shrink-0" />
                    <span className="break-all">{warehouse.email}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[#25313D] mt-4 pt-3">
                  <button
                    type="button"
                    title="View warehouse"
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    type="button"
                    title="Edit warehouse"
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#22D3EE]/10"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    title="Change status"
                    onClick={() => onStatusClick(warehouse)}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-amber-400 hover:bg-amber-400/10"
                  >
                    <Power size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && warehouses.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-[#25313D]">
          <p className="text-xs text-[#64748B]">
            Page <span className="text-[#F1F5F9] font-medium">{page}</span> of{" "}
            <span className="text-[#F1F5F9] font-medium">
              {pagination?.totalPages ?? 1}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination?.hasPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#25313D] text-sm text-[#CBD5E1] hover:border-[#22D3EE] hover:text-[#22D3EE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={!pagination?.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#25313D] text-sm text-[#CBD5E1] hover:border-[#22D3EE] hover:text-[#22D3EE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseListSection;

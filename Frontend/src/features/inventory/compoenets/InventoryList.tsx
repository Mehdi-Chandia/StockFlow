import { useEffect, useState } from "react";
import type {
  IInventoryWithAggregation,
  InventoryFilters,
  InventoryPagination,
  InventoryStatus,
} from "../types/inventory";
import axios from "axios";
import { toast } from "react-toastify";
import { getInventories } from "../services/inventoryService";
import {
  Package,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";

interface InventoryListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filters: InventoryFilters;
  onStatusChange: (inventory: IInventoryWithAggregation) => void;
  updatedInventory: {
    inventoryId: string;
    status: InventoryStatus;
  } | null;
}

const InventoryList = ({
  page,
  setPage,
  filters,
  onStatusChange,
  updatedInventory,
}: InventoryListProps) => {
  const [inventories, setInventories] = useState<IInventoryWithAggregation[]>(
    [],
  );
  const [pagination, setPagination] = useState<InventoryPagination>();
  const [loading, setLoading] = useState(false);

  const fetchInventories = async () => {
    setLoading(true);

    try {
      const response = await getInventories(page, 7, filters);

      console.log("inventories", response);

      setInventories(response.inventories ?? []);
      setPagination(response?.pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error fetching inventories:", error.response?.data);
        toast.error(
          error.response?.data?.message || "Failed to fetch inventories",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [filters, page]);

  useEffect(() => {
    if (!updatedInventory) return;

    setInventories((current) =>
      current.map((inventory) =>
        inventory._id === updatedInventory.inventoryId
          ? { ...inventory, status: updatedInventory.status }
          : inventory,
      ),
    );
  }, [updatedInventory]);

  const getStockStatus = (quantity: number, reorderlevel: number) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        style: "bg-red-500/10 text-red-400",
      };
    }

    if (quantity <= reorderlevel) {
      return {
        label: "Low Stock",
        style: "bg-amber-500/10 text-amber-400",
      };
    }

    return {
      label: "In Stock",
      style: "bg-emerald-500/10 text-emerald-400",
    };
  };

  return (
    <div className="bg-[#111B25] border border-[#25313D] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 border-b border-[#25313D]">
        <div>
          <h2 className="text-white font-semibold">Inventory Records</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track product quantities across your warehouses.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          {pagination?.totalItems ?? 0} records
        </span>
      </div>

      {/* Loading and Empty State */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Loading inventory...
        </div>
      ) : inventories.length === 0 ? (
        <div className="py-16 text-center">
          <Package size={36} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-medium">
            No inventory records found
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0B1118] text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Warehouse</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Stock Condition</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#25313D]">
                {inventories.map((inventory) => {
                  const stock = getStockStatus(
                    inventory.quantity,
                    inventory.reorderlevel,
                  );

                  return (
                    <tr
                      key={inventory._id}
                      className="hover:bg-[#16222D] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm text-white font-medium">
                          {inventory.productDetails.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          SKU: {inventory.productDetails.sku}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-300">
                          {inventory.warehouseDetails.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {inventory.warehouseDetails.city}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-white font-semibold text-sm">
                          {inventory.quantity}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          units
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${stock.style}`}
                        >
                          {stock.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            inventory.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {inventory.status}
                        </span>
                      </td>
                      {/* actions */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-end gap-1">
                          <Link
                            to={`/inventory/${inventory._id}`}
                            className="text-xs text-slate-400 hover:text-cyan-400 transition"
                          >
                            View
                          </Link>

                          <Link
                            to={`/inventory/${inventory._id}/edit`}
                            className="text-xs text-slate-400 hover:text-cyan-400 transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => onStatusChange(inventory)}
                            className={`text-xs transition ${
                              inventory.status === "ACTIVE"
                                ? "text-red-400 hover:text-red-300"
                                : "text-emerald-400 hover:text-emerald-300"
                            }`}
                          >
                            {inventory.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#25313D]">
            {inventories.map((inventory) => {
              const stock = getStockStatus(
                inventory.quantity,
                inventory.reorderlevel,
              );

              return (
                <div key={inventory._id} className="p-4 space-y-3">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-white text-sm font-medium">
                        {inventory.productDetails.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        SKU: {inventory.productDetails.sku}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Link
                        to={`/inventory/${inventory._id}`}
                        className="text-xs text-slate-400 hover:text-cyan-400"
                      >
                        View
                      </Link>

                      <Link
                        to={`/inventory/${inventory._id}/edit`}
                        className="text-xs text-slate-400 hover:text-cyan-400"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => onStatusChange(inventory)}
                        className={`text-xs ${
                          inventory.status === "ACTIVE"
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {inventory.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={14} className="text-cyan-400" />
                    {inventory.warehouseDetails.name},{" "}
                    {inventory.warehouseDetails.city}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-slate-300">
                      Quantity:{" "}
                      <span className="text-white font-semibold">
                        {inventory.quantity}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${stock.style}`}
                      >
                        {stock.label}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          inventory.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {inventory.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 p-4 border-t border-[#25313D]">
          <p className="text-xs text-slate-500">
            Page {page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
              className="p-2 rounded-lg border border-[#2A3036] text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="p-2 rounded-lg border border-[#2A3036] text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;

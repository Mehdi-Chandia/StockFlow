
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWareHouse } from "../services/warehouseService";
import type { WarehouseI } from "../types/warehouse";

const ViewWareHousePage = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warehouse, setWarehouse] = useState<WarehouseI | null>(null);

  const fetchWareHouse = async () => {
    if (!warehouseId) {
      setError("Warehouse ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getWareHouse(warehouseId);
      setWarehouse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Failed to fetch warehouse details"
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWareHouse();
  }, [warehouseId]);

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center text-[#94A3B8]">
        Loading warehouse details...
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-red-400 mb-4">
          {error || "Warehouse not found"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-[#22D3EE] text-[#111315] font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#94A3B8] hover:text-[#22D3EE] mb-3"
          >
            ← Back to Warehouses
          </button>

          <h1 className="text-2xl font-semibold text-white">
            Warehouse Details
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            View information about this warehouse.
          </p>
        </div>

        <span
          className={`w-fit px-4 py-2 rounded-full text-sm font-medium ${
            warehouse.status === "ACTIVE"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {warehouse.status}
        </span>
      </div>

      {/* Warehouse Details */}
      <div className="bg-[#111B25] border border-[#25313D] rounded-xl p-5 sm:p-7">

        <div className="mb-6 pb-5 border-b border-[#25313D]">
          <h2 className="text-xl font-semibold text-white">
            {warehouse.name}
          </h2>
          <p className="text-sm text-[#94A3B8] mt-1">
            {warehouse.city}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">

          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Warehouse Name</p>
            <p className="text-white font-medium ">
              {warehouse.name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#94A3B8] mb-2">City</p>
            <p className="text-white font-medium ">
              {warehouse.city || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Email Address</p>
            <p className="text-white font-medium break-all">
              {warehouse.email || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Phone Number</p>
            <p className="text-white font-medium ">
              {warehouse.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Manager</p>
            <p className="text-white font-medium ">
              {warehouse.manager || "Not assigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Status</p>
            <p className="text-white font-medium">
              {warehouse.status}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-[#94A3B8] mb-2">Full Address</p>
            <p className="text-white font-medium leading-relaxed">
              {warehouse.address || "No address provided"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewWareHousePage;

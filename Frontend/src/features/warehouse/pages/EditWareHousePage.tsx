import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getWareHouse } from '../services/warehouseService';
import axios from 'axios';
import type { WarehouseI } from '../types/warehouse';



const EditWareHousePage = () => {

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
    <div>EditWareHousePage</div>
  )
}

export default EditWareHousePage
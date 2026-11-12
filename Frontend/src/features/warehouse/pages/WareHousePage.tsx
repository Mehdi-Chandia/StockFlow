import React, { useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { Warehouse } from "lucide-react";
import WarehouseCards from "../components/WareHouseStatCard";
import WarehouseSearchSection from "../components/WarehouseSearchSection";
import type {
  WareHouseFilters,
  WarehouseI,
  WareHouseStatus,
} from "../types/warehouse";
import WarehouseListSection from "../components/WarehouseLIstSection";
import { updateWarehouseStatus } from "../services/warehouseService";
import { toast } from "react-toastify";
import axios from "axios";
import WarehouseStatusModal from "../components/WarehouseStatusModal";

const WareHousePage = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const [page, setPage] = useState(1);
  const [statusModal, setStatusModal] = useState<{
    warehouse: WarehouseI;
    status: WareHouseStatus;
  } | null>(null);

  const [updatedWarehouse, setUpdatedWarehouse] = useState<{
    warehouseId: string;
    status: WareHouseStatus;
  } | null>(null);

  const handleFilterChange = (filters: WareHouseFilters) => {
    setFilters(filters);
    setPage(1);
  };

  const handleStatusClick = (warehouse: WarehouseI) => {
    setStatusModal({
      warehouse,
      status: warehouse.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  const handleConfirmStatus = async () => {
    if (!statusModal?.warehouse._id) {
      return;
    }

    try {
      const { warehouse, status } = statusModal;
      const response = await updateWarehouseStatus(status, warehouse._id!);

      setUpdatedWarehouse({
        warehouseId: warehouse._id!,
        status: status,
      });

      toast.success("warehouse status updated successfully!");
      console.log("response of warehouse status updation", response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "error while updating the warehouse status ",
          error.response?.data,
        );
        toast.error(error.response?.data);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 m-4">
      {/* status modal */}
      {statusModal && (
        <WarehouseStatusModal
          warehouseName={statusModal.warehouse.name}
          status={statusModal.status}
          onConfirm={handleConfirmStatus}
          onCancel={() => setStatusModal(null)}
        />
      )}
      {/* page header */}
      <section>
        <PageHeader
          title="WareHouse"
          description="Manage your warehouse locations and operations"
          icon={Warehouse}
          buttonText="Add Warehouse"
          buttonPath="/warehouses/create"
        />
      </section>
      {/* stat cards */}
      <section>
        <WarehouseCards />
      </section>
      {/* search bar section */}
      <section>
        <WarehouseSearchSection
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
      </section>
      {/* warehouse list */}
      <section>
        <WarehouseListSection
          page={page}
          setPage={setPage}
          filters={filters}
          onStatusClick={handleStatusClick}
          updatedWarehouse={updatedWarehouse}
        />
      </section>
    </div>
  );
};

export default WareHousePage;

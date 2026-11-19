import { PackagePlus, Warehouse } from "lucide-react"
import PageHeader from "../../../components/common/PageHeader"
import { useState } from "react"
import type { IInventory, IInventoryWithAggregation, InventoryFilters, InventoryStatus } from "../types/inventory"
import InventorySearchSection from "../compoenets/InventorySearchSection"
import axios from "axios"
import { toast } from "react-toastify"
import { updateInventoryStatus } from "../services/inventoryService"
import InventoryList from "../compoenets/InventoryList"
import ConfirmationModal from "../../../components/common/ConfirmationModal"

const Inventory = () => {
  const [filters, setFilters]= useState<InventoryFilters>({
    search:"",
    status:""
  })
  const [page, setPage] = useState(1)
  const [statusModal, setStatusModal] = useState<{inventory:IInventoryWithAggregation, status: InventoryStatus} | null>(null)
  const [updatedInventory, setUpdatedInventory]= useState<{inventoryId: string, status: InventoryStatus} | null>(null)

  const handleFilterChange=(filters: InventoryFilters)=>{
    setFilters(filters)
    setPage(1)
  }

  const handleStatusClick= (inventory: IInventoryWithAggregation)=>{
    setStatusModal({
      inventory,
      status: inventory.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    })
  }

  const handleStatusConfirm=async ()=>{
    if (!statusModal?.inventory._id) return;
    try {
      const {status, inventory}= statusModal
      const response= await updateInventoryStatus(status, inventory._id!)
      console.log("response after status update", response);

      setUpdatedInventory({
        inventoryId: inventory._id!,
        status
      })
      toast.success("inventory status updated successfully!")

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error while updating the status of inventory", error.response?.data);
        toast.error(error.response?.data)
      }
    }
  }

  return (
    <div>
      {/* status confirmation modal  */}
      {statusModal && (
    <ConfirmationModal
        title={
            statusModal.status === "INACTIVE"
                ? "Deactivate Inventory"
                : "Activate Inventory"
        }
        message={`Are you sure you want to ${
            statusModal.status === "INACTIVE" ? "deactivate" : "activate"
        } this inventory record?`}
        itemName={`${statusModal.inventory.productDetails.name} — ${statusModal.inventory.warehouseDetails.name}`}
        confirmText={
            statusModal.status === "INACTIVE" ? "Deactivate" : "Activate"
        }
        variant={
            statusModal.status === "INACTIVE" ? "danger" : "success"
        }
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusModal(null)}
    />
)}
      {/* page header */}
      <section>
        <PageHeader
        title="Inventory"
        description="Monitor and manage product stock across your warehouses."
        buttonText="Add Stock"
        buttonPath="/inventory/create"
        icon={PackagePlus}
      />
      </section>
      {/* search section */}
      <section className="m-4">
        <InventorySearchSection
        filters={filters}
        onFilterChange={handleFilterChange}
        />
      </section>
      {/* list inventory */}
      <section className="m-2">
        <InventoryList
        page={page}
        setPage={setPage}
        filters={filters}
        onStatusChange={handleStatusClick}
        updatedInventory={updatedInventory}
        />
      </section>
    </div>
  )
}

export default Inventory
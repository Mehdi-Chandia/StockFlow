import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    Warehouse,
    MapPin,
    Hash,
    Layers,
    RefreshCw,
    IndianRupee,
    CalendarDays
} from "lucide-react";

import { getInventory } from "../services/inventoryService";
import type { IInventoryWithAggregation } from "../types/inventory";

const ViewInventoryPage = () => {
    const { inventoryId } = useParams();

    const [loading, setLoading] = useState(false);
    const [inventory, setInventory] = useState<IInventoryWithAggregation | null>(null);

    const fetchInventory = async () => {
        if (!inventoryId) return;

        setLoading(true);

        try {
            const response = await getInventory(inventoryId);

            console.log("inventory", response.data);
            setInventory(response.data);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error while fetching inventory", error.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [inventoryId]);

    const getStockStatus = (quantity: number, reorderlevel: number) => {
        if (quantity === 0) {
            return {
                label: "Out of Stock",
                style: "bg-red-500/10 text-red-400 border-red-500/20"
            };
        }

        if (quantity <= reorderlevel) {
            return {
                label: "Low Stock",
                style: "bg-amber-500/10 text-amber-400 border-amber-500/20"
            };
        }

        return {
            label: "In Stock",
            style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        };
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <RefreshCw className="animate-spin text-cyan-400" size={28} />
            </div>
        );
    }

    if (!inventory) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <Package size={42} className="mb-3 text-slate-500" />
                <h2 className="text-lg font-semibold text-white">
                    Inventory Not Found
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    The inventory record could not be found.
                </p>
                <Link
                    to="/inventory"
                    className="mt-5 text-sm text-cyan-400 hover:text-cyan-300"
                >
                    Back to Inventory
                </Link>
            </div>
        );
    }

    const stockStatus = getStockStatus(
        inventory.quantity,
        inventory.reorderlevel
    );

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <Link
                        to="/inventory"
                        className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
                    >
                        <ArrowLeft size={16} />
                        Back to Inventory
                    </Link>

                    <h1 className="text-2xl font-semibold text-white">
                        Inventory Details
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        View product stock information and warehouse details.
                    </p>
                </div>

                <Link
                    to={`/inventory/${inventory._id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-[#0B1118] transition hover:bg-cyan-400"
                >
                    Edit Inventory
                </Link>

            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5">
                    <p className="text-sm text-slate-400">Available Quantity</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        {inventory.quantity}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">Units available</p>
                </div>

                <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5">
                    <p className="text-sm text-slate-400">Reorder Level</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        {inventory.reorderlevel}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">Minimum stock threshold</p>
                </div>

                <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5">
                    <p className="text-sm text-slate-400">Stock Condition</p>
                    <div className="mt-3">
                        <span className={`rounded-full border px-3 py-1.5 text-sm font-medium ${stockStatus.style}`}>
                            {stockStatus.label}
                        </span>
                    </div>
                </div>

            </div>

            {/* Product Details */}
            <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400">
                        <Package size={21} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-white">Product Information</h2>
                        <p className="text-xs text-slate-400">Associated product details</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>
                        <p className="text-xs text-slate-500">Product Name</p>
                        <p className="mt-1 font-medium text-white">
                            {inventory.productId.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">SKU</p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                            <Hash size={15} />
                            {inventory.productId.sku}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">Category</p>
                        <p className="mt-1 flex items-center gap-2 text-sm capitalize text-slate-300">
                            <Layers size={15} />
                            {inventory.productId.category}
                        </p>
                    </div>

                </div>

            </div>

            {/* Warehouse Details */}
            <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400">
                        <Warehouse size={21} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-white">Warehouse Information</h2>
                        <p className="text-xs text-slate-400">Warehouse storing this product</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>
                        <p className="text-xs text-slate-500">Warehouse Name</p>
                        <p className="mt-1 font-medium text-white">
                            {inventory.warehouseId.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">Warehouse Code</p>
                        <p className="mt-1 text-sm text-slate-300">
                            {inventory.warehouseId.code}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">City</p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                            <MapPin size={15} />
                            {inventory.warehouseId.city}
                        </p>
                    </div>

                </div>

            </div>

            {/* Inventory Record */}
            <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5 sm:p-6">

                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400">
                        <CalendarDays size={21} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-white">Inventory Record</h2>
                        <p className="text-xs text-slate-400">Record identification and status</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    <div>
                        <p className="text-xs text-slate-500">Inventory ID</p>
                        <p className="mt-1 break-all text-sm text-slate-300">
                            {inventory._id}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">Record Status</p>
                        <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            inventory.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                        }`}>
                            {inventory.status}
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ViewInventoryPage;
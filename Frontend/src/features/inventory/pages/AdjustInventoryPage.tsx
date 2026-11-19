
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Package, Warehouse, Plus, Minus, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import { StockMovementReason, type AdjustmentType, type IInventory } from "../types/inventory";
import { getInventory, adjustInventory } from "../services/inventoryService";



const AdjustInventoryPage = () => {
    const { inventoryId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [inventory, setInventory] = useState<IInventory | null>(null);

    const [formData, setFormData] = useState({
        quantity: "",
        type: "IN" as AdjustmentType,
        reason: StockMovementReason.ADJUSTMENT
    });

    const fetchInventory = async () => {
        if (!inventoryId) return;

        setLoading(true);

        try {
            const response = await getInventory(inventoryId);
            setInventory(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Error fetching inventory:", error.response?.data);
                toast.error("Failed to fetch inventory");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [inventoryId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!inventoryId) return;

        if (Number(formData.quantity) <= 0) {
            toast.error("Quantity must be greater than zero");
            return;
        }

        setSubmitting(true);

        try {
            await adjustInventory(inventoryId, {
                quantity: Number(formData.quantity),
                type: formData.type,
                reason: formData.reason
            });

            toast.success("Inventory adjusted successfully!");
            navigate("/inventory");

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Error adjusting inventory:", error.response?.data);

                toast.error(
                    error.response?.data?.message || "Failed to adjust inventory"
                );
            }
        } finally {
            setSubmitting(false);
        }
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
            <div className="py-20 text-center">
                <h2 className="text-lg font-semibold text-white">
                    Inventory Not Found
                </h2>

                <Link
                    to="/inventory"
                    className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300"
                >
                    Back to Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">

            {/* Header */}
            <div>
                <Link
                    to="/inventory"
                    className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
                >
                    <ArrowLeft size={16} />
                    Back to Inventory
                </Link>

                <h1 className="text-2xl font-semibold text-white">
                    Adjust Inventory
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Add stock or remove stock from this warehouse.
                </p>
            </div>

            {/* Inventory Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Package size={17} />
                        <span className="text-sm">Product</span>
                    </div>

                    <h3 className="mt-3 font-medium text-white">
                        {inventory.productId.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                        {inventory.productId.sku}
                    </p>
                </div>

                <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Warehouse size={17} />
                        <span className="text-sm">Warehouse</span>
                    </div>

                    <h3 className="mt-3 font-medium text-white">
                        {inventory.warehouseId.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                        {inventory.warehouseId.city}
                    </p>
                </div>

                <div className="rounded-xl border border-[#2A3036] bg-[#111B25] p-5">
                    <p className="text-sm text-slate-400">
                        Current Quantity
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold text-white">
                        {inventory.quantity}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                        Available units
                    </p>
                </div>

            </div>

            {/* Adjustment Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border border-[#2A3036] bg-[#111B25] p-5 sm:p-7"
            >

                <div>
                    <h2 className="font-semibold text-white">
                        Stock Adjustment
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Choose the adjustment type and enter the quantity.
                    </p>
                </div>

                {/* Adjustment Type */}
                <div>
                    <label className="mb-3 block text-sm font-medium text-slate-300">
                        Adjustment Type
                    </label>

                    <div className="grid grid-cols-2 gap-4">

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: "IN" }))}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition ${
                                formData.type === "IN"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                    : "border-[#2A3036] text-slate-400 hover:bg-[#0B1118]"
                            }`}
                        >
                            <Plus size={18} />
                            Stock In
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: "OUT" }))}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition ${
                                formData.type === "OUT"
                                    ? "border-red-500 bg-red-500/10 text-red-400"
                                    : "border-[#2A3036] text-slate-400 hover:bg-[#0B1118]"
                            }`}
                        >
                            <Minus size={18} />
                            Stock Out
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: "TRANSFER" }))}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition ${
                                formData.type === "TRANSFER"
                                    ? "border-yellow-500 bg-red-500/10 text-yellow-400"
                                    : "border-[#2A3036] text-slate-400 hover:bg-[#0B1118]"
                            }`}
                        >
                            <Minus size={18} />
                            Stock Transfer
                        </button>

                        

                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Quantity
                    </label>

                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        step="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        required
                        className="w-full rounded-lg border border-[#25313D] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
                    />

                    {formData.type === "OUT" && (
                        <p className="mt-2 text-xs text-amber-400">
                            Maximum available quantity: {inventory.quantity}
                        </p>
                    )}
                </div>

                {/* Reason */}
<div>
    <label className="mb-2 block text-sm font-medium text-slate-300">
        Reason
    </label>

    <select
        name="reason"
        value={formData.reason}
        onChange={(e) =>
            setFormData(prev => ({
                ...prev,
                reason: e.target.value as StockMovementReason
            }))
        }
        required
        className="w-full rounded-lg border border-[#25313D] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
    >
        {Object.values(StockMovementReason).map(reason => (
            <option key={reason} value={reason}>
                {reason.replaceAll("_", " ")}
            </option>
        ))}
    </select>
</div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-[#2A3036] pt-5">

                    <button
                        type="button"
                        onClick={() => navigate("/inventory")}
                        className="rounded-lg border border-[#2A3036] px-5 py-2.5 text-sm text-slate-300 transition hover:bg-[#25313D]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            formData.type === "IN"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        {submitting
                            ? "Processing..."
                            : formData.type === "IN"
                                ? "Add Stock"
                                : "Remove Stock"
                        }
                    </button>

                </div>

            </form>
        </div>
    );
};

export default AdjustInventoryPage;

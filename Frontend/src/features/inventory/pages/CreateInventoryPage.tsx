import { useEffect, useState } from "react";
import type { IProduct } from "../../product/types/product";
import type { WarehouseI } from "../../warehouse/types/warehouse";
import { listProducts } from "../../product/services/productService";
import { listWareHouses } from "../../warehouse/services/warehouseService";
import { createInventory } from "../services/inventoryService";
import type{ CreateInventoryFormData } from "../schemas/inventory";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const CreateInventoryPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseI[]>([]);

  const navigateTo= useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateInventoryFormData>({
    productId: "",
    warehouseId: "",
    quantity: 1,
    reorderlevel: 1,
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await listProducts();

      setProducts(res.products ?? []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error while fetching products:", error.response?.data);
        toast.error("Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const res = await listWareHouses();

      setWarehouses(res.warehouses ?? []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error while fetching warehouses:", error.response?.data);
        toast.error("Failed to fetch warehouses");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  // Handle inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.productId || !formData.warehouseId) {
      toast.error("Please select a product and warehouse");
      return;
    }

    setSubmitting(true);

    try {
      await createInventory({
        ...formData,
        quantity: Number(formData.quantity),
        reorderlevel: Number(formData.reorderlevel),
      });

      toast.success("Inventory created successfully!");
      navigateTo("/inventory")

      setFormData({
        productId: "",
        warehouseId: "",
        quantity: 1,
        reorderlevel: 1,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error creating inventory:", error.response?.data);
        toast.error(
          error.response?.data?.message || "Failed to create inventory"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] p-4 text-white md:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">Create Inventory</h1>
        <p className="mt-1 text-sm text-slate-400">
          Assign a product to a warehouse and set its initial stock.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-6 rounded-xl border border-[#25313D] bg-[#111B25] p-5 md:p-7"
        >
          {/* Product */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Select Product
            </label>

            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full rounded-lg border border-[#25313D] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="">
                {loading ? "Loading products..." : "Choose a product"}
              </option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Select Warehouse
            </label>

            <select
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full rounded-lg border border-[#25313D] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="">
                {loading ? "Loading warehouses..." : "Choose a warehouse"}
              </option>

              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name} ({warehouse.city})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity and Reorder Level */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Initial Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#25313D] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reorder Level
              </label>

              <input
                type="number"
                name="reorderlevel"
                min="1"
                value={formData.reorderlevel}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#25313D] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="Enter reorder level"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || loading || !products.length || !warehouses.length}
            className="w-full rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-[#0B1118] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating Inventory..." : "Create Inventory"}
          </button>
          <div>
            <Link className="mt-3 text-gray-500 hover:text-blue-400 transition-all duration-200" to={"/inventory"}> ← Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInventoryPage;
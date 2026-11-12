
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, Save, Package, Tag, DollarSign, Boxes, Building2, FileText,
} from "lucide-react";
import type { IProduct } from "../types/product";
import { editProduct, getProduct, type IEditProduct,
} from "../services/productService";
import { editProductSchema, type EditProductFormData } from "../schemas/productSchema";

const inputClass =
  "w-full rounded-xl border border-[#2A3036] bg-[#0B1118] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#64748B] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 disabled:cursor-not-allowed disabled:opacity-50";

const labelClass = "mb-2 block text-sm font-medium text-[#CBD5E1]";

const EditProductPage = () => {
  const { productId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState<IProduct>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      purchasePrice: 0,
      sellPrice: 0,
      minQty: 0,
      maxQty: 0,
      description: "",
    },
  });

//   fetch the product to fill the form 
  const fetchProduct = async () => {
    if (!productId) {
      setError("Product ID not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getProduct(productId);
      const fetchedProduct: IProduct | undefined = response?.data;

      if (!fetchedProduct) {
        setError("Product details were not returned by the server");
        return;
      }

      setProduct(fetchedProduct);

      reset({
        name: fetchedProduct.name ?? "",
        category: fetchedProduct.category ?? "",
        brand: fetchedProduct.brand ?? "",
        purchasePrice: fetchedProduct.purchasePrice,
        sellPrice: fetchedProduct.sellPrice,
        minQty: fetchedProduct.minQty,
        maxQty: fetchedProduct.maxQty,
        description: fetchedProduct.description ?? "",
      });
    } catch (error: unknown) {
      console.error("Error fetching product:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to fetch product details"
        );
      } else {
        setError("An unexpected error occurred while fetching the product");
      }
    } finally {
      setLoading(false);
    }
  };


//   handle product edit
  const handleEditProduct = async (data: EditProductFormData) => {
    if (!productId) {
      setError("Product ID not found");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const editData: IEditProduct = data;
      await editProduct(productId, editData);

      setSuccess("Product updated successfully");
      reset(data);
    } catch (error: unknown) {
      console.error("Error updating product:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Unable to update product details"
        );
      } else {
        setError("An unexpected error occurred while updating the product");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading && !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#2A3036] border-t-[#22D3EE]" />
        <p className="text-sm text-[#94A3B8]">Loading product details...</p>
      </div>
    );
  }

  if (!product && error) {
    return (
      <div className="mx-4 rounded-2xl border border-[#2A3036] bg-[#111B25] p-8 text-center">
        <Package className="mx-auto mb-3 text-red-400" size={32} />
        <h2 className="text-lg font-semibold text-white">
          Unable to Load Product
        </h2>
        <p className="mt-2 text-sm text-red-400">{error}</p>
        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#2A3036] px-4 py-2 text-sm text-[#CBD5E1] hover:border-[#22D3EE] hover:text-[#22D3EE]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-w-0 space-y-6 px-4 pb-8 text-[#F1F5F9] sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            to="/products"
            aria-label="Back to products"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2A3036] bg-[#111B25] text-[#94A3B8] transition hover:border-[#22D3EE] hover:text-[#22D3EE]"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <p className="text-sm text-[#94A3B8]">Inventory / Products</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Edit Product
            </h1>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Update product information and pricing.
            </p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            product.status === "ACTIVE"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {product.status}
        </span>
      </div>

      {/* Product identity */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#2A3036] bg-[#111B25] p-4 sm:p-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#2A3036] bg-[#0B1118]">
          {product.image?.url ? (
            <img
              src={product.image.url}
              alt={product.name}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <Package size={28} className="text-[#64748B]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="break-words font-semibold text-white">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            SKU: {product.sku}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            Update the editable fields below and save your changes.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
        >
          {success}
        </div>
      )}

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit(handleEditProduct)}
        className="overflow-hidden rounded-2xl border border-[#2A3036] bg-[#111B25]"
      >
        {/* Basic Information */}
        <div className="border-b border-[#2A3036] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <Package size={20} className="text-[#22D3EE]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Basic Information</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Product name, category, brand and description
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label htmlFor="name" className={labelClass}>
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              {...register("name")}
              disabled={loading}
              placeholder="Enter product name"
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Tag
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />
              <select
                id="category"
                {...register("category")}
                disabled={loading}
                className={`${inputClass} pl-10`}
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
            {errors.category && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className={labelClass}>
              Brand <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />
              <input
                id="brand"
                {...register("brand")}
                disabled={loading}
                placeholder="Enter brand"
                className={`${inputClass} pl-10`}
              />
            </div>
            {errors.brand && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sku" className={labelClass}>
              SKU
            </label>
            <input
              id="sku"
              value={product.sku}
              readOnly
              className={`${inputClass} cursor-not-allowed text-[#64748B]`}
            />
            <p className="mt-1.5 text-xs text-[#64748B]">
              SKU is read-only on this form.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <div className="relative">
              <FileText
                size={17}
                className="pointer-events-none absolute left-3 top-3.5 text-[#64748B]"
              />
              <textarea
                id="description"
                {...register("description")}
                disabled={loading}
                rows={4}
                placeholder="Describe this product..."
                className={`${inputClass} resize-y pl-10`}
              />
            </div>
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="border-y border-[#2A3036] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <DollarSign size={20} className="text-[#22D3EE]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Pricing</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Set purchase and selling prices
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label htmlFor="purchasePrice" className={labelClass}>
              Purchase Price <span className="text-red-400">*</span>
            </label>
            <input
              id="purchasePrice"
              type="number"
              min="0"
              step="any"
              {...register("purchasePrice", { valueAsNumber: true })}
              disabled={loading}
              className={inputClass}
            />
            {errors.purchasePrice && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sellPrice" className={labelClass}>
              Selling Price <span className="text-red-400">*</span>
            </label>
            <input
              id="sellPrice"
              type="number"
              min="0"
              step="any"
              {...register("sellPrice", { valueAsNumber: true })}
              disabled={loading}
              className={inputClass}
            />
            {errors.sellPrice && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.sellPrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Stock Limits */}
        <div className="border-y border-[#2A3036] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <Boxes size={20} className="text-[#22D3EE]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Stock Limits</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Configure minimum and maximum quantity thresholds
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label htmlFor="minQty" className={labelClass}>
              Minimum Quantity <span className="text-red-400">*</span>
            </label>
            <input
              id="minQty"
              type="number"
              min="0"
              step="1"
              {...register("minQty", { valueAsNumber: true })}
              disabled={loading}
              className={inputClass}
            />
            {errors.minQty && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.minQty.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="maxQty" className={labelClass}>
              Maximum Quantity <span className="text-red-400">*</span>
            </label>
            <input
              id="maxQty"
              type="number"
              min="0"
              step="1"
              {...register("maxQty", { valueAsNumber: true })}
              disabled={loading}
              className={inputClass}
            />
            {errors.maxQty && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.maxQty.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#2A3036] bg-[#0B1118]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-[#64748B]">
            Fields marked <span className="text-red-400">*</span> are required.
          </p>

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2A3036] px-4 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:border-[#64748B] hover:bg-[#111B25]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || !isDirty}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22D3EE] px-5 py-2.5 text-sm font-semibold text-[#0B1118] transition hover:bg-[#67E8F9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
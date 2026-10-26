
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  Barcode,
  Building2,
  DollarSign,
  Boxes,
  CalendarDays,
  Pencil,
} from "lucide-react";
import type { IProduct } from "../types/product";
import { getProduct } from "../services/productService";
import axios from "axios";

const ViewProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    if (!productId) {
      setError("Product ID not found");
      return;
    }

    setLoading(true);

    try {
      const response = await getProduct(productId!);
      setProduct(response?.data);
      console.log("product data ", response?.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error on view product page ", error.response?.data);
        setError("Error while fetching product details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const formatDate = (date?: string | Date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-[#2A3036] border-t-[#22D3EE] animate-spin" />
          <p className="text-sm text-[#94A3B8]">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 rounded-2xl border border-[#2A3036] bg-[#111B25] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <Package size={26} className="text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">
          Unable to Load Product
        </h2>
        <p className="mt-2 text-sm text-red-400">{error}</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#2A3036] px-4 py-2 text-sm text-[#CBD5E1] transition hover:border-[#22D3EE] hover:text-[#22D3EE]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const detailItems = [
    { label: "SKU", value: product.sku, icon: Barcode },
    { label: "Category", value: product.category, icon: Tag },
    { label: "Brand", value: product.brand, icon: Building2 },
    { label: "Minimum Quantity", value: product.minQty, icon: Boxes },
    { label: "Maximum Quantity", value: product.maxQty, icon: Boxes },
    {
      label: "Created On",
      value: formatDate(product.createdAt),
      icon: CalendarDays,
    },
    {
      label: "Last Updated",
      value: formatDate(product.updatedAt),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 px-4 pb-8 text-[#F1F5F9] sm:px-6">
      {/* Page Header */}
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
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              Product Details
            </h1>
            <p className="mt-1 text-sm text-[#94A3B8]">
              View product information and pricing details.
            </p>
          </div>
        </div>

        <Link
          to={`/products/${product._id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#22D3EE] px-4 py-2.5 text-sm font-semibold text-[#0B1118] transition hover:bg-[#67E8F9]"
        >
          <Pencil size={16} />
          Edit Product
        </Link>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="overflow-hidden rounded-2xl border border-[#2A3036] bg-[#111B25]">
          <div className="border-b border-[#2A3036] px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-white">Product Overview</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Basic information about this product
            </p>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
            <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#2A3036] bg-[#0B1118] sm:h-44 sm:w-44">
              {product.image?.url ? (
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <Package size={52} className="text-[#475569]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    product.status === "ACTIVE"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/20 bg-red-500/10 text-red-400"
                  }`}
                >
                  {product.status}
                </span>
                <span className="text-xs text-[#64748B]">
                  Product ID: {product._id}
                </span>
              </div>

              <h2 className="mt-4 break-words text-2xl font-semibold text-white">
                {product.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                {product.description || "No description available for this product."}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-[#94A3B8]">
                <Tag size={16} className="text-[#22D3EE]" />
                <span className="capitalize">{product.category}</span>
                <span className="text-[#475569]">/</span>
                <span>{product.brand}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-[#2A3036] bg-[#111B25] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <DollarSign size={21} className="text-[#22D3EE]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Pricing Information</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Purchase and selling prices
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2A3036] bg-[#0B1118] p-4">
              <p className="text-sm text-[#94A3B8]">Purchase Price</p>
              <p className="mt-3 break-words text-2xl font-semibold text-white">
                {product.purchasePrice.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">Per unit</p>
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
              <p className="text-sm text-[#94A3B8]">Selling Price</p>
              <p className="mt-3 break-words text-2xl font-semibold text-[#22D3EE]">
                {product.sellPrice.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-[#64748B]">Per unit</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#2A3036] p-4">
            <div>
              <p className="text-sm text-[#94A3B8]">Price Difference</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Selling price minus purchase price
              </p>
            </div>
            <p
              className={`shrink-0 text-lg font-semibold ${
                product.sellPrice >= product.purchasePrice
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {(product.sellPrice - product.purchasePrice).toLocaleString()}
            </p>
          </div>
        </section>
      </div>

      {/* Additional Details */}
      <section className="rounded-2xl border border-[#2A3036] bg-[#111B25]">
        <div className="border-b border-[#2A3036] px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-white">Product Information</h2>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Specifications and record details
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#2A3036] sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:divide-[#2A3036] lg:grid-cols-3">
          {detailItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`flex min-w-0 items-start gap-3 p-5 ${
                  index >= 2 ? "border-t border-[#2A3036]" : ""
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2A3036] bg-[#0B1118]">
                  <Icon size={17} className="text-[#22D3EE]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#94A3B8]">{item.label}</p>
                  <p className="mt-2 break-words text-sm font-medium capitalize text-[#F1F5F9]">
                    {item.value ?? "Not available"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ViewProductPage;

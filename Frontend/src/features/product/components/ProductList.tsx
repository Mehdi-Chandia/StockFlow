import axios from "axios";
import {
  getProducts,
  type ProductFilters,
  type ProductPagination,
} from "../services/productService";
import React, { useState, useEffect } from "react";
import type { IProduct } from "../types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filters: ProductFilters;
}

const ProductList = ({ page, setPage, filters }: props) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState<ProductPagination | null>(null);

  const navigateTo=useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(page, 7, filters);
      console.log("products ", response);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        alert(error.response?.data);

        setProducts([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  if (loading) {
    return(
      <div className="h-screen text-cyan-400 flex items-center">loading...</div>
    )
  }

  return (
    <div className="bg-[#111B25] p-6 max-w-6xl border border-[#2A3036] ml-4 rounded-2xl h-full">
      {/* products list table */}
      <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-[#2A3036]">
        <table className="w-full min-w-[1000px] table-fixed">
          <thead className="bg-[#0B1118]">
            <tr>
              <th className="w-12 px-3 py-4 text-left text-xs font-medium text-[#22D3EE]">
                #
              </th>
              <th className="w-[240px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                PRODUCT
              </th>
              <th className="w-[130px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                SKU
              </th>
              <th className="w-[100px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                BRAND
              </th>
              <th className="w-[110px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                CATEGORY
              </th>
              <th className="w-[120px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                PURCHASE
              </th>
              <th className="w-[110px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                SELL PRICE
              </th>
              <th className="w-[90px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                STATUS
              </th>
              <th className="w-[80px] px-3 py-4 text-left text-sm font-medium text-[#71717A]">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-[#A1A1AA]"
                >
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-[#A1A1AA]"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-t border-[#2A3036] hover:bg-[#20252A] transition-colors"
                >
                  {/* Row number */}
                  <td className="px-6 py-4 text-sm text-[#22D3EE]">
                    {(page - 1) * 7 + index + 1}
                  </td>

                  {/* Product image + name + description */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-60">
                      <img
                        src={product.image?.url}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover border border-[#2A3036] bg-[#0B1118]"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">
                          {product.name}
                        </p>

                        <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                          {product.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 text-sm text-[#A1A1AA]">
                    {product.sku}
                  </td>

                  {/* Brand */}
                  <td className="px-6 py-4 text-sm text-[#A1A1AA]">
                    {product.brand}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-sm text-[#A1A1AA] capitalize">
                    {product.category}
                  </td>

                  {/* Purchase price */}
                  <td className="px-6 py-4 text-sm text-[#A1A1AA] whitespace-nowrap">
                    {product.purchasePrice.toLocaleString()}
                  </td>

                  {/* Selling price */}
                  <td className="px-6 py-4 text-sm text-[#A1A1AA] whitespace-nowrap">
                    {product.sellPrice.toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <button
                      onClick={()=> navigateTo(`/${product._id}/update`)}
                        className="px-2 border rounded-full text-sm hover:border-[#22D3EE] hover:text-[#22D3EE]
                    transition-colors text-slate-400"
                      >
                        edit
                      </button>
                      <button
                        className="px-2 border rounded-full text-sm hover:border-[#22D3EE] hover:text-[#22D3EE]
                    transition-colors text-slate-400"
                      >
                        {product.status === "ACTIVE" ? "Inactivate" : "Activate"}
                      </button>
                      <button
                      onClick={()=> navigateTo(`/${product._id}`)}
                        className="px-2 border rounded-full text-sm hover:border-[#22D3EE] hover:text-[#22D3EE]
                    transition-colors text-slate-400"
                      >
                        view
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* pagination details */}
      <div className="flex justify-between p-2 mt-4 items-center">
        <p className="text-[#A1A1AA] text-sm">
          {pagination && pagination.totalRecords > 0
            ? `Showing ${(page - 1) * pagination.limit + 1}–${Math.min(
                page * pagination.limit,
                pagination.totalRecords,
              )} of ${pagination.totalRecords} products`
            : "No products found"}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={loading && !pagination?.hasPrevPage}
            onClick={() => setPage((current) => current - 1)}
            type="button"
            aria-label="Previous products"
            className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm text-[#A1A1AA]">
            {pagination ? `${pagination.page} / ${pagination.totalPages}` : "—"}
          </span>

          <button
            disabled={loading && !pagination?.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
            type="button"
            aria-label="Next products"
            className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

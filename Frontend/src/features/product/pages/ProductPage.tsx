import { useState } from "react";
import ProductCards from "../components/ProductCards";
import ProductHeader from "../components/ProductHeader";
import ProductList from "../components/ProductList";
import ProductSearcSection from "../components/ProductSearchSection";
import {
  updateProductStatus,
  type ProductFilters,
} from "../services/productService";
import type { IProduct, ProductStatus } from "../types/product";
import ProductStatusModal from "../components/ProductStatusModal";
import axios from "axios";
import { toast } from "react-toastify";

const ProductPage = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    category: "",
    search: "",
    status: "",
  });

  const [statusModal, setStatusModal] = useState<{
    product: IProduct;
    status: ProductStatus;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [updatedProduct, setUpdatedProduct] = useState<{
    productId: string;
    status: ProductStatus;
  } | null>(null);

  const handleStatusClick = (product: IProduct) => {
    setStatusModal({
      product,
      status: product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  const handleConfirmStatus = async () => {
    if (!statusModal?.product._id) {
      return;
    }
    try {
      const { product, status } = statusModal;

      const response = await updateProductStatus(status, product._id!);

      setUpdatedProduct({
        productId: product._id!,
        status,
      });

      console.log("product status changing successful!", response.data);
      toast.success("status updated successfully!");
      setStatusModal(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          "error while changing the status of the product ",
          error.response?.data,
        );
      }
    }
  };


  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {statusModal && (
        <ProductStatusModal
          productName={statusModal.product.name}
          status={statusModal.status}
          onConfirm={handleConfirmStatus}
          onCancel={() => setStatusModal(null)}
        />
      )}
      {/* Header */}
      <section>
        <ProductHeader />
      </section>
      {/* cards */}
      <section>
        <ProductCards />
      </section>
      {/* Search and filter Section */}
      <section>
        <ProductSearcSection
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
      </section>
      {/* Product list section */}
      <section>
        <ProductList
          page={page}
          setPage={setPage}
          filters={filters}
          onStatusClick={handleStatusClick}
          updatedProduct={updatedProduct}
        />
      </section>
    </div>
  );
};

export default ProductPage;

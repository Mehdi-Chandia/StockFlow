import { useState } from "react"
import ProductCards from "../components/ProductCards"
import ProductHeader from "../components/ProductHeader"
import ProductList from "../components/ProductList"
import ProductSearcSection from "../components/ProductSearchSection"
import type { ProductFilters } from "../services/productService"


const ProductPage = () => {
  const [filters, setFilters]=useState<ProductFilters>({
    category: "",
    search: "",
    status: ""
  })

  const [page, setPage]=useState(1);

  const handleFilterChange= (newFilters: ProductFilters)=>{
    setFilters(newFilters)
    setPage(1);
  }


  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <section>
        <ProductHeader/>
      </section>
      {/* cards */}
      <section>
        <ProductCards/>
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
        />
      </section>
    </div>
  )
}

export default ProductPage
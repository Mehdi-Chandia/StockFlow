import { Filter } from "lucide-react";
import type { ProductFilters } from "../services/productService";
import { useEffect, useState } from "react";

interface props{
  filters: ProductFilters,
  onFiltersChange: (filters: ProductFilters)=> void
}

const ProductSearcSection = ({filters, onFiltersChange}:props) => {

  const[searchTerm, setSearchTerm]=useState("")
  
  useEffect(() => {
    const timer= setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: searchTerm
      })
    }, 500);

    return ()=>{
      clearTimeout(timer)
    }
  }, [searchTerm])
  
  return (
    <div className="flex justify-between items-center gap-4 p-4 bg-[#111B25] ">
      {/* left side */}
      <div>
        <input
        value={searchTerm}
        onChange={(e)=> {
          setSearchTerm(e.target.value)
        }}
          className="px-6 py-2 rounded-xl outline-none  placeholder:text-[#94A3B8] bg-[#0B1118] 
        border border-[#25313D] focus:border-[#06B6D4]"
          type="text"
          placeholder="search by name or SKU"
        />
        <div className="flex gap-3 items-center mt-4">
          <button
          onClick={()=>{
            setSearchTerm("")
            onFiltersChange({...filters, status: "", category:"", search:""})
          }}
           className="bg-[#0B1118] p-3 rounded-2xl border text-[#F1F5F9] border-[#06B6D4]">
            All Products
          </button>
          <button
           onClick={()=>{
            onFiltersChange({...filters, status: "ACTIVE"})
          }}
           className="bg-[#0B1118] p-3 rounded-2xl border text-[#F1F5F9] border-[#06B6D4]">
            Active
          </button>
          <button
           onClick={()=>{
            onFiltersChange({...filters, status: "INACTIVE"})
          }}
           className="bg-[#0B1118] p-3 rounded-2xl border text-[#F1F5F9] border-[#06B6D4]">
            Inactive
          </button>
        </div>
      </div>
      {/* right side */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm text-[#94A3B8] block ml-4">Category</label>
          <select 
          value={filters.category}
          onChange={(e)=>{
            onFiltersChange({...filters, category: e.target.value})
          }}

          className="bg-[#0B1118] px-4 py-2 rounded-md">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[#94A3B8] block ml-4">Status</label>
          <select
          value={filters.status}
          onChange={(e)=>{
            onFiltersChange({...filters, status: e.target.value})
          }}
          className="bg-[#0B1118] px-4 py-2 rounded-md">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="border border-[#94A3B8]/30 px-4 py-2 rounded-md flex items-center gap-2">
          <p className="">Filter</p>
          <Filter className="" size={20}/>
        </div>
      </div>
    </div>
  );
};

export default ProductSearcSection;

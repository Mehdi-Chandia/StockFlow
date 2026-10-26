import { Package } from "lucide-react"

const ProductHeader = () => {
  return (
    <div className="flex justify-between items-center gap-3 bg-transparent p-4">
        <div>
         <div className="flex gap-2 items-center ">
           < Package className="bg-[#22D3EE]/10 text-[#22D3EE] rounded-xl " size={30}/>
            <h2 className="text-[#F1F5F9] text-2xl font-bold"> Products</h2>
         </div>
            <p className="text-[#94A3B8] mt-2 text-sm">Manage your products catalog and pricing</p>
        </div>
        <input type="date"  />
        <button className="bg-[#06B6D4] px-4 py-2 rounded-md hover:bg-[#06B6D4]/70 transition-all duration-200">Add Product</button>
    </div>
  )
}

export default ProductHeader;
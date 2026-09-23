import { Download, Plus } from "lucide-react"

const PageHeader = () => {
  return (
    <div className="flex justify-between items-center p-6">
        {/* headings */}
        <div>
            <h2 className="font-semibold text-xl text-[#F3F4F6]">Dashboard</h2>
            <h2 className="font-bold text-3xl text-[#22D3EE]">Welcome back, Mr. John!</h2>
            <p className="text-sm text-[#A1A1AA] mt-1"> Overview of your warehouse operations </p>
        </div>
        {/* buttons */}
        <div className="flex gap-3">
            <button className="flex justify-center items-center bg-[#111315] border text-[#A1A1AA] hover:bg-[#20252A] 
            transition-all duration-200 border-[#2A3036] px-4 py-2 rounded-md">
            <span className="text-[#94A3B8]"><Download /></span>
            Export
            </button>
            <button className=" bg-[#22D3EE] text-[#111315] hover:bg-[#06B6D4] flex justify-center items-center 
            border border-[#2A3036] px-4 py-2 rounded-md transition-all duration-200 ">
                <span className="text-[#111315]"><Plus/></span>
                  Add Product
            </button>
        </div>
    </div>
  )
}

export default PageHeader;
      

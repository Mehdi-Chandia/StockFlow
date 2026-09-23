import { ChartNoAxesCombined } from "lucide-react";

const InventoryOverview = () => {
  return (
    <div className="bg-[#1B1F23] p-6 max-w-3xl border border-[#2A3036] ml-4 rounded-2xl h-full">
      {/* heading  */}
      <div className="flex justify-between items-center p-2">
        <h3 className="text-[#F3F4F6] text-xl font-semibold">
          Inventory Overview 
        </h3> 
        <ChartNoAxesCombined className="text-[#818CF8]" size={40}/>
        <button
          className="bg-[#20252A] border border-[#2A3036] text-[#A1A1AA] hover:text-[#F3F4F6]
             px-4 py-2 rounded-xl"
        >
          View Inventory →
        </button>
      </div>
      {/* overview table */}
      <div className="rounded-xl border border-[#2A3036] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-lg font-medium text-[#71717A]">Product</th>
            <th className="px-6 py-4 text-left text-lg font-medium text-[#71717A]">Staus</th>
            <th className="px-6 py-4 text-left text-lg font-medium text-[#71717A]">Stock</th>
            <th className="px-6 py-4 text-left text-lg font-medium text-[#71717A]">Category</th>
            <th className="px-6 py-4 text-left text-lg font-medium text-[#71717A]">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[#2A3036] hover:bg-[#20252A] transition-colors">
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Laptop</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">In Stock</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">120</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Electronics</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">$120,000</td>
          </tr>

          <tr className="border-t border-[#2A3036] hover:bg-[#20252A] transition-colors">
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Mouse</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Low Stock</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">15</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Accessories</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">$750</td>
          </tr>

           <tr className="border-t border-[#2A3036] hover:bg-[#20252A] transition-colors">
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Mouse</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Low Stock</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">15</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Accessories</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">$750</td>
          </tr>

           <tr className="border-t border-[#2A3036] hover:bg-[#20252A] transition-colors">
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Mouse</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Low Stock</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">15</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">Accessories</td>
            <td className="px-6 py-4 text-sm text-[#A1A1AA]">$750</td>
          </tr>

        </tbody>
      </table>
      </div>
    </div>
  );
};

export default InventoryOverview;


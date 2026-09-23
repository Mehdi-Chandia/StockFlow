import { Search, Bell, ChevronDown } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-between p-4 items-center border-b border-b-[#2A3036] bg-[#16191C]">
        {/* search bar section */}
        <div className="flex gap-3 relative items-center bg-slate-500 rounded-md ">
            <span  className="absolute text-[#94A3B8]"> <Search/> </span>
            <input className=" w-80 py-2 pl-10 pr-3 bg-[#1B1F23] text-[#F3F4F6] border border-[#2A3036] 
            placeholder:text-[#71717A] focus:border-[#22D3EE] focus:outline-none rounded-md" type="text" placeholder="Search anything" />
        </div>
        {/* right section */}
        <div className="flex justify-center items-center gap-3 relative">
            <span className="absolute top-1 right-36 w-5 h-5 text-xs rounded-full text-center text-white bg-red-500">3</span>
            <button>
                <Bell className="text-[#94A3B8] hover:text-[#F3F4F6]" size={30}/>
            </button>
            <p className="bg-[#1B1F23] text-[#F3F4F6] w-8 h-8 rounded-full text-center">JD</p>
            <div>
                <p className="text-[#F3F4F6] font-bold">Name</p>
                <span className="font-light text-[#71717A]">admin</span>
            </div>
            <button>
                <ChevronDown/>
            </button>
        </div>
    </div>
  )
}

export default Navbar;
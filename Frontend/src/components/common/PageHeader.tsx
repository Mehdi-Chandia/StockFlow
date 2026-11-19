import { Layers, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PageHeaderProps{
    icon: LucideIcon,
    title: string,
    description: string,
    buttonText: string,
    buttonPath: string
}

const PageHeader = ({icon: Icon, title, description, buttonPath, buttonText}: PageHeaderProps) => {
  const navigateTo= useNavigate()

  return (
    <div className="flex justify-between items-center gap-3 bg-transparent p-8">
        <div>
         <div className="flex gap-2 items-center ">
           < Icon className="bg-[#22D3EE]/10 text-[#22D3EE] rounded-xl " size={30}/>
            <h2 className="text-[#F1F5F9] text-2xl font-bold"> {title}</h2>
         </div>
            <p className="text-[#94A3B8] mt-2 text-sm">{description}</p>
        </div>
         <div className="flex gap-2 items-center p-2">
        <span>
          <Layers size={20} className="text-[#22D3EE]" />
        </span>

        <h3 className="text-[#22D3EE] text-xl font-bold">
          <span className="text-white">Stock</span> Flow
        </h3>
      </div>
        <button 
        onClick={()=> navigateTo(buttonPath)}
         className="bg-[#06B6D4] px-4 py-2 rounded-md hover:bg-[#06B6D4]/70 
        transition-all duration-200">{buttonText}</button>
    </div>
  )
}

export default PageHeader
import InventoryOverview from "../../components/shared/InventoryOverview"
import PageHeader from "../../components/shared/PageHeader"
import RecentActivity from "../../components/shared/RecentActivity"
import StatCard from "../../components/shared/StatCard"
import TopProducts from "../../components/shared/TopProducts"
import WarehouseStockLevel from "../../components/shared/WarehouseStockLevel"


const DashboardPage = () => {
  return (
    <div>
          {/* Page Header */}
            <section>
                <PageHeader/>
            </section>
            {/* Stat Cards */}
           <section>
                <StatCard/>
            </section>
            {/* inventory overview and recent activity section */}
            <section className="flex">
               <div className="w-[70%] "> <InventoryOverview/></div>
                <div className="w-[26%]"><RecentActivity/></div>
            </section>
            {/* Top products and warehouse stock level */}
            <section className="flex mt-4">
                <div className="w-[36%]"> <WarehouseStockLevel/> </div>
               <div className="w-[60%] "> <TopProducts/> </div>
            </section>
    </div>
  )
}

export default DashboardPage
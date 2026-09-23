import { Route, Routes } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import Home from "../pages/Home/Home"

const AppRoutes = () => {
  return (
   
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout/>}/>
            <Route path="/" element={<Home/>}/>
        </Routes>
   
  )
}

export default AppRoutes
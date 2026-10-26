import { Route, Routes } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import Home from "../pages/Home/Home"
import Product from "../features/product/pages/ProductPage"
import Inventory from "../features/inventory/pages/Inventory"
import DashboardPage from "../pages/Dashboard/DashboardPage"
import LoginPage from "../features/auth/pages/LoginPage"
import VerifyOtpPage from "../features/auth/pages/VerifyOtpPage"
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage"
import CreateUserPage from "../features/user/pages/CreateUserPage"
import ProtectedRoute from "../components/shared/ProtectedRoute"
import ViewProductPage from "../features/product/pages/ViewProductPage"
import EditProductPage from "../features/product/pages/EditProductPage"

const AppRoutes = () => {
  return (
   
        <Routes>
            {/* <Route path="/" element={<Home/>}/> */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element= {<DashboardLayout/>}>
             <Route path="dashboard" element={<DashboardPage/>}/>
             <Route path="products" element={<Product/>}/>
             <Route path="inventory" element={<Inventory/>}/>
          </Route>
          <Route path="/:productId" element={<ViewProductPage/>}/>
          <Route path="/:productId/update" element={<EditProductPage/>}/>
        </Route>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/verify-otp" element={<VerifyOtpPage/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/reset-password/:token" element={<ResetPasswordPage/>}/>
          <Route path="/create-user" element={<CreateUserPage/>}/>
        </Routes>
   
  )
}

export default AppRoutes
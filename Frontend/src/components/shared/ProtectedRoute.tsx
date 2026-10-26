import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !isAuthenticated) {

    return <Navigate to={"/login"} replace />;

  } else {

    return <Outlet />;
    
  }
};

export default ProtectedRoute;

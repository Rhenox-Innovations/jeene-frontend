import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
export const PrivateRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const permissions = useSelector((state) => state.auth.permissions);
  const location = useLocation();
  const currentPath = location.pathname;
  const hasPermission = permissions?.includes(currentPath);

  if(!hasPermission && currentPath != "/dashboard" && currentPath != "/view-profile-admin"){
    return <Navigate to="/dashboard" />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

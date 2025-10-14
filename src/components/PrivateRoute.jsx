import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { setPermissions } from "../redux/actions/authSlice";
export const PrivateRoutes = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const permissions = useSelector((state) => state.auth.permissions);
  const user = useSelector((state) => state?.auth?.user?.userData);
  const location = useLocation();
  const currentPath = location.pathname;

  // Load permissions on first authenticated mount if missing
  const isLoadingRef = useRef(false);
  useEffect(() => {
    const loadPermissions = async () => {
      if (isLoadingRef.current) return;
      try {
        isLoadingRef.current = true;
        const role = user?.roles?.[0];
        if (role) {
          const result = await apiRequest.get(`${Endpoints.GET_ROLE_PERMISSIONS}/${role}`);
          if (result?.data?.data) {
            dispatch(setPermissions(result.data.data));
          }
        }
      } finally {
        isLoadingRef.current = false;
      }
    };
    if (isAuthenticated && permissions === null) {
      loadPermissions();
    }
  }, [dispatch, isAuthenticated, permissions, user]);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Wait until permissions are loaded to avoid false redirects (prevents dashboard flash)
  if (permissions === null) {
    return null;
  }

  const hasPermission = permissions?.includes(currentPath);

  if (!hasPermission && currentPath !== "/dashboard" && currentPath !== "/view-profile-admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

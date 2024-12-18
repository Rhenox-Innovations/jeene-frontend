import React from "react";
import { useSelector } from "react-redux";
import { Navigate, NavLink, Route } from "react-router-dom";

const ProtectedRoute = ({children}) => {
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
   return isAuthenticated ? children : <Navigate to="/sign-in" />;
}

export default ProtectedRoute;
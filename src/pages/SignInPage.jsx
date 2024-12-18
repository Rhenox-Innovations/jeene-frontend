import React from "react";
import SignInLayer from "../components/SignInLayer";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SignInPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  if(isAuthenticated) 
    return <Navigate to="/dashboard" />;
  return (
    <>

      {/* SignInLayer */}
      <SignInLayer />

    </>
  );
};

export default SignInPage; 

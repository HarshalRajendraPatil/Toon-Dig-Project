import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RestrictedFeature = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RestrictedFeature;

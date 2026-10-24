import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "../context/authContext";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthState();
  const { user } = useSelector(selectAuth);

  const isUserAuthenticated = isAuthenticated || !!(user?._id || user?.id);

  // If user is already authenticated, redirect away from public auth pages
  if (isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

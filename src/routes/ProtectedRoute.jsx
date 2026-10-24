import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "../context/authContext";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlice";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthState();
  const { user } = useSelector(selectAuth);

  const isUserAuthenticated = isAuthenticated || !!(user?._id || user?.id);

  // Prevent premature redirect while silent refresh is checking the session
  if (loading && !isUserAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <p style={{ color: "var(--accent, #a855f7)", fontWeight: 600 }}>Verifying session...</p>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

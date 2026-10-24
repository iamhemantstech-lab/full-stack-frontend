import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "../context/authContext";
import AccessDenied from "../pages/admin/AccessDenied";

const ProtectedAdminRoute = () => {
  const { isAuthenticated, currentUser, loading } = useAuthState();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "var(--bg, #09090b)",
        }}
      >
        <p style={{ color: "var(--accent, #a855f7)", fontWeight: 600 }}>
          Verifying administrator permissions...
        </p>
      </div>
    );
  }

  // Not logged in -> send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin -> show Access Denied screen
  if (currentUser?.role !== "admin") {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;

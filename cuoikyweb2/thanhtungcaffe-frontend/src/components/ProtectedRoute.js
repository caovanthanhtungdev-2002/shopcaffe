import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

/**
 * usage:
 * <Route path="/report" element={<ProtectedRoute role="ADMIN"><Report /></ProtectedRoute>} />
 * role optional - if provided, user must have that role
 */
export default function ProtectedRoute({ children, role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (role) {
    const r = getUserRole();
    if (!r || (typeof role === "string" ? r !== role && r !== "ROOT" : !role.includes(r))) {
      return <Navigate to="/login" replace />;
    }
  }
  return children;
}

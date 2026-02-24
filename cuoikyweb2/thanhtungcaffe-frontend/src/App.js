import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/user/Menu";
import Tables from "./pages/user/Tables";
import Orders from "./pages/user/Orders";


// Admin pages
import AdminTables from "./pages/admin/AdminTables";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReport from "./pages/admin/Report";

import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/menu" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />

        {/* User & Admin routes */}
        <Route
          path="/tables"
          element={
            <ProtectedRoute role={["USER", "ADMIN", "ROOT"]}>
              <Tables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role={["USER", "ADMIN", "ROOT"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminReport />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

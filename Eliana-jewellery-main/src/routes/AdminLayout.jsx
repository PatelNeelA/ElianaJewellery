// src/routes/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../Components/Admin/AdminNavbar"; // Adjust path as needed
import Footer from "../Components/Footer/Footer"; // Assuming you still want the footer

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="admin-content">
        {" "}
        {/* Optional: Add a div for content styling */}
        <Outlet />
      </div>
      <Footer />{" "}
      {/* Include if applicable, or remove for admin-specific footer */}
    </>
  );
};

export default AdminLayout;

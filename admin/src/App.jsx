import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import SideBar from "./components/SideBar/SideBar";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import OrderDetailsModal from "./pages/Orders/OrderDetailsModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const url = "http://localhost:4000";
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const [notifOrder, setNotifOrder] = useState(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await axios.get(`${url}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAdmin(res.data.admin);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
        }
      } catch (error) {
        console.error("Verify error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      } finally {
        setChecking(false);
      }
    };
    verifyAdmin();
  }, []);

  const handleNotificationClick = (order) => {
    setNotifOrder(order);
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff4f2, #ffe6e0)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            color: "tomato",
            fontWeight: "700",
          }}
        >
          🔐 Verifying admin access...
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <>
        <ToastContainer />
        <AdminLogin url={url} onLoginSuccess={setAdmin} />
      </>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar
        url={url}
        admin={admin}
        setAdmin={setAdmin}
        onNotificationClick={handleNotificationClick}
      />
      <div className="app-content">
        <SideBar />
        <Routes>
          <Route path="/" element={<Dashboard url={url} />} />
          <Route path="/dashboard" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
        
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/users" element={<Users url={url} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {notifOrder && (
        <OrderDetailsModal
          order={notifOrder}
          url={url}
          onClose={() => setNotifOrder(null)}
        />
      )}
    </div>
  );
};

export default App;




import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { assets } from "../../assets/assets";

const AdminLogin = ({ url, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/admin/google`, {
        token: credentialResponse.credential,
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminData", JSON.stringify(res.data.admin));
        toast.success(`Welcome, ${res.data.admin.name}! 🎉`);
        onLoginSuccess(res.data.admin);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #fff4f2 0%, #ffe6e0 100%)",
      fontFamily: "Poppins, sans-serif",
      padding: "20px",
    },
    card: {
      background: "white",
      borderRadius: "24px",
      padding: "50px 40px",
      maxWidth: "440px",
      width: "100%",
      boxShadow: "0 25px 70px rgba(255, 99, 71, 0.2)",
      textAlign: "center",
      animation: "slideUp 0.5s ease",
    },
    logo: {
      width: "150px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #262626, tomato)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#888",
      marginBottom: "35px",
      lineHeight: "1.6",
    },
    googleWrapper: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "25px",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      margin: "25px 0",
      color: "#aaa",
      fontSize: "12px",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#eee",
    },
    note: {
      fontSize: "12px",
      color: "#aaa",
      lineHeight: "1.6",
    },
    badge: {
      display: "inline-block",
      background: "#fff4f2",
      color: "tomato",
      padding: "6px 16px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "700",
      marginBottom: "20px",
      border: "2px solid #ffd5cc",
    },
    loading: {
      marginTop: "20px",
      fontSize: "14px",
      color: "tomato",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={styles.card}>
        <img src={assets.logo} alt="logo" style={styles.logo} />

        <span style={styles.badge}>🔐 Admin Panel</span>

        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>
          Sign in with your Google account to access the admin panel
        </p>

        <div style={styles.googleWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            text="signin_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="300"
          />
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span>SECURE LOGIN</span>
          <div style={styles.dividerLine}></div>
        </div>

        <p style={styles.note}>
          🔒 Only authorized admins can access this panel.
          <br />
          First time? Just sign in with Google — you'll be registered automatically.
        </p>

        {loading && <p style={styles.loading}>🔄 Authenticating...</p>}
      </div>
    </div>
  );
};

export default AdminLogin;












import React from "react";
import { assets } from "../../assets/assets";

const OrderDetailsModal = ({ order, url, onClose }) => {
  if (!order) return null;

  // ✅ FIX: Smart image URL — Cloudinary ya local
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${url}/uploads/${img}`;
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.3s ease",
    },
    modal: {
      background: "white",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "650px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
      fontFamily: "Poppins, sans-serif",
      animation: "slideUp 0.4s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "22px 28px",
      borderBottom: "1px solid #f0f0f0",
      position: "sticky",
      top: 0,
      background: "white",
      borderRadius: "20px 20px 0 0",
      zIndex: 10,
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "800",
      color: "#262626",
      margin: 0,
    },
    orderId: {
      fontSize: "12px",
      color: "#999",
      marginTop: "4px",
      fontFamily: "monospace",
    },
    closeBtn: {
      background: "#fff4f2",
      border: "none",
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      fontSize: "18px",
      cursor: "pointer",
      color: "tomato",
      fontWeight: "700",
      transition: "0.3s",
    },
    body: {
      padding: "25px 28px",
    },
    section: {
      marginBottom: "25px",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#888",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "12px",
    },
    infoCard: {
      background: "#fafafa",
      borderRadius: "12px",
      padding: "16px 18px",
      border: "1px solid #f0f0f0",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "6px 0",
      fontSize: "14px",
    },
    infoLabel: {
      color: "#888",
      fontWeight: "500",
    },
    infoValue: {
      color: "#262626",
      fontWeight: "600",
      textAlign: "right",
    },
    itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    itemRow: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "12px",
      background: "#fafafa",
      borderRadius: "12px",
      border: "1px solid #f0f0f0",
    },
    itemImg: {
      width: "55px",
      height: "55px",
      objectFit: "cover",
      borderRadius: "10px",
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#262626",
      marginBottom: "4px",
    },
    itemMeta: {
      fontSize: "13px",
      color: "#888",
    },
    itemPrice: {
      fontSize: "15px",
      fontWeight: "700",
      color: "tomato",
    },
    summaryBox: {
      background: "linear-gradient(135deg, #fff4f2, #ffe6e0)",
      borderRadius: "14px",
      padding: "18px 20px",
      border: "2px solid #ffd5cc",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 0",
      fontSize: "14px",
      color: "#555",
    },
    summaryTotal: {
      display: "flex",
      justifyContent: "space-between",
      paddingTop: "12px",
      marginTop: "10px",
      borderTop: "2px dashed #ffb3a3",
      fontSize: "18px",
      fontWeight: "800",
      color: "#262626",
    },
    badge: (color) => ({
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
      background: color === "green" ? "#e8f5e9" : "#fff8e1",
      color: color === "green" ? "#27ae60" : "#f39c12",
    }),
  };

  // Payment badge
  const isPaid =
    order.payment === true || order.payment === "true" || order.payment;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>
        {`
          @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
          @keyframes slideUp { from {transform: translateY(30px); opacity: 0;} to {transform: translateY(0); opacity: 1;} }
        `}
      </style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>📦 Order Details</h2>
            <p style={styles.orderId}>#{order._id}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          {/* Customer Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 Customer Info</h3>
            <div style={styles.infoCard}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>
                  {order.address.firstName} {order.address.lastName}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{order.address.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>📞 {order.address.phone}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Delivery Address</h3>
            <div style={styles.infoCard}>
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#262626", margin: 0 }}>
                {order.address.street}, {order.address.city}
                <br />
                {order.address.state}, {order.address.country} - {order.address.zipcode}
              </p>
            </div>
          </div>

          {/* Items */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🍽️ Items ({order.items.length})</h3>
            <div style={styles.itemsList}>
              {order.items.map((item, idx) => (
                <div key={idx} style={styles.itemRow}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={styles.itemImg}
                  />
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemMeta}>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p style={styles.itemPrice}>₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💰 Payment Summary</h3>
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{order.amount - 2}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>₹2</span>
              </div>
              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>₹{order.amount}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📌 Status</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span style={styles.badge(isPaid ? "green" : "yellow")}>
                {isPaid ? "✅ Paid" : "⏳ Payment Pending"}
              </span>
              <span style={styles.badge("yellow")}>{order.status}</span>
              <span style={styles.badge("green")}>
                📅 {new Date(order.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
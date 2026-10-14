import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import OrderTracking from "../../components/OrderTracking/OrderTracking";
import "./MyOrders.css";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success && response.data.data?.length > 0) {
        // ✅ Frontend pe bhi sort — newest first (backup safety)
        const sorted = [...response.data.data].sort((a, b) =>
          b._id.localeCompare(a._id)
        );
        setData(sorted);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // ✅ FIX: Smart image URL — Cloudinary ya local
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${url}/uploads/${img}`;
  };

  const getStatusColor = (status) => {
    if (status === "Delivered") return { bg: "#e8f5e9", color: "#27ae60" };
    if (status === "Out for delivery")
      return { bg: "#e3f2fd", color: "#3498db" };
    return { bg: "#fff8e1", color: "#f39c12" };
  };

  if (data.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-empty">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <h1 className="my-orders-title">📦 My Orders</h1>

      <div className="my-orders-list">
        {data.map((order, i) => {
          const statusStyle = getStatusColor(order.status);
          const subtotal = order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const deliveryFee = order.amount - subtotal;

          return (
            <div key={i} className="my-order-card">
              {/* HEADER */}
              <div className="my-order-header">
                <div className="order-header-left">
                  <img
                    src={assets.parcel_icon}
                    alt="parcel"
                    className="parcel-icon"
                  />
                  <div>
                    <p className="order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="order-date">
                      🕐{" "}
                      {order.date
                        ? new Date(order.date).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date(
                            parseInt(order._id.substring(0, 8), 16) * 1000
                          ).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </p>
                  </div>
                </div>
                <div className="order-header-right">
                  <span
                    className="status-badge"
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* PRODUCTS LIST */}
              <div className="my-order-items">
                <p className="items-heading">
                  🍽️ Items ({order.items.length})
                </p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="my-order-item">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="item-thumb"
                      onError={(e) => {
                        e.target.src = assets.parcel_icon;
                      }}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      {item.category && (
                        <p className="item-category">{item.category}</p>
                      )}
                    </div>
                    <div className="item-qty">
                      <span className="qty-label">Qty</span>
                      <span className="qty-value">{item.quantity}</span>
                    </div>
                    <div className="item-price">
                      <p className="price-each">₹{item.price} each</p>
                      <p className="price-total">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              {order.address && (
                <div className="my-order-address">
                  <p className="address-heading">📍 Delivery Address</p>
                  <p className="address-text">
                    <b>
                      {order.address.firstName} {order.address.lastName}
                    </b>
                    <br />
                    {order.address.street}, {order.address.city},{" "}
                    {order.address.state}, {order.address.country} -{" "}
                    {order.address.zipcode}
                    <br />
                    📞 {order.address.phone}
                  </p>
                </div>
              )}

              {/* BILL SUMMARY */}
              <div className="my-order-bill">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee > 0 ? deliveryFee : 2}</span>
                </div>
                <div className="bill-row bill-total">
                  <b>Total</b>
                  <b>₹{order.amount}</b>
                </div>
              </div>

              {/* FOOTER */}
              <div className="my-order-footer">
                <p className="payment-status">
                  {order.payment === true || order.payment === "true"
                    ? "✅ Paid"
                    : "⏳ Payment Pending"}
                </p>
                <button
                  className="track-btn"
                  onClick={() => setTrackingOrder(order)}
                >
                  🚚 Track Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {trackingOrder && (
        <OrderTracking
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;
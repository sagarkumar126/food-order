import React, { useState, useRef, useEffect, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = ({ url, admin, setAdmin, onNotificationClick }) => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("readNotifIds") || "[]");
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("readNotifIds", JSON.stringify(readIds));
  }, [readIds]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch notifications — viewed + read dono consider karo
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${url}/api/notification/list`);
      if (res.data.success) {
        setNotifications(res.data.data);

        // ✅ Read + Viewed dono combine karo
        const currentReadIds = JSON.parse(
          localStorage.getItem("readNotifIds") || "[]"
        );
        const currentViewedIds = JSON.parse(
          localStorage.getItem("viewedOrderIds") || "[]"
        );
        const combinedIds = [
          ...new Set([...currentReadIds, ...currentViewedIds]),
        ];

        const unread = res.data.data.filter(
          (n) => !combinedIds.includes(n._id)
        );
        setUnreadCount(unread.length);
      }
    } catch (error) {
      console.error("Notifications error:", error);
    }
  };

  // ✅ Polling: HAR 5 SECOND
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ NEW: Orders.jsx se "ordersViewed" event aane pe badge update karo
  useEffect(() => {
    const handleOrdersViewed = () => {
      try {
        const viewedIds = JSON.parse(
          localStorage.getItem("viewedOrderIds") || "[]"
        );
        const combinedReadIds = [
          ...new Set([...readIds, ...viewedIds]),
        ];

        // Unread count update karo
        const unread = notifications.filter(
          (n) => !combinedReadIds.includes(n._id)
        );
        setUnreadCount(unread.length);
      } catch (e) {
        console.error("Event handler error:", e);
      }
    };

    window.addEventListener("ordersViewed", handleOrdersViewed);
    return () =>
      window.removeEventListener("ordersViewed", handleOrdersViewed);
  }, [readIds, notifications]);

  const markAllRead = () => {
    const allIds = notifications.map((n) => n._id);
    setReadIds(allIds);
    setUnreadCount(0);
    toast.success("All notifications marked as read ✅");
  };

  // ✅ Notification click — order modal kholo + viewed mark karo + badge update
  const handleNotifClick = async (notifId) => {
    // Mark as read
    setReadIds((prev) =>
      prev.includes(notifId) ? prev : [...prev, notifId]
    );
    setShowNotifications(false);

    // ✅ Viewed order IDs mein add karo
    try {
      const viewedIds = JSON.parse(
        localStorage.getItem("viewedOrderIds") || "[]"
      );
      if (!viewedIds.includes(notifId)) {
        const updated = [...viewedIds, notifId];
        localStorage.setItem("viewedOrderIds", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Viewed save error:", e);
    }

    // ✅ Unread count update karo
    const updatedReadIds = readIds.includes(notifId)
      ? readIds
      : [...readIds, notifId];
    const currentUnread = notifications.filter(
      (n) => !updatedReadIds.includes(n._id)
    ).length;
    setUnreadCount(currentUnread);

    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        const order = res.data.data.find((o) => o._id === notifId);
        if (order && onNotificationClick) {
          onNotificationClick(order);
        } else {
          toast.error("Order not found");
        }
      }
    } catch (error) {
      console.error("Error opening order:", error);
      toast.error("Failed to load order details");
    }
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 30) return "just now";
    if (seconds < 60) return `${seconds} sec ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const logout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout? 🚪\n\nAap logout karna chahte ho?"
    );
    if (confirmLogout) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      localStorage.removeItem("readNotifIds");
      localStorage.removeItem("viewedOrderIds");
      toast.success("Logged out successfully! 👋");
      if (setAdmin) setAdmin(null);
    }
  };

  const adminName = admin?.name || admin?.email?.split("@")[0] || "Admin";
  const adminEmail = admin?.email || "admin@tomato.com";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 4%",
      background: darkMode ? "#1a1a2e" : "white",
      borderBottom: `1px solid ${darkMode ? "#2a2a40" : "#f0f0f0"}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      transition: "0.3s",
    },
    logo: { width: "140px", cursor: "pointer" },
    rightSection: { display: "flex", alignItems: "center", gap: "12px" },
    themeBtn: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: darkMode ? "#22223a" : "#f9f9f9",
      border: "2px solid transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      transition: "all 0.4s",
    },
    bellWrapper: { position: "relative" },
    bellBtn: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: darkMode ? "#22223a" : "#f9f9f9",
      border: "2px solid transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      transition: "0.3s",
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: "-2px",
      right: "-2px",
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      fontSize: "11px",
      fontWeight: "700",
      minWidth: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `2px solid ${darkMode ? "#1a1a2e" : "white"}`,
      animation: "pulse 2s infinite",
    },
    notifDropdown: {
      position: "absolute",
      top: "calc(100% + 12px)",
      right: 0,
      background: darkMode ? "#1a1a2e" : "white",
      borderRadius: "16px",
      boxShadow: "0 10px 50px rgba(0,0,0,0.3)",
      width: "360px",
      maxHeight: "480px",
      overflowY: "auto",
      border: `1px solid ${darkMode ? "#2a2a40" : "#f0f0f0"}`,
      zIndex: 200,
      animation: "fadeInDown 0.25s ease",
    },
    notifHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 20px",
      borderBottom: `1px solid ${darkMode ? "#2a2a40" : "#f0f0f0"}`,
      position: "sticky",
      top: 0,
      background: darkMode ? "#1a1a2e" : "white",
      borderRadius: "16px 16px 0 0",
    },
    notifTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: darkMode ? "#f0f0f0" : "#262626",
      margin: 0,
    },
    markReadBtn: {
      background: "transparent",
      border: "none",
      color: "tomato",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      padding: "4px 8px",
      borderRadius: "6px",
    },
    notifList: { padding: "8px" },
    notifItem: (isRead) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px 14px",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "0.2s",
      background: isRead ? "transparent" : darkMode ? "#2a1f1f" : "#fff4f2",
      marginBottom: "4px",
    }),
    notifIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      flexShrink: 0,
    },
    notifContent: { flex: 1, minWidth: 0 },
    notifItemTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: darkMode ? "#f0f0f0" : "#262626",
      marginBottom: "3px",
    },
    notifMessage: {
      fontSize: "13px",
      color: darkMode ? "#b8b8c8" : "#666",
      marginBottom: "4px",
      lineHeight: "1.4",
    },
    notifTime: { fontSize: "11px", color: "#aaa", fontWeight: "500" },
    emptyNotif: {
      padding: "40px 20px",
      textAlign: "center",
      color: "#aaa",
      fontSize: "14px",
    },
    profileSection: { position: "relative" },
    profileBtn: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "6px 14px 6px 6px",
      background: darkMode ? "#22223a" : "#f9f9f9",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "0.3s",
      border: "2px solid transparent",
    },
    avatarCircle: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      fontWeight: "800",
    },
    profileName: {
      fontSize: "14px",
      fontWeight: "600",
      color: darkMode ? "#f0f0f0" : "#262626",
      maxWidth: "120px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    arrow: {
      fontSize: "10px",
      color: "#888",
      transition: "transform 0.3s",
      transform: showDropdown ? "rotate(180deg)" : "rotate(0)",
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      background: darkMode ? "#1a1a2e" : "white",
      borderRadius: "14px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      padding: "8px",
      minWidth: "260px",
      border: `1px solid ${darkMode ? "#2a2a40" : "#f0f0f0"}`,
      animation: "fadeInDown 0.2s ease",
      zIndex: 200,
    },
    dropdownHeader: {
      padding: "14px 16px",
      borderBottom: `1px solid ${darkMode ? "#2a2a40" : "#f0f0f0"}`,
      marginBottom: "6px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    adminName: {
      fontSize: "15px",
      fontWeight: "700",
      color: darkMode ? "#f0f0f0" : "#262626",
      marginBottom: "3px",
    },
    adminEmail: {
      fontSize: "12px",
      color: "#888",
      wordBreak: "break-all",
    },
    dropdownItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "11px 14px",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: darkMode ? "#b8b8c8" : "#49557e",
      transition: "0.2s",
    },
    logoutItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "11px 14px",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      color: "#e74c3c",
      transition: "0.2s",
      marginTop: "4px",
      borderTop: `1px solid ${darkMode ? "#2a2a40" : "#f0f0f0"}`,
      paddingTop: "14px",
    },
  };

  return (
    <div style={styles.navbar}>
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}
      </style>

      <img
        src={assets.logo}
        alt="logo"
        style={styles.logo}
        onClick={() => (window.location.href = "/")}
      />

      <div style={styles.rightSection}>
        <button
          style={styles.themeBtn}
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = darkMode ? "#2a2a45" : "#ffe6e0";
            e.currentTarget.style.borderColor = "tomato";
            e.currentTarget.style.transform = "rotate(20deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode ? "#22223a" : "#f9f9f9";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div style={styles.bellWrapper} ref={notifRef}>
          <button
            style={styles.bellBtn}
            onClick={() => setShowNotifications(!showNotifications)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? "#2a2a45" : "#ffe6e0";
              e.currentTarget.style.borderColor = "tomato";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = darkMode ? "#22223a" : "#f9f9f9";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={styles.badge}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={styles.notifDropdown}>
              <div style={styles.notifHeader}>
                <h3 style={styles.notifTitle}>
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </h3>
                {notifications.length > 0 && (
                  <button style={styles.markReadBtn} onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div style={styles.notifList}>
                {notifications.length === 0 ? (
                  <div style={styles.emptyNotif}>
                    <p style={{ fontSize: "32px", margin: "0 0 10px" }}>🔕</p>
                    <p style={{ margin: 0 }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif, i) => {
                    const isRead = readIds.includes(notif._id);
                    return (
                      <div
                        key={i}
                        style={styles.notifItem(isRead)}
                        onClick={() => handleNotifClick(notif._id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        <div style={styles.notifIcon}>🛒</div>
                        <div style={styles.notifContent}>
                          <p style={styles.notifItemTitle}>{notif.title}</p>
                          <p style={styles.notifMessage}>{notif.message}</p>
                          <p style={styles.notifTime}>
                            🕐 {timeAgo(notif.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div style={styles.profileSection} ref={dropdownRef}>
          <div
            style={styles.profileBtn}
            onClick={() => setShowDropdown(!showDropdown)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? "#2a2a45" : "#ffe6e0";
              e.currentTarget.style.borderColor = "tomato";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = darkMode ? "#22223a" : "#f9f9f9";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={styles.avatarCircle}>{adminInitial}</div>
            <span style={styles.profileName}>{adminName}</span>
            <span style={styles.arrow}>▼</span>
          </div>

          {showDropdown && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={styles.avatarCircle}>{adminInitial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={styles.adminName}>{adminName}</p>
                  <p style={styles.adminEmail}>{adminEmail}</p>
                </div>
              </div>

              <div
                style={styles.dropdownItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = darkMode ? "#2a2a45" : "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => {
                  setShowDropdown(false);
                  toast.info("Settings coming soon! ⚙️");
                }}
              >
                ⚙️ Settings
              </div>

              <div
                style={styles.dropdownItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = darkMode ? "#2a2a45" : "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => {
                  setShowDropdown(false);
                  toast.info("Help & Support coming soon! 💬");
                }}
              >
                💬 Help & Support
              </div>

              <div
                style={styles.logoutItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = darkMode ? "#2a1f1f" : "#ffe6e6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={logout}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;



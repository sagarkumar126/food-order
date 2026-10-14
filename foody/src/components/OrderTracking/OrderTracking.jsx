import React, { useEffect } from "react";

const OrderTracking = ({ order, onClose }) => {
  // ✅ Escape key se close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // ✅ Status se current stage nikalo
  const getCurrentStage = (status) => {
    if (status === "Food Processing") return 1;
    if (status === "Out for delivery") return 2;
    if (status === "Delivered") return 3;
    return 0;
  };

  const currentStage = getCurrentStage(order.status);

  const stages = [
    {
      id: 0,
      label: "Order Placed",
      icon: "✅",
      desc: "We received your order",
    },
    {
      id: 1,
      label: "Preparing",
      icon: "👨‍🍳",
      desc: "Your food is being prepared",
    },
    {
      id: 2,
      label: "Out for Delivery",
      icon: "🚚",
      desc: "On the way to your address",
    },
    {
      id: 3,
      label: "Delivered",
      icon: "🎉",
      desc: "Enjoy your meal!",
    },
  ];

  // ✅ Time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px",
      animation: "fadeIn 0.3s ease",
    },
    modal: {
      background: "white",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "560px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      fontFamily: "Poppins, sans-serif",
      animation: "slideUp 0.4s ease",
      position: "relative",
    },
    header: {
      padding: "25px 30px",
      borderBottom: "1px solid #f0f0f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      background: "white",
      borderRadius: "24px 24px 0 0",
      zIndex: 10,
    },
    headerTitle: {
      fontSize: "20px",
      fontWeight: "800",
      color: "#262626",
      margin: 0,
    },
    orderId: {
      fontSize: "11px",
      color: "#999",
      marginTop: "4px",
      fontFamily: "monospace",
    },
    closeBtn: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: "#fff4f2",
      border: "none",
      fontSize: "18px",
      color: "tomato",
      fontWeight: "700",
      cursor: "pointer",
      transition: "0.3s",
    },
    body: {
      padding: "30px",
    },
    progressBar: {
      position: "relative",
      height: "6px",
      background: "#f0f0f0",
      borderRadius: "50px",
      margin: "30px 0 40px",
    },
    progressFill: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      background: "linear-gradient(90deg, tomato, #27ae60)",
      borderRadius: "50px",
      transition: "width 0.8s ease",
      width: `${(currentStage / 3) * 100}%`,
    },
    progressDot: (active, done) => ({
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: active || done ? "44px" : "36px",
      height: active || done ? "44px" : "36px",
      borderRadius: "50%",
      background: done
        ? "linear-gradient(135deg, #27ae60, #2ecc71)"
        : active
        ? "linear-gradient(135deg, tomato, #e74c3c)"
        : "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      border: "4px solid white",
      boxShadow: active
        ? "0 0 0 6px rgba(255, 99, 71, 0.15)"
        : "0 2px 10px rgba(0,0,0,0.1)",
      transition: "all 0.5s",
      zIndex: 3,
    }),
    timeline: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "20px",
    },
    stage: (active, done) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: "15px",
      padding: "16px",
      borderRadius: "14px",
      background: active
        ? "#fff4f2"
        : done
        ? "#e8f5e9"
        : "#fafafa",
      border: active
        ? "2px solid tomato"
        : done
        ? "2px solid #27ae60"
        : "2px solid #f0f0f0",
      transition: "all 0.4s",
    }),
    stageIcon: {
      fontSize: "28px",
      flexShrink: 0,
    },
    stageInfo: {
      flex: 1,
    },
    stageLabel: (active, done) => ({
      fontSize: "15px",
      fontWeight: "800",
      color: done ? "#27ae60" : active ? "tomato" : "#888",
      marginBottom: "3px",
    }),
    stageDesc: {
      fontSize: "12px",
      color: "#888",
    },
    stageTime: {
      fontSize: "11px",
      color: "#aaa",
      marginTop: "5px",
    },
    deliveryCard: {
      background: "linear-gradient(135deg, #fff4f2, #ffe6e0)",
      borderRadius: "16px",
      padding: "18px",
      marginTop: "25px",
      border: "2px solid #ffd5cc",
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    deliveryAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
    },
    deliveryInfo: {
      flex: 1,
    },
    deliveryName: {
      fontSize: "14px",
      fontWeight: "800",
      color: "#262626",
      marginBottom: "2px",
    },
    deliveryRole: {
      fontSize: "12px",
      color: "#888",
    },
    callBtn: {
      background: "linear-gradient(135deg, #27ae60, #2ecc71)",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>
        {`
          @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
          @keyframes slideUp { 
            from { transform: translateY(40px); opacity: 0; } 
            to { transform: translateY(0); opacity: 1; } 
          }
        `}
      </style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.headerTitle}>🚚 Track Order</h2>
            <p style={styles.orderId}>#{order._id.slice(-10)}</p>
          </div>
          <button
            style={styles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "tomato";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff4f2";
              e.currentTarget.style.color = "tomato";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            ✕
          </button>
        </div>

        <div style={styles.body}>
          {/* ✅ Progress Bar */}
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />

            {stages.map((stage, i) => {
              const active = i === currentStage;
              const done = i < currentStage;
              return (
                <div
                  key={i}
                  style={{
                    ...styles.progressDot(active, done),
                    left: `${(i / 3) * 100}%`,
                  }}
                >
                  {done ? "✓" : stage.icon}
                </div>
              );
            })}
          </div>

          {/* ✅ Timeline */}
          <div style={styles.timeline}>
            {stages.map((stage, i) => {
              const active = i === currentStage;
              const done = i < currentStage;
              return (
                <div key={i} style={styles.stage(active, done)}>
                  <div style={styles.stageIcon}>
                    {done ? "✅" : stage.icon}
                  </div>
                  <div style={styles.stageInfo}>
                    <div style={styles.stageLabel(active, done)}>
                      {stage.label}
                      {active && !done && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "11px",
                            background: "tomato",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "50px",
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <div style={styles.stageDesc}>{stage.desc}</div>
                    <div style={styles.stageTime}>
                      🕐{" "}
                      {i === 0
                        ? timeAgo(order.date)
                        : done
                        ? "Completed"
                        : active
                        ? "In progress"
                        : "Pending"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Delivery Boy Info */}
          {currentStage >= 1 && currentStage < 3 && (
            <div style={styles.deliveryCard}>
              <div style={styles.deliveryAvatar}>👨‍🍳</div>
              <div style={styles.deliveryInfo}>
                <div style={styles.deliveryName}>Rahul Sharma</div>
                <div style={styles.deliveryRole}>
                  🛵 Delivery Partner • ⭐ 4.9
                </div>
              </div>
              <button
                style={styles.callBtn}
                onClick={() => alert("📞 Calling delivery partner...")}
              >
                📞 Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;






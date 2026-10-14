import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {
  getFoodRating,
  getFoodReviews,
  saveFoodReview,
} from "../../utils/ratings";
import WishlistIcon from "../WishlistIcon/WishlistIcon";

const FoodDetailsModal = ({ food, onClose }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const [showZoom, setShowZoom] = useState(false);

  const allImages =
    food?.images && food.images.length > 0
      ? food.images
      : food?.image
      ? [food.image]
      : [];
  const [selectedImage, setSelectedImage] = useState(0);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${url}/uploads/${img}`;
  };

  useEffect(() => {
    if (food) {
      setReviews(getFoodReviews(food._id));
      setSelectedImage(0);
      setShowZoom(false);
    }
  }, [food]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showZoom) setShowZoom(false);
        else onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose, showZoom]);

  if (!food) return null;

  const { rating, reviewCount } = getFoodRating(food._id);
  const inCart = cartItems[food._id] || 0;

  const discount = food.discount || 0;
  const finalPrice =
    discount > 0
      ? Math.round(food.price - (food.price * discount) / 100)
      : food.price;

  const handlePlus = () => addToCart(food._id);
  const handleMinus = () => {
    if (inCart <= 0) return;
    removeFromCart(food._id);
  };
  const handleAdd = () => addToCart(food._id);

  const submitReview = () => {
    if (!userName.trim()) {
      toast.warning("Please enter your name");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Please write a comment");
      return;
    }

    const review = {
      name: userName.trim(),
      rating: newRating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    saveFoodReview(food._id, review);
    setReviews([review, ...reviews]);
    setComment("");
    setUserName("");
    setNewRating(5);
    setShowReviewForm(false);
    toast.success("Review added! Thanks 🎉");
  };

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
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "16px",
      animation: "fadeIn 0.3s ease",
    },
    modal: {
      background: "white",
      borderRadius: "28px",
      width: "100%",
      maxWidth: "1120px",
      maxHeight: "94vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
      fontFamily: "Poppins, sans-serif",
      animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: "18px",
      right: "18px",
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "700",
      color: "#262626",
      boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
    },
    imgSection: {
      flex: "1 1 48%",
      position: "relative",
      background: "linear-gradient(135deg, #fff4f2 0%, #ffe6e0 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "24px",
      gap: "20px",
      overflow: "hidden",
    },
    mainImgWrapper: {
      position: "relative",
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "zoom-in",
      borderRadius: "20px",
      overflow: "hidden",
      background: "white",
      boxShadow: "0 20px 50px rgba(255, 99, 71, 0.15)",
      minHeight: "440px",
    },
    mainImg: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      background: "#fafafa",
      transition: "transform 0.4s ease",
    },
    imgCounter: {
      position: "absolute",
      bottom: "16px",
      left: "16px",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "6px 14px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "700",
      backdropFilter: "blur(10px)",
      zIndex: 5,
    },
    zoomHint: {
      position: "absolute",
      bottom: "16px",
      right: "16px",
      background: "rgba(255,255,255,0.95)",
      color: "tomato",
      padding: "6px 14px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "700",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
      zIndex: 5,
    },
    vegBadgeOnImage: (isVeg) => ({
      position: "absolute",
      top: "16px",
      left: "16px",
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      background: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      border: `2px solid ${isVeg ? "#27ae60" : "#e74c3c"}`,
      zIndex: 5,
    }),
    vegDotImg: (isVeg) => ({
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: isVeg ? "#27ae60" : "#e74c3c",
    }),
    discountRibbon: {
      position: "absolute",
      top: "16px",
      right: "16px",
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      padding: "8px 18px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "900",
      boxShadow: "0 6px 20px rgba(231,76,60,0.5)",
      zIndex: 5,
      letterSpacing: "0.5px",
    },
    thumbnails: {
      display: "flex",
      gap: "12px",
      padding: "0",
      overflowX: "auto",
      justifyContent: "center",
    },
    thumb: (active) => ({
      width: "70px",
      height: "70px",
      borderRadius: "14px",
      objectFit: "cover",
      cursor: "pointer",
      border: active ? "3px solid tomato" : "3px solid rgba(255,255,255,0.8)",
      opacity: active ? 1 : 0.7,
      flexShrink: 0,
      transition: "all 0.3s ease",
      background: "white",
      boxShadow: active
        ? "0 8px 20px rgba(255,99,71,0.5)"
        : "0 4px 12px rgba(0,0,0,0.1)",
      transform: active ? "translateY(-4px)" : "translateY(0)",
    }),
    infoSection: {
      flex: "1 1 52%",
      padding: "32px 36px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      background: "white",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      marginBottom: "16px",
    },
    category: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "linear-gradient(135deg, #fff4f2, #ffe6e0)",
      color: "tomato",
      padding: "8px 16px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      border: "2px solid #ffe0d6",
    },
    name: {
      fontSize: "32px",
      fontWeight: "900",
      color: "#262626",
      marginBottom: "16px",
      lineHeight: "1.15",
      letterSpacing: "-0.8px",
    },
    ratingRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    ratingBadge: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      background: "linear-gradient(135deg, #27ae60, #2ecc71)",
      padding: "7px 14px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "800",
      color: "white",
      boxShadow: "0 4px 12px rgba(39,174,96,0.35)",
    },
    vegBadge: (isVeg) => ({
      display: "flex",
      alignItems: "center",
      gap: "5px",
      padding: "7px 14px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "800",
      background: isVeg ? "#e8f5e9" : "#ffe6e6",
      color: isVeg ? "#27ae60" : "#e74c3c",
      border: `1.5px solid ${isVeg ? "#c8e6c9" : "#ffcdd2"}`,
    }),
    reviewCount: {
      fontSize: "13px",
      color: "#888",
      fontWeight: "600",
    },
    description: {
      fontSize: "15px",
      color: "#555",
      lineHeight: "1.75",
      marginBottom: "24px",
      paddingBottom: "22px",
      borderBottom: "2px dashed #f0f0f0",
    },

    // ✅✅✅ PRICE BLOCK — CLEAN FIX ✅✅✅
    priceBlock: {
      background: "linear-gradient(135deg, #fff9f7 0%, #fff4f2 100%)",
      borderRadius: "18px",
      padding: "18px 22px",
      marginBottom: "20px",
      border: "2px solid #ffe0d6",
      boxShadow: "0 8px 25px rgba(255,99,71,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      flexWrap: "wrap",
    },

    // ✅ Left side — label + price ek saath
    priceLeft: {
      display: "flex",
      alignItems: "baseline",
      gap: "12px",
      flexWrap: "wrap",
    },

    priceLabel: {
      fontSize: "13px",
      color: "#888",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "1px",
      margin: 0,
      lineHeight: 1,
    },

    price: {
      fontSize: "34px",
      fontWeight: "900",
      color: "tomato",
      margin: 0,
      lineHeight: 1,
      letterSpacing: "-1px",
    },

    // ✅ Right side — old price + discount
    priceRight: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    },

    oldPrice: {
      fontSize: "16px",
      color: "#bbb",
      textDecoration: "line-through",
      fontWeight: "600",
      margin: 0,
    },

    discountBadge: {
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      padding: "5px 12px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "900",
      boxShadow: "0 4px 12px rgba(231,76,60,0.35)",
    },

    addBlock: {
      background: "#fafafa",
      borderRadius: "18px",
      padding: "20px",
      marginBottom: "20px",
      border: "1.5px solid #f0f0f0",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    addBlockLabel: {
      fontSize: "11px",
      color: "#888",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: "1.2px",
      marginBottom: "0",
      display: "block",
    },
    qtyRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexWrap: "wrap",
    },
    qtySelector: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "white",
      borderRadius: "50px",
      padding: "6px",
      border: "2px solid #ffe0d6",
      boxShadow: "0 4px 12px rgba(255,99,71,0.1)",
    },
    qtyBtn: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      border: "none",
      background: "white",
      color: "tomato",
      fontSize: "20px",
      fontWeight: "900",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
      lineHeight: 1,
    },
    qtyValue: {
      fontSize: "20px",
      fontWeight: "900",
      color: "#262626",
      minWidth: "40px",
      textAlign: "center",
    },
    addBtn: {
      padding: "14px 36px",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      fontSize: "15px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 8px 25px rgba(255, 99, 71, 0.4)",
      letterSpacing: "0.5px",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    inCartInfo: {
      fontSize: "13px",
      color: "#27ae60",
      fontWeight: "700",
      marginTop: "4px",
      textAlign: "center",
      padding: "10px 14px",
      background: "#e8f5e9",
      borderRadius: "10px",
      border: "1.5px solid #c8e6c9",
    },
    reviewsSection: {
      paddingTop: "8px",
    },
    reviewsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "10px",
    },
    reviewsTitle: {
      fontSize: "18px",
      fontWeight: "900",
      color: "#262626",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    writeReviewBtn: {
      background: "#fff4f2",
      color: "tomato",
      border: "2px solid #ffe0d6",
      padding: "9px 18px",
      borderRadius: "50px",
      fontSize: "12.5px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      transition: "all 0.3s",
    },
    reviewForm: {
      background: "linear-gradient(135deg, #fafafa, #f5f5f5)",
      borderRadius: "16px",
      padding: "22px",
      marginBottom: "20px",
      border: "2px solid #f0f0f0",
      animation: "fadeIn 0.3s ease",
    },
    label: {
      fontSize: "11.5px",
      fontWeight: "800",
      color: "#555",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #eee",
      borderRadius: "12px",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
      boxSizing: "border-box",
      marginBottom: "14px",
      background: "white",
      transition: "all 0.3s",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #eee",
      borderRadius: "12px",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "80px",
      marginBottom: "14px",
      background: "white",
      transition: "all 0.3s",
    },
    starsRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "14px",
      fontSize: "32px",
      cursor: "pointer",
    },
    submitBtn: {
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      padding: "12px 26px",
      borderRadius: "50px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 6px 20px rgba(255,99,71,0.35)",
    },
    reviewItem: {
      background: "#fafafa",
      borderRadius: "14px",
      padding: "18px",
      marginBottom: "12px",
      border: "1.5px solid #f0f0f0",
      transition: "all 0.3s",
    },
    reviewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      flexWrap: "wrap",
      gap: "8px",
    },
    reviewName: {
      fontSize: "14px",
      fontWeight: "800",
      color: "#262626",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    reviewStars: {
      fontSize: "14px",
      color: "#f39c12",
      letterSpacing: "2px",
    },
    reviewComment: {
      fontSize: "13.5px",
      color: "#555",
      lineHeight: "1.6",
      margin: "0 0 8px",
      fontStyle: "italic",
    },
    reviewTime: {
      fontSize: "11px",
      color: "#aaa",
      margin: 0,
      fontWeight: "500",
    },
    noReviews: {
      textAlign: "center",
      padding: "30px 20px",
      color: "#bbb",
      fontSize: "13.5px",
      fontStyle: "italic",
      background: "#fafafa",
      borderRadius: "14px",
      border: "2px dashed #f0f0f0",
    },
    zoomOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.95)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      cursor: "zoom-out",
      animation: "fadeIn 0.3s ease",
    },
    zoomImg: {
      maxWidth: "95%",
      maxHeight: "95vh",
      objectFit: "contain",
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    },
    zoomCloseBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "22px",
      fontWeight: "800",
      color: "#262626",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
    },
    zoomHintText: {
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(255,255,255,0.9)",
      color: "#262626",
      padding: "8px 16px",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "600",
    },
  };

  return (
    <>
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
          <button
            style={styles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "tomato";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#262626";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            ✕
          </button>

          {/* ─── IMAGE SECTION ─── */}
          <div style={styles.imgSection}>
            <div
              style={styles.mainImgWrapper}
              onClick={() => setShowZoom(true)}
              title="Click to zoom"
            >
              <img
                src={getImageUrl(allImages[selectedImage] || food.image)}
                alt={food.name}
                style={styles.mainImg}
              />

              <div style={styles.vegBadgeOnImage(food.isVeg)}>
                <div style={styles.vegDotImg(food.isVeg)} />
              </div>

              {discount > 0 && (
                <div style={styles.discountRibbon}>{discount}% OFF</div>
              )}

              {allImages.length > 1 && (
                <div style={styles.imgCounter}>
                  📷 {selectedImage + 1} / {allImages.length}
                </div>
              )}

              <div style={styles.zoomHint}>🔍 Click to zoom</div>
            </div>

            {allImages.length > 1 && (
              <div style={styles.thumbnails}>
                {allImages.map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)}
                    alt={`thumb-${i}`}
                    style={styles.thumb(i === selectedImage)}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ─── INFO SECTION ─── */}
          <div style={styles.infoSection}>
            <div style={styles.topRow}>
              <span style={styles.category}>🍽️ {food.category}</span>
              <WishlistIcon foodId={food._id} />
            </div>

            <h2 style={styles.name}>{food.name}</h2>

            <div style={styles.ratingRow}>
              <div style={styles.ratingBadge}>
                <span>★</span>
                <span>{rating}</span>
              </div>
              <div style={styles.vegBadge(food.isVeg)}>
                {food.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
              </div>
              <span style={styles.reviewCount}>
                💬 {reviewCount} reviews
              </span>
            </div>

            <p style={styles.description}>{food.description}</p>

            {/* ✅✅✅ PRICE BLOCK — CLEAN FIX ✅✅✅ */}
            <div style={styles.priceBlock}>
              {/* LEFT SIDE: Label + Price */}
              <div style={styles.priceLeft}>
                <span style={styles.priceLabel}>💰 Price</span>
                <p style={styles.price}>₹{finalPrice}</p>
              </div>

              {/* RIGHT SIDE: Old price + Discount */}
              {discount > 0 && (
                <div style={styles.priceRight}>
                  <p style={styles.oldPrice}>₹{food.price}</p>
                  <span style={styles.discountBadge}>{discount}% OFF</span>
                </div>
              )}
            </div>

            {/* ─── ADD TO CART BLOCK ─── */}
            <div style={styles.addBlock}>
              <span style={styles.addBlockLabel}>🛒 Add to Cart</span>
              <div style={styles.qtyRow}>
                {inCart > 0 ? (
                  <div style={styles.qtySelector}>
                    <button
                      style={styles.qtyBtn}
                      onClick={handleMinus}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "tomato")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      −
                    </button>
                    <span style={styles.qtyValue}>{inCart}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={handlePlus}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "tomato")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.addBtn}
                    onClick={handleAdd}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(255,99,71,0.55)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(255,99,71,0.4)";
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                )}

                {inCart > 0 && (
                  <div style={{ textAlign: "right", minWidth: "100px" }}>
                    <span style={styles.priceLabel}>In Cart Total</span>
                    <p style={{ ...styles.price, fontSize: "24px" }}>
                      ₹{finalPrice * inCart}
                    </p>
                  </div>
                )}
              </div>

              {inCart > 0 && (
                <p style={styles.inCartInfo}>
                  ✅ {inCart} × {food.name} in your cart
                </p>
              )}
            </div>

            {/* ─── REVIEWS SECTION ─── */}
            <div style={styles.reviewsSection}>
              <div style={styles.reviewsHeader}>
                <h3 style={styles.reviewsTitle}>
                  💬 Reviews
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#888",
                      fontWeight: "600",
                    }}
                  >
                    ({reviews.length})
                  </span>
                </h3>
                <button
                  style={styles.writeReviewBtn}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "tomato";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "tomato";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff4f2";
                    e.currentTarget.style.color = "tomato";
                    e.currentTarget.style.borderColor = "#ffe0d6";
                  }}
                >
                  {showReviewForm ? "✕ Cancel" : "✍️ Write Review"}
                </button>
              </div>

              {showReviewForm && (
                <div style={styles.reviewForm}>
                  <label style={styles.label}>Your Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = "tomato")}
                    onBlur={(e) => (e.target.style.borderColor = "#eee")}
                  />

                  <label style={styles.label}>Your Rating</label>
                  <div style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color:
                            star <= (hoverRating || newRating)
                              ? "#f39c12"
                              : "#ddd",
                          transition: "0.2s",
                          textShadow:
                            star <= (hoverRating || newRating)
                              ? "0 0 10px rgba(243,156,18,0.4)"
                              : "none",
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <label style={styles.label}>Your Comment</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = "tomato")}
                    onBlur={(e) => (e.target.style.borderColor = "#eee")}
                  />

                  <button style={styles.submitBtn} onClick={submitReview}>
                    ✨ Submit Review
                  </button>
                </div>
              )}

              {reviews.length === 0 ? (
                <p style={styles.noReviews}>
                  🌟 No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((rev, i) => (
                  <div key={i} style={styles.reviewItem}>
                    <div style={styles.reviewHeader}>
                      <p style={styles.reviewName}>
                        <span
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, tomato, #e74c3c)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "800",
                          }}
                        >
                          {rev.name?.charAt(0).toUpperCase()}
                        </span>
                        {rev.name}
                      </p>
                      <div style={styles.reviewStars}>
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <p style={styles.reviewComment}>"{rev.comment}"</p>
                    <p style={styles.reviewTime}>🕐 {timeAgo(rev.date)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── FULL-SCREEN ZOOM ─── */}
      {showZoom && (
        <div
          style={styles.zoomOverlay}
          onClick={() => setShowZoom(false)}
        >
          <button
            style={styles.zoomCloseBtn}
            onClick={(e) => {
              e.stopPropagation();
              setShowZoom(false);
            }}
          >
            ✕
          </button>
          <img
            src={getImageUrl(allImages[selectedImage] || food.image)}
            alt={food.name}
            style={styles.zoomImg}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={styles.zoomHintText}>
            Click anywhere or press ESC to close
          </div>
        </div>
      )}
    </>
  );
};

export default FoodDetailsModal;
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { getWishlist, toggleWishlist } from "../../utils/wishlist";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getFoodRating } from "../../utils/ratings";

const Wishlist = () => {
  const { food_list, url, addToCart } = useContext(StoreContext);
  const [wishlistIds, setWishlistIds] = useState([]);

  // ✅ Smart image URL
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${url}/uploads/${img}`;
  };

  useEffect(() => {
    setWishlistIds(getWishlist());
  }, []);

  const wishlistFoods = food_list.filter((f) => wishlistIds.includes(f._id));

  const removeFromWishlist = (id, name) => {
    toggleWishlist(id);
    setWishlistIds(getWishlist());
    toast.info(`${name} removed from wishlist`);
  };

  const handleAddToCart = (id, name) => {
    addToCart(id);
    toast.success(`${name} added to cart! 🛒`);
  };

  const styles = {
    page: {
      padding: "40px 0",
      minHeight: "60vh",
      fontFamily: "Poppins, sans-serif",
    },
    header: {
      marginBottom: "30px",
    },
    title: {
      fontSize: "32px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #262626, tomato)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "15px",
      color: "#888",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "25px",
    },
    card: {
      background: "white",
      borderRadius: "18px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      transition: "all 0.4s",
      position: "relative",
      cursor: "pointer",
    },
    imgContainer: {
      position: "relative",
      height: "180px",
      overflow: "hidden",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s",
    },
    removeBtn: {
      position: "absolute",
      top: "12px",
      right: "12px",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.95)",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
      zIndex: 5,
      transition: "0.3s",
    },
    info: {
      padding: "18px",
    },
    nameRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "10px",
      marginBottom: "8px",
    },
    name: {
      fontSize: "17px",
      fontWeight: "700",
      color: "#262626",
      margin: 0,
    },
    rating: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: "#e8f5e9",
      padding: "3px 8px",
      borderRadius: "50px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#27ae60",
      flexShrink: 0,
    },
    category: {
      fontSize: "12px",
      color: "tomato",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "8px",
    },
    desc: {
      fontSize: "13px",
      color: "#888",
      lineHeight: "1.5",
      marginBottom: "12px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    },
    price: {
      fontSize: "20px",
      fontWeight: "800",
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    addBtn: {
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "10px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
      transition: "0.3s",
    },
    empty: {
      textAlign: "center",
      padding: "80px 20px",
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    },
    emptyIcon: {
      fontSize: "80px",
      marginBottom: "20px",
    },
    emptyTitle: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#262626",
      marginBottom: "10px",
    },
    emptyText: {
      fontSize: "15px",
      color: "#888",
      marginBottom: "25px",
    },
    browseBtn: {
      background: "linear-gradient(135deg, tomato, #e74c3c)",
      color: "white",
      border: "none",
      padding: "14px 32px",
      borderRadius: "50px",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 8px 25px rgba(255, 99, 71, 0.35)",
    },
  };

  if (wishlistFoods.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>💔</div>
          <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
          <p style={styles.emptyText}>
            Add your favorite dishes to wishlist and find them here later!
          </p>
          <Link to="/" style={styles.browseBtn}>
            🍽️ Browse Food
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>❤️ My Wishlist</h1>
        <p style={styles.subtitle}>
          {wishlistFoods.length} item{wishlistFoods.length > 1 ? "s" : ""} saved
        </p>
      </div>

      <div style={styles.grid}>
        {wishlistFoods.map((food, i) => {
          const { rating } = getFoodRating(food._id);
          return (
            <div
              key={i}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(255, 99, 71, 0.2)";
                e.currentTarget.querySelector("img").style.transform =
                  "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.08)";
                e.currentTarget.querySelector("img").style.transform =
                  "scale(1)";
              }}
            >
              <div style={styles.imgContainer}>
                <img
                  src={getImageUrl(food.image)}
                  alt={food.name}
                  style={styles.img}
                />
                <button
                  style={styles.removeBtn}
                  onClick={() => removeFromWishlist(food._id, food.name)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#ffe6e6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.95)")
                  }
                >
                  ❤️
                </button>
              </div>

              <div style={styles.info}>
                <p style={styles.category}>{food.category}</p>
                <div style={styles.nameRow}>
                  <h3 style={styles.name}>{food.name}</h3>
                  <div style={styles.rating}>
                    <span>★</span>
                    <span>{rating}</span>
                  </div>
                </div>
                <p style={styles.desc}>{food.description}</p>
                <div style={styles.footer}>
                  <span style={styles.price}>₹{food.price}</span>
                  <button
                    style={styles.addBtn}
                    onClick={() => handleAddToCart(food._id, food.name)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;




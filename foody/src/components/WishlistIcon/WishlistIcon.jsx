import React, { useState, useEffect } from "react";
import { toggleWishlist, isInWishlist } from "../../utils/wishlist";
import { toast } from "react-toastify";

const WishlistIcon = ({ foodId }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isInWishlist(foodId));
  }, [foodId]);

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const updated = toggleWishlist(foodId);
    const isNowActive = updated.includes(foodId);
    setActive(isNowActive);

    if (isNowActive) {
      toast.success("Added to wishlist ❤️", {
        position: "top-center",
        autoClose: 1500,
      });
    } else {
      toast.info("Removed from wishlist", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-btn ${active ? "wishlist-active" : ""}`}
      onClick={handleToggle}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <span className="wishlist-icon">❤️</span>
      <span className="wishlist-text">
        {active ? "Wishlisted" : "Add to Wishlist"}
      </span>
    </button>
  );
};

export default WishlistIcon;





import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { getFoodRating } from "../../utils/ratings";
import { getFoodBadges } from "../../utils/badges";
import WishlistIcon from "../WishlistIcon/WishlistIcon";

const FoodItem = ({
  id,
  name,
  price,
  description,
  image,
  images,
  discount,
  isVeg,
  onViewDetails,
  category,
}) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const { rating, reviewCount } = getFoodRating(id);

  const badges = getFoodBadges({
    _id: id,
    name,
    price,
    description,
    image,
    category: category || "",
    discount: discount || 0,
    isVeg: isVeg || false,
  });

  const displayImage =
    images && images.length > 0 ? images[0] : image;

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${url}/uploads/${img}`;
  };

  const finalPrice =
    discount > 0 ? Math.round(price - (price * discount) / 100) : price;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(id);
    toast.success(`${name} added to cart! 🛒`, {
      position: "top-center",
      autoClose: 1500,
    });
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromCart(id);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails({
        _id: id,
        name,
        price,
        description,
        image,
        images,
        discount,
        isVeg,
        category,
      });
    }
  };

  return (
    <div className="food-item" onClick={handleCardClick}>
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={getImageUrl(displayImage)}
          alt={name}
        />

        <div className={`veg-indicator ${isVeg ? "veg" : "non-veg"}`}>
          <div className="veg-dot" />
        </div>

        <WishlistIcon foodId={id} size={34} />

        {badges.length > 0 && (
          <div className="food-badges">
            {badges.map((badge, i) => (
              <span
                key={i}
                className={`food-badge badge-${badge.type}`}
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {cartItems[id] ? (
          <div className="food-item-counter">
            <button onClick={handleRemove}>−</button>
            <p>{cartItems[id]}</p>
            <button onClick={handleAdd}>+</button>
          </div>
        ) : (
          <button className="add" onClick={handleAdd}>
            +
          </button>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-header">
          <p className="food-item-name">{name}</p>
          <div className="food-item-rating">
            <span className="star">★</span>
            <span className="rating-value">{rating}</span>
          </div>
        </div>

        <p className="food-item-desc">{description}</p>

        <div className="food-item-footer">
          <div className="food-item-prices">
            <p className="food-item-price">₹{finalPrice}</p>
            {discount > 0 && (
              <p className="food-item-old-price">₹{price}</p>
            )}
          </div>
          <p className="food-item-reviews">({reviewCount} reviews)</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;






import { getFoodRating } from "./ratings";

// ✅ Food ke badges nikalo
export const getFoodBadges = (food) => {
  const badges = [];
  const { rating, reviewCount } = getFoodRating(food._id);

  // 🔥 Bestseller — agar rating 4.5+ aur 100+ reviews
  if (rating >= 4.5 && reviewCount > 100) {
    badges.push({
      type: "bestseller",
      label: "🔥 Bestseller",
      bg: "linear-gradient(135deg, #f39c12, #e67e22)",
      color: "white",
    });
  }

  // 🆕 New — agar ID high hai (recently added)
  const numericId = parseInt(food._id) || 0;
  if (numericId > 25) {
    badges.push({
      type: "new",
      label: "🆕 New",
      bg: "linear-gradient(135deg, #27ae60, #2ecc71)",
      color: "white",
    });
  }

  // 💰 Discount — SIRF tab jab actual discount > 0 ho
  if (food.discount && food.discount > 0) {
    badges.push({
      type: "discount",
      label: `💰 ${food.discount}% OFF`,
      bg: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
    });
  }

  // 🌱 Pure Veg — category se
  if (food.category === "Pure Veg" || food.category === "Salad") {
    badges.push({
      type: "veg",
      label: "🌱 Veg",
      bg: "linear-gradient(135deg, #27ae60, #16a085)",
      color: "white",
    });
  }

  // Max 2 badges dikhao (clutter na ho)
  return badges.slice(0, 2);
};






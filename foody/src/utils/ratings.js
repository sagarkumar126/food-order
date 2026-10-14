// ✅ Dummy ratings generate karo (same food ID pe same rating)
export const getFoodRating = (foodId) => {
  let hash = 0;
  for (let i = 0; i < foodId.length; i++) {
    hash = (hash << 5) - hash + foodId.charCodeAt(i);
    hash |= 0;
  }

  const rating = 3.5 + (Math.abs(hash) % 16) / 10;
  const reviewCount = 20 + (Math.abs(hash) % 200);

  return {
    rating: parseFloat(rating.toFixed(1)),
    reviewCount,
  };
};

// ✅ User reviews localStorage se lo
export const getFoodReviews = (foodId) => {
  try {
    const all = JSON.parse(localStorage.getItem("foodReviews") || "{}");
    return all[foodId] || [];
  } catch {
    return [];
  }
};

// ✅ User review save karo
export const saveFoodReview = (foodId, review) => {
  try {
    const all = JSON.parse(localStorage.getItem("foodReviews") || "{}");
    if (!all[foodId]) all[foodId] = [];
    all[foodId].unshift(review);
    localStorage.setItem("foodReviews", JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
};

// ✅ Star display
export const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
};







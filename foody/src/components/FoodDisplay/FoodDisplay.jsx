import React, { useContext, useState, useEffect } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { getFoodRating } from "../../utils/ratings";

const FoodDisplay = ({
  category,
  searchQuery,
  filters = { price: "all", rating: "all", veg: false },
  sortBy = "popularity",
  onCountsChange,
  onSelectFood,
}) => {
  const { food_list } = useContext(StoreContext);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  // ✅ Filter food
  let filteredFood = food_list.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (filters.price === "low") matchesPrice = item.price < 200;
    else if (filters.price === "mid")
      matchesPrice = item.price >= 200 && item.price <= 300;
    else if (filters.price === "high") matchesPrice = item.price > 300;

    let matchesRating = true;
    const { rating } = getFoodRating(item._id);
    if (filters.rating === "4") matchesRating = rating >= 4;
    else if (filters.rating === "4.5") matchesRating = rating >= 4.5;

    let matchesVeg = true;
    if (filters.veg) {
      matchesVeg = item.isVeg === true;
    }

    return (
      matchesCategory &&
      matchesSearch &&
      matchesPrice &&
      matchesRating &&
      matchesVeg
    );
  });

  // ✅ Sort
  filteredFood = [...filteredFood].sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "newest") {
      const aId = parseInt(a._id) || 0;
      const bId = parseInt(b._id) || 0;
      return bId - aId;
    }
    const aR = getFoodRating(a._id).rating;
    const bR = getFoodRating(b._id).rating;
    return bR - aR;
  });

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredFood.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFood = filteredFood.slice(startIndex, endIndex);

  // ✅ Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery, filters, sortBy]);

  // ✅ Scroll to top when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById("food-display");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (onCountsChange) {
      onCountsChange({
        total: food_list.length,
        filtered: filteredFood.length,
      });
    }
  }, [food_list.length, filteredFood.length]);

  // ✅ Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes Near You</h2>

      {/* ✅ Info bar */}
      {filteredFood.length > 0 && (
        <p className="pagination-info">
          Showing <b>{startIndex + 1}-{Math.min(endIndex, filteredFood.length)}</b> of{" "}
          <b>{filteredFood.length}</b> items
        </p>
      )}

      <div className="food-display-list">
        {paginatedFood.length > 0 ? (
          paginatedFood.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              images={item.images}
              discount={item.discount}
              isVeg={item.isVeg}
              stock={item.stock}
              category={item.category}
              onViewDetails={onSelectFood}
            />
          ))
        ) : (
          <p className="no-food">No food items found!</p>
        )}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Prev Button */}
          <button
            className="pagination-btn prev-next"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          <div className="pagination-numbers">
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`dots-${i}`} className="pagination-dots">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-number ${
                    page === currentPage ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            className="pagination-btn prev-next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;




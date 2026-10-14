import React, { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import EditFoodModal from "./EditFoodModal";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const removeFood = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food item? 🗑️"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.post(`${url}/api/food/remove`, { id });
      await fetchList();
      if (res.data.success) {
        toast.success("Food removed successfully!");
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Please select items to delete");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} item(s)? 🗑️\n\nThis cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.post(`${url}/api/food/remove`, { id })
        )
      );
      toast.success(`${selectedIds.length} item(s) deleted successfully!`);
      setSelectedIds([]);
      fetchList();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting some items");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchList();
  }, []);

  const categories = [
    "All",
    "Salad",
    "Rolls",
    "Deserts",
    "Sandwich",
    "Cake",
    "Pure Veg",
    "Pasta",
    "Noodles",
  ];

  const getCategoryCount = (cat) => {
    if (cat === "All") return list.length;
    return list.filter((item) => item.category === cat).length;
  };

  const filteredList = list.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allSelected =
    filteredList.length > 0 &&
    filteredList.every((item) => selectedIds.includes(item._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      const filteredIds = filteredList.map((i) => i._id);
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredList.map((i) => i._id);
      setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  // ✅ SMART IMAGE URL — Cloudinary ya local
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${url}/uploads/${image}`;
  };

  const getStockBadge = (stock) => {
    const s = stock !== undefined ? stock : 50;
    if (s === 0) {
      return <span className="stock-badge out-of-stock">❌ Out of Stock</span>;
    } else if (s <= 10) {
      return <span className="stock-badge low-stock">⚠️ Low: {s}</span>;
    } else {
      return <span className="stock-badge in-stock">✅ {s}</span>;
    }
  };

  const getVegBadge = (isVeg) => {
    return isVeg ? (
      <span className="veg-badge veg">🌱 Veg</span>
    ) : (
      <span className="veg-badge non-veg">🍗 Non-Veg</span>
    );
  };

  const getDiscountBadge = (discount) => {
    if (!discount || discount === 0) return null;
    return <span className="discount-badge">💰 {discount}% OFF</span>;
  };

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <p>All Food List</p>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
            <span className="category-count">{getCategoryCount(cat)}</span>
          </button>
        ))}
      </div>

      {selectedIds.length > 0 && (
        <div className="bulk-action-bar">
          <p>
            <b>{selectedIds.length}</b> item(s) selected
          </p>
          <button
            className="bulk-delete-btn"
            onClick={bulkDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : `🗑️ Delete Selected`}
          </button>
          <button
            className="bulk-cancel-btn"
            onClick={() => setSelectedIds([])}
          >
            Cancel
          </button>
        </div>
      )}

      <p className="list-count">
        Showing <b>{filteredList.length}</b> of <b>{list.length}</b> items
        {selectedCategory !== "All" && (
          <>
            {" "}
            in <b>{selectedCategory}</b>
          </>
        )}
      </p>

      <div className="list-table">
        <div className="list-table-format title list-table-expanded">
          <div>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="row-checkbox"
            />
          </div>
          <b>Image</b>
          <b>Food Details</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b>Type</b>
          <b>Action</b>
        </div>

        {filteredList.length === 0 ? (
          <p className="no-results">
            {searchQuery
              ? `No items found for "${searchQuery}" 🔍`
              : selectedCategory !== "All"
              ? `No items in "${selectedCategory}" category`
              : "No food items yet"}
          </p>
        ) : (
          filteredList.map((item, i) => {
            const isSelected = selectedIds.includes(item._id);
            const imgCount = item.images?.length || 1;
            return (
              <div
                key={i}
                className={`list-table-format list-table-expanded ${
                  isSelected ? "row-selected" : ""
                }`}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item._id)}
                    className="row-checkbox"
                  />
                </div>

                {/* ✅ SMART IMAGE URL */}
                <div className="img-wrapper">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="food-thumb"
                  />
                  {imgCount > 1 && (
                    <span className="img-count-badge">+{imgCount - 1}</span>
                  )}
                </div>

                <div className="food-details-cell">
                  <p className="food-name">{item.name}</p>
                  <p className="food-desc-preview">
                    {item.description?.length > 65
                      ? item.description.slice(0, 65) + "..."
                      : item.description}
                  </p>
                  {item.discount > 0 && (
                    <div className="food-badges-row">
                      {getDiscountBadge(item.discount)}
                    </div>
                  )}
                </div>

                <p className="food-category-cell">{item.category}</p>

                <div className="price-cell">
                  {item.discount > 0 ? (
                    <>
                      <p className="final-price">
                        ₹
                        {Math.round(
                          item.price - (item.price * item.discount) / 100
                        )}
                      </p>
                      <p className="old-price">₹{item.price}</p>
                    </>
                  ) : (
                    <p className="final-price">₹{item.price}</p>
                  )}
                </div>

                <div className="stock-cell">
                  {getStockBadge(item.stock)}
                </div>

                <div className="veg-cell">{getVegBadge(item.isVeg)}</div>

                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => setEditingFood(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => removeFood(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingFood && (
        <EditFoodModal
          food={editingFood}
          url={url}
          onClose={() => setEditingFood(null)}
          onSuccess={fetchList}
        />
      )}
    </div>
  );
};

export default List;




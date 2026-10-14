import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { searchFood } from "../../data/foodDatabase";

const Add = ({ url }) => {
  const [images, setImages] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    stock: 50,
    discount: 0,
    isVeg: false,
  });

  // ✅ AI Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  // ✅ FIXED: Multiple images select (purani + nayi dono add)
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const total = images.length + files.length;

    if (total > 5) {
      toast.warning(
        `Max 5 images allowed. Abhi ${images.length} hain, ${
          5 - images.length
        } aur add kar sakte ho.`
      );
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = ""; // ✅ Same file dobara select karne ke liye reset
  };

  // ✅ Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================
  // ✅ AI SEARCH HANDLERS
  // ============================================
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const results = searchFood(value);
    setSuggestions(results);
    setShowSuggestions(true);
  };

  // ✅ Suggestion click — form auto-fill (Veg/Non-Veg bhi auto)
  const handleSelectFood = (food) => {
    setData((d) => ({
      ...d,
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      isVeg: food.isVeg ?? false,
    }));
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    toast.success(
      `✅ ${food.name} ka data fill ho gaya! (${food.isVeg ? "🌱 Veg" : "🍗 Non-Veg"})`
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.warning("Please upload at least 1 image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("stock", Number(data.stock));
    formData.append("discount", Number(data.discount));
    formData.append("isVeg", data.isVeg);

    // ✅ Saari images bhejo
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await axios.post(`${url}/api/food/add`, formData);
      if (res.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          stock: 50,
          discount: 0,
          isVeg: false,
        });
        setImages([]);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const styles = {
    imagesGrid: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "10px",
    },
    imageBox: {
      position: "relative",
      width: "100px",
      height: "100px",
      borderRadius: "10px",
      overflow: "hidden",
      border: "2px solid #eee",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    removeBtn: {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "22px",
      height: "22px",
      borderRadius: "50%",
      background: "rgba(231, 76, 60, 0.9)",
      color: "white",
      border: "none",
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    addMoreBox: {
      width: "100px",
      height: "100px",
      borderRadius: "10px",
      border: "2px dashed #ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      color: "#aaa",
      cursor: "pointer",
      transition: "0.3s",
      background: "#fafafa",
    },
    row2: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    vegToggle: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 16px",
      background: "#fafafa",
      borderRadius: "10px",
      border: "2px solid #eee",
      cursor: "pointer",
      transition: "0.3s",
    },
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* ============================================ */}
        {/* ✅ AI SEARCH BAR */}
        {/* ============================================ */}
        <div className="ai-search-wrapper">
          <div className="ai-search-bar">
            <span className="ai-icon">🤖</span>
            <input
              type="text"
              placeholder="AI se search karo — jaise 'salad', 'garden', 'greek'..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ai-clear-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                ✕
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="ai-suggestions">
              <p className="ai-suggestions-title">
                💡 {suggestions.length} results mile
              </p>
              {suggestions.map((food, i) => (
                <div
                  key={i}
                  className="ai-suggestion-item"
                  onClick={() => handleSelectFood(food)}
                >
                  <img src={food.image} alt={food.name} />
                  <div className="ai-suggestion-info">
                    <p className="ai-suggestion-name">
                      <span
                        className={`ai-veg-dot ${
                          food.isVeg ? "veg" : "nonveg"
                        }`}
                      ></span>
                      {food.name}
                    </p>
                    <p className="ai-suggestion-desc">{food.description}</p>
                    <span className="ai-suggestion-category">
                      {food.category}
                    </span>
                  </div>
                  <span className="ai-suggestion-price">₹{food.price}</span>
                </div>
              ))}
            </div>
          )}

          {showSuggestions && searchQuery && suggestions.length === 0 && (
            <div className="ai-suggestions">
              <p className="ai-no-result">
                ❌ Koi item nahi mila "{searchQuery}" ke liye
              </p>
            </div>
          )}
        </div>

        {/* ✅ Multiple Image Upload */}
        <div className="add-img-upload flex-col">
          <p>
            Upload Images (Max 5) —{" "}
            <span style={{ color: "#ff6347", fontWeight: "700" }}>
              {images.length}/5 selected
            </span>
          </p>
          <div style={styles.imagesGrid}>
            {images.map((img, index) => (
              <div key={index} style={styles.imageBox}>
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  style={styles.image}
                />
                <button
                  type="button"
                  style={styles.removeBtn}
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label htmlFor="images-input" style={styles.addMoreBox}>
                +
              </label>
            )}
            <input
              type="file"
              id="images-input"
              hidden
              multiple
              accept="image/*"
              onChange={onImagesChange}
            />
          </div>
        </div>

        {/* Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here.."
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            cols="30"
            rows="10"
            placeholder="Write content here.."
            required
          />
        </div>

        {/* Category + Price + Stock */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="₹20"
              required
            />
          </div>

          <div className="add-price flex-col">
            <p>Stock Quantity</p>
            <input
              onChange={onChangeHandler}
              value={data.stock}
              type="number"
              name="stock"
              placeholder="50"
              min="0"
            />
          </div>

          <div className="add-price flex-col">
            <p>Discount %</p>
            <input
              onChange={onChangeHandler}
              value={data.discount}
              type="number"
              name="discount"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* ✅ Veg Toggle */}
        <div className="flex-col" style={{ marginBottom: "20px" }}>
          <p style={{ marginBottom: "10px" }}>Food Type</p>
          <div style={styles.row2}>
            <div
              style={{
                ...styles.vegToggle,
                borderColor: data.isVeg ? "#27ae60" : "#eee",
                background: data.isVeg ? "#e8f5e9" : "#fafafa",
              }}
              onClick={() => setData((d) => ({ ...d, isVeg: true }))}
            >
              <span style={{ fontSize: "20px" }}>🌱</span>
              <span
                style={{
                  fontWeight: "600",
                  color: data.isVeg ? "#27ae60" : "#555",
                }}
              >
                Veg
              </span>
            </div>
            <div
              style={{
                ...styles.vegToggle,
                borderColor: !data.isVeg ? "#e74c3c" : "#eee",
                background: !data.isVeg ? "#ffe6e6" : "#fafafa",
              }}
              onClick={() => setData((d) => ({ ...d, isVeg: false }))}
            >
              <span style={{ fontSize: "20px" }}>🍗</span>
              <span
                style={{
                  fontWeight: "600",
                  color: !data.isVeg ? "#e74c3c" : "#555",
                }}
              >
                Non-Veg
              </span>
            </div>
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;


import React, { useState, useEffect, useRef, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { getFoodRating } from "../../utils/ratings";

const SearchBar = ({ onSearchChange, onSelectFood }) => {
  const { food_list, url } = useContext(StoreContext);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef(null);

  // ✅ Smart image URL
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${url}/uploads/${img}`;
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("recentSearches") || "[]"
      );
      setRecentSearches(saved);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase().trim();

    const foodMatches = food_list
      .filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((item) => ({
        type: "food",
        _id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        category: item.category,
        rating: getFoodRating(item._id).rating,
      }));

    const allCategories = [...new Set(food_list.map((f) => f.category))];
    const categoryMatches = allCategories
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        type: "category",
        name: c,
      }));

    setSuggestions([...foodMatches, ...categoryMatches]);
    setHighlightedIndex(-1);
  }, [query, food_list]);

  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    toast.info("Recent searches cleared");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);
    if (onSearchChange) onSearchChange(val);
  };

  const handleSuggestionClick = (sug) => {
    if (sug.type === "food") {
      saveRecentSearch(sug.name);
      if (onSelectFood) onSelectFood(sug);
      setShowDropdown(false);
    } else if (sug.type === "category") {
      setQuery(sug.name);
      if (onSearchChange) onSearchChange(sug.name);
      saveRecentSearch(sug.name);
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearchChange) onSearchChange("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      } else if (query.trim()) {
        saveRecentSearch(query);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const styles = {
    wrapper: {
      position: "relative",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      fontFamily: "Poppins, sans-serif",
    },
    inputBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "white",
      border: "2px solid #eee",
      borderRadius: "50px",
      padding: "12px 20px",
      transition: "0.3s",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "15px",
      fontFamily: "Poppins, sans-serif",
      color: "#262626",
      background: "transparent",
    },
    clearBtn: {
      background: "#ffe6e0",
      border: "none",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      cursor: "pointer",
      color: "tomato",
      fontSize: "12px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      right: 0,
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
      border: "1px solid #f0f0f0",
      maxHeight: "450px",
      overflowY: "auto",
      zIndex: 100,
      animation: "fadeIn 0.2s ease",
    },
    sectionLabel: {
      fontSize: "11px",
      fontWeight: "700",
      color: "#aaa",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      padding: "12px 18px 6px",
    },
    suggestionItem: (highlighted) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px 18px",
      cursor: "pointer",
      transition: "0.2s",
      background: highlighted ? "#fff4f2" : "transparent",
    }),
    suggImg: {
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      objectFit: "cover",
    },
    suggInfo: {
      flex: 1,
      minWidth: 0,
    },
    suggName: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#262626",
      marginBottom: "2px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    suggMeta: {
      fontSize: "12px",
      color: "#888",
      display: "flex",
      gap: "10px",
    },
    suggPrice: {
      fontSize: "14px",
      fontWeight: "700",
      color: "tomato",
    },
    categoryIcon: {
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      background: "#fff4f2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    recentItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px 18px",
      cursor: "pointer",
      transition: "0.2s",
      fontSize: "14px",
      color: "#555",
    },
    clearRecentBtn: {
      background: "transparent",
      border: "none",
      color: "tomato",
      fontSize: "11px",
      fontWeight: "700",
      cursor: "pointer",
      padding: "4px 8px",
      marginLeft: "auto",
    },
    empty: {
      padding: "30px 20px",
      textAlign: "center",
      color: "#aaa",
      fontSize: "13px",
    },
  };

  return (
    <div style={styles.wrapper} ref={wrapperRef}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div
        style={{
          ...styles.inputBox,
          borderColor: showDropdown ? "tomato" : "#eee",
          boxShadow: showDropdown
            ? "0 0 0 4px rgba(255, 99, 71, 0.1)"
            : "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <span style={{ fontSize: "18px" }}>🔍</span>
        <input
          style={styles.input}
          type="text"
          placeholder="Search for food, category..."
          value={query}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button style={styles.clearBtn} onClick={handleClear}>
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div style={styles.dropdown}>
          {query.trim().length > 0 && suggestions.length > 0 && (
            <>
              <div style={styles.sectionLabel}>Suggestions</div>
              {suggestions.map((sug, i) => (
                <div
                  key={i}
                  style={styles.suggestionItem(i === highlightedIndex)}
                  onClick={() => handleSuggestionClick(sug)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  {sug.type === "food" ? (
                    <>
                      <img
                        src={getImageUrl(sug.image)}
                        alt={sug.name}
                        style={styles.suggImg}
                      />
                      <div style={styles.suggInfo}>
                        <div style={styles.suggName}>{sug.name}</div>
                        <div style={styles.suggMeta}>
                          <span>⭐ {sug.rating}</span>
                          <span>🍽️ {sug.category}</span>
                        </div>
                      </div>
                      <span style={styles.suggPrice}>₹{sug.price}</span>
                    </>
                  ) : (
                    <>
                      <div style={styles.categoryIcon}>🍽️</div>
                      <div style={styles.suggInfo}>
                        <div style={styles.suggName}>{sug.name}</div>
                        <div style={styles.suggMeta}>
                          <span>Category</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          {query.trim().length > 0 && suggestions.length === 0 && (
            <div style={styles.empty}>
              <p style={{ fontSize: "32px", margin: "0 0 10px" }}>🔍</p>
              <p>No results for "{query}"</p>
            </div>
          )}

          {query.trim().length === 0 && recentSearches.length > 0 && (
            <>
              <div
                style={{
                  ...styles.sectionLabel,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Recent Searches
                <button
                  style={styles.clearRecentBtn}
                  onClick={clearRecent}
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <div
                  key={i}
                  style={styles.recentItem}
                  onClick={() => {
                    setQuery(term);
                    if (onSearchChange) onSearchChange(term);
                    setShowDropdown(false);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ fontSize: "16px", color: "#aaa" }}>🕐</span>
                  {term}
                </div>
              ))}
            </>
          )}

          {query.trim().length === 0 && recentSearches.length === 0 && (
            <div style={styles.empty}>
              <p style={{ fontSize: "32px", margin: "0 0 10px" }}>🔍</p>
              <p>Start typing to search...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;




import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditFoodModal = ({ food, url, onClose, onSuccess }) => {
  const [newImages, setNewImages] = useState([]);

  // ✅ NEW: Existing images ka state — taaki delete kar sake
  const [existingImages, setExistingImages] = useState(
    food.images && food.images.length > 0 ? food.images : [food.image]
  );

  const [data, setData] = useState({
    name: food.name,
    description: food.description,
    price: food.price,
    category: food.category,
    stock: food.stock !== undefined ? food.stock : 50,
    discount: food.discount !== undefined ? food.discount : 0,
    isVeg: food.isVeg !== undefined ? food.isVeg : false,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  // ✅ Multiple images APPEND karo
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const total = newImages.length + files.length;

    if (total > 5) {
      toast.warning(
        `Max 5 nayi images. Abhi ${newImages.length} hain, ${
          5 - newImages.length
        } aur add kar sakte ho.`
      );
      e.target.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ NEW: Purani image delete karo
  const removeExistingImage = (imgToRemove) => {
    if (existingImages.length === 1) {
      toast.warning("At least 1 image required. Add new first.");
      return;
    }
    setExistingImages((prev) => prev.filter((img) => img !== imgToRemove));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", food._id);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("stock", Number(data.stock));
      formData.append("discount", Number(data.discount));
      formData.append("isVeg", data.isVeg);

      // ✅ Purani bachi hui images bhejo
      formData.append("existingImages", JSON.stringify(existingImages));

      if (newImages.length > 0) {
        newImages.forEach((img) => {
          formData.append("images", img);
        });
      }

      const res = await axios.post(`${url}/api/food/update`, formData);

      if (res.data.success) {
        toast.success("Food updated successfully! ✅");
        onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${url}/uploads/${image}`;
  };

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 15, 30, 0.7)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px",
      animation: "overlayIn 0.3s ease",
    },
    modal: {
      background: "white",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "720px",
      maxHeight: "92vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow:
        "0 30px 80px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      fontFamily: "Poppins, sans-serif",
      animation: "modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    header: {
      background: "linear-gradient(135deg, #ff6347 0%, #e74c3c 100%)",
      padding: "24px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      position: "relative",
      overflow: "hidden",
    },
    headerBg: {
      position: "absolute",
      top: "-50%",
      right: "-10%",
      width: "300px",
      height: "300px",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
      borderRadius: "50%",
      pointerEvents: "none",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      position: "relative",
      zIndex: 1,
    },
    headerIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
    },
    headerTitle: {
      fontSize: "22px",
      fontWeight: "800",
      margin: 0,
      letterSpacing: "-0.5px",
    },
    headerSubtitle: {
      fontSize: "12px",
      opacity: 0.9,
      margin: "2px 0 0 0",
      fontWeight: "500",
    },
    closeBtn: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.2)",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      color: "white",
      fontSize: "18px",
      fontWeight: "700",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s",
      position: "relative",
      zIndex: 1,
    },
    tabs: {
      display: "flex",
      gap: "4px",
      padding: "16px 30px 0",
      borderBottom: "1px solid #f0f0f0",
      background: "#fafafa",
    },
    tab: (active) => ({
      padding: "12px 22px",
      background: active ? "white" : "transparent",
      border: "none",
      borderRadius: "12px 12px 0 0",
      fontSize: "13.5px",
      fontWeight: "700",
      color: active ? "#ff6347" : "#888",
      cursor: "pointer",
      transition: "all 0.25s",
      fontFamily: "Poppins, sans-serif",
      borderBottom: active ? "3px solid #ff6347" : "3px solid transparent",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }),
    body: {
      padding: "24px 30px",
      overflowY: "auto",
      flex: 1,
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12.5px",
      fontWeight: "700",
      color: "#555",
      marginBottom: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    },
    input: {
      width: "100%",
      padding: "13px 16px",
      border: "2px solid #eef0f5",
      borderRadius: "12px",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
      transition: "all 0.25s",
      boxSizing: "border-box",
      background: "#fafafa",
      color: "#262626",
      fontWeight: "500",
    },
    textarea: {
      width: "100%",
      padding: "13px 16px",
      border: "2px solid #eef0f5",
      borderRadius: "12px",
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      outline: "none",
      transition: "all 0.25s",
      resize: "vertical",
      minHeight: "100px",
      boxSizing: "border-box",
      background: "#fafafa",
      color: "#262626",
      fontWeight: "500",
    },
    row: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
    },
    imagesSection: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    imagesGrid: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    imageBox: {
      position: "relative",
      width: "90px",
      height: "90px",
      borderRadius: "14px",
      overflow: "hidden",
      border: "2px solid #eef0f5",
      transition: "0.3s",
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
      background: "rgba(231, 76, 60, 0.95)",
      color: "white",
      border: "2px solid white",
      fontSize: "11px",
      fontWeight: "800",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    addMoreBox: {
      width: "90px",
      height: "90px",
      borderRadius: "14px",
      border: "2px dashed #ccc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      color: "#aaa",
      cursor: "pointer",
      background: "#fafafa",
      transition: "0.3s",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "800",
      color: "#262626",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    vegRow: {
      display: "flex",
      gap: "12px",
    },
    vegToggle: (active, color) => ({
      flex: 1,
      padding: "16px",
      border: `2px solid ${active ? color : "#eef0f5"}`,
      borderRadius: "14px",
      background: active ? `${color}15` : "#fafafa",
      cursor: "pointer",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      fontSize: "14px",
      fontWeight: "700",
      color: active ? color : "#888",
    }),
    footer: {
      padding: "18px 30px",
      background: "#fafafa",
      borderTop: "1px solid #f0f0f0",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    cancelBtn: {
      padding: "12px 26px",
      background: "white",
      color: "#555",
      border: "2px solid #eef0f5",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "0.3s",
      fontFamily: "Poppins, sans-serif",
    },
    saveBtn: (loading) => ({
      padding: "12px 30px",
      background: loading
        ? "#ffb3a3"
        : "linear-gradient(135deg, #ff6347, #e74c3c)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s",
      fontFamily: "Poppins, sans-serif",
      boxShadow: "0 6px 20px rgba(255, 99, 71, 0.4)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }),
    preview: {
      background: "linear-gradient(135deg, #fff9f7, #fff4f2)",
      border: "2px solid #ffe6e0",
      borderRadius: "16px",
      padding: "16px",
      marginBottom: "20px",
      display: "flex",
      gap: "16px",
      alignItems: "center",
    },
    previewImg: {
      width: "70px",
      height: "70px",
      borderRadius: "14px",
      objectFit: "cover",
      border: "2px solid white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    previewInfo: {
      flex: 1,
    },
    previewName: {
      fontSize: "16px",
      fontWeight: "800",
      color: "#262626",
      margin: 0,
      marginBottom: "4px",
    },
    previewMeta: {
      display: "flex",
      gap: "12px",
      fontSize: "12px",
      color: "#888",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>
        {`
          @keyframes overlayIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerBg}></div>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>✏️</div>
            <div>
              <h2 style={styles.headerTitle}>Edit Food Item</h2>
              <p style={styles.headerSubtitle}>
                Update the details of your food item
              </p>
            </div>
          </div>
          <button
            style={styles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.35)";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            ✕
          </button>
        </div>

        <div style={styles.tabs}>
          <button
            style={styles.tab(activeTab === "basic")}
            onClick={() => setActiveTab("basic")}
          >
            📝 Basic Info
          </button>
          <button
            style={styles.tab(activeTab === "pricing")}
            onClick={() => setActiveTab("pricing")}
          >
            💰 Pricing & Stock
          </button>
          <button
            style={styles.tab(activeTab === "images")}
            onClick={() => setActiveTab("images")}
          >
            🖼️ Images
          </button>
        </div>

        <form onSubmit={onSubmitHandler} style={{ display: "contents" }}>
          <div style={styles.body}>
            <div style={styles.preview}>
              <img
                src={getImageUrl(existingImages[0])}
                alt={food.name}
                style={styles.previewImg}
              />
              <div style={styles.previewInfo}>
                <p style={styles.previewName}>{data.name}</p>
                <div style={styles.previewMeta}>
                  <span>🍽️ {data.category}</span>
                  <span>💰 ₹{data.price}</span>
                  <span>
                    {data.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
                  </span>
                </div>
              </div>
            </div>

            {activeTab === "basic" && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>🍔 Food Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>📄 Description</label>
                  <textarea
                    style={styles.textarea}
                    name="description"
                    value={data.description}
                    onChange={onChangeHandler}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>🍽️ Category</label>
                  <select
                    style={styles.input}
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

                <div style={styles.formGroup}>
                  <label style={styles.label}>🥗 Food Type</label>
                  <div style={styles.vegRow}>
                    <div
                      style={styles.vegToggle(data.isVeg === true, "#27ae60")}
                      onClick={() =>
                        setData((d) => ({ ...d, isVeg: true }))
                      }
                    >
                      🌱 Veg
                    </div>
                    <div
                      style={styles.vegToggle(data.isVeg === false, "#e74c3c")}
                      onClick={() =>
                        setData((d) => ({ ...d, isVeg: false }))
                      }
                    >
                      🍗 Non-Veg
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "pricing" && (
              <>
                <div style={styles.row}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>💰 Price (₹)</label>
                    <input
                      style={styles.input}
                      type="number"
                      name="price"
                      value={data.price}
                      onChange={onChangeHandler}
                      required
                    />
                  </div>

                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>📦 Stock</label>
                    <input
                      style={styles.input}
                      type="number"
                      name="stock"
                      value={data.stock}
                      onChange={onChangeHandler}
                      min="0"
                    />
                  </div>

                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>🏷️ Discount %</label>
                    <input
                      style={styles.input}
                      type="number"
                      name="discount"
                      value={data.discount}
                      onChange={onChangeHandler}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {data.discount > 0 && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #e8f5e9, #d4f5d8)",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      border: "2px solid #27ae60",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#1e8449",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    💡 Final price after {data.discount}% discount:{" "}
                    <span style={{ fontSize: "16px", fontWeight: "800" }}>
                      ₹
                      {Math.round(
                        data.price - (data.price * data.discount) / 100
                      )}
                    </span>
                  </div>
                )}
              </>
            )}

            {activeTab === "images" && (
              <div style={styles.imagesSection}>
                {/* ✅ EXISTING IMAGES — delete button ke saath */}
                <div>
                  <div style={styles.sectionTitle}>
                    📸 Current Images ({existingImages.length})
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "12px",
                    }}
                  >
                    🗑️ Kisi bhi image pe ✕ click karke delete kar sakte ho
                  </p>
                  <div style={styles.imagesGrid}>
                    {existingImages.map((img, index) => (
                      <div key={index} style={styles.imageBox}>
                        <img
                          src={getImageUrl(img)}
                          alt={`existing-${index}`}
                          style={styles.image}
                        />
                        {/* ✅ NEW: Delete button purani image pe */}
                        <button
                          type="button"
                          style={styles.removeBtn}
                          onClick={() => removeExistingImage(img)}
                          title="Delete this image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ NEW IMAGES */}
                <div>
                  <div style={styles.sectionTitle}>
                    ✨ Add New Images (Max 5)
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "12px",
                    }}
                  >
                    Nayi images add karo — purani ke saath add hongi
                  </p>
                  <div style={styles.imagesGrid}>
                    {newImages.map((img, index) => (
                      <div key={index} style={styles.imageBox}>
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`new-${index}`}
                          style={styles.image}
                        />
                        <button
                          type="button"
                          style={styles.removeBtn}
                          onClick={() => removeNewImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {newImages.length < 5 && (
                      <label
                        htmlFor="edit-images"
                        style={styles.addMoreBox}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#ff6347";
                          e.currentTarget.style.color = "#ff6347";
                          e.currentTarget.style.background = "#fff4f2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#ccc";
                          e.currentTarget.style.color = "#aaa";
                          e.currentTarget.style.background = "#fafafa";
                        }}
                      >
                        <span>+</span>
                        <span style={{ fontSize: "10px", fontWeight: "700" }}>
                          ADD
                        </span>
                      </label>
                    )}
                    <input
                      type="file"
                      id="edit-images"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={onImagesChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
                e.currentTarget.style.borderColor = "#ccc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "#eef0f5";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveBtn(loading)}
              disabled={loading}
            >
              {loading ? "⏳ Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodModal;




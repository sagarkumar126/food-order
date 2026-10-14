import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const isEmpty = subtotal === 0;

  const handleProceedToCheckout = () => {
    if (isEmpty) {
      toast.warning("🛒 Your cart is empty! Please add items first.");
      return;
    }

    if (!token) {
      toast.warning("🔒 Please login first to proceed to checkout!", {
        position: "top-center",
        autoClose: 3000,
      });
      window.dispatchEvent(new CustomEvent("openLoginPopup"));
      return;
    }

    navigate("/order");
  };

  // ✅ EMPTY CART
  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to your cart and come back!</p>
          <button
            className="browse-menu-btn"
            onClick={() => navigate("/")}
          >
            🍕 Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* HEADER */}
      <div className="cart-header">
        <h1>🛒 Your Cart</h1>
        <p className="cart-subtitle">
          Review your items and proceed to checkout
        </p>
      </div>

      {/* CART TABLE */}
      <div className="cart-table-wrapper">
        <div className="cart-table">
          <div className="cart-table-head">
            <p>Item</p>
            <p>Price</p>
            <p>Qty</p>
            <p>Total</p>
            <p></p>
          </div>

          {food_list.map((item) => {
            const qty = cartItems[item._id];
            if (!qty || qty <= 0) return null;

            const maxStock = item.stock !== undefined ? item.stock : 50;
            const isMax = qty >= maxStock;

            return (
              <div className="cart-table-row" key={item._id}>
                {/* Item Info */}
                <div className="cart-item-info">
                  <img
                    src={`${url}/uploads/${item.image}`}
                    alt={item.name}
                  />
                  <div>
                    <p className="cart-item-name">{item.name}</p>
                    {item.category && (
                      <p className="cart-item-category">
                        {item.category}
                      </p>
                    )}
                    {isMax && (
                      <p className="cart-stock-warn">
                        ⚠️ Max stock reached ({maxStock})
                      </p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <p className="cart-item-price">₹{item.price}</p>

                {/* ✅ QTY CONTROLS */}
                <div className="cart-qty-controls">
                  <button
                    className="qty-btn minus"
                    onClick={() => removeFromCart(item._id)}
                    title="Decrease"
                  >
                    −
                  </button>
                  <span className="qty-display">{qty}</span>
                  <button
                    className="qty-btn plus"
                    onClick={() => addToCart(item._id)}
                    disabled={isMax}
                    title={isMax ? "Max stock reached" : "Increase"}
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <p className="cart-item-total">
                  ₹{item.price * qty}
                </p>

                {/* Remove */}
                <button
                  className="cart-remove-btn"
                  onClick={() => {
                    // ✅ Poora item remove karo
                    for (let i = 0; i < qty; i++) {
                      removeFromCart(item._id);
                    }
                    toast.info(`${item.name} removed from cart`);
                  }}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CART BOTTOM */}
      <div className="cart-bottom-wrapper">
        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery Fee</span>
            <span>₹2</span>
          </div>
          <div className="cart-summary-divider"></div>
          <div className="cart-summary-row cart-summary-total">
            <b>Total</b>
            <b>₹{subtotal + 2}</b>
          </div>

          <button
            className="checkout-btn"
            onClick={handleProceedToCheckout}
          >
            PROCEED TO CHECKOUT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;





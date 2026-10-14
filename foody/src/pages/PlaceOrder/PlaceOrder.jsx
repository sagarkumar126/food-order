import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, clearCart } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) navigate("/cart");
  }, [token, navigate, getTotalCartAmount]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.firstName.trim()) newErrors.firstName = "First name is required";
    if (!data.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!data.street.trim()) newErrors.street = "Street is required";
    if (!data.city.trim()) newErrors.city = "City is required";
    if (!data.state.trim()) newErrors.state = "State is required";
    if (!data.zipcode.trim()) newErrors.zipcode = "Zip code is required";
    if (!data.country.trim()) newErrors.country = "Country is required";
    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone must be 10 digits";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderItems = food_list.filter((f) => cartItems[f._id] > 0);
    if (orderItems.length === 0) {
      toast.warning("No items in cart!");
      return;
    }

    if (paymentMethod === "COD") {
      setShowConfirm(true);
    } else {
      placeOrderNow();
    }
  };

  const placeOrderNow = async () => {
    setShowConfirm(false);
    setLoading(true);

    const orderItems = food_list
      .filter((f) => cartItems[f._id] > 0)
      .map((f) => ({ ...f, quantity: cartItems[f._id] }));

    const finalAmount = getTotalCartAmount() + 2;

    try {
      const res = await axios.post(
        `${url}/api/order/place`,
        {
          address: data,
          items: orderItems,
          amount: finalAmount,
          deliveryType: "Home Delivery",
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        if (res.data.isCOD) {
          // ✅ COD — Direct MyOrders pe bhejo
          await clearCart();
          toast.success("Order placed successfully! 🎉");
          navigate("/myorders");
        } else {
          // ✅ Stripe — redirect
          window.location.replace(res.data.session_url);
        }
      } else {
        toast.error(res.data.message || "Error placing order");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `form-input ${errors[field] ? "input-error" : ""}`;

  return (
    <>
      <form onSubmit={handleSubmit} className="place-order" noValidate>
        <div className="place-order-left">
          <p className="title">📍 Delivery Address</p>

          <div className="multi-fields">
            <div className="field-wrapper">
              <input
                className={inputClass("firstName")}
                name="firstName"
                onChange={onChangeHandler}
                value={data.firstName}
                type="text"
                placeholder="First Name"
              />
              {errors.firstName && (
                <span className="error-msg">⚠️ {errors.firstName}</span>
              )}
            </div>
            <div className="field-wrapper">
              <input
                className={inputClass("lastName")}
                name="lastName"
                onChange={onChangeHandler}
                value={data.lastName}
                type="text"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <span className="error-msg">⚠️ {errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="field-wrapper">
            <input
              className={inputClass("email")}
              name="email"
              type="email"
              onChange={onChangeHandler}
              value={data.email}
              placeholder="Email Address"
            />
            {errors.email && (
              <span className="error-msg">⚠️ {errors.email}</span>
            )}
          </div>

          <div className="field-wrapper">
            <input
              className={inputClass("street")}
              name="street"
              type="text"
              onChange={onChangeHandler}
              value={data.street}
              placeholder="Street"
            />
            {errors.street && (
              <span className="error-msg">⚠️ {errors.street}</span>
            )}
          </div>

          <div className="multi-fields">
            <div className="field-wrapper">
              <input
                className={inputClass("city")}
                name="city"
                type="text"
                onChange={onChangeHandler}
                value={data.city}
                placeholder="City"
              />
              {errors.city && (
                <span className="error-msg">⚠️ {errors.city}</span>
              )}
            </div>
            <div className="field-wrapper">
              <input
                className={inputClass("state")}
                name="state"
                type="text"
                onChange={onChangeHandler}
                value={data.state}
                placeholder="State"
              />
              {errors.state && (
                <span className="error-msg">⚠️ {errors.state}</span>
              )}
            </div>
          </div>

          <div className="multi-fields">
            <div className="field-wrapper">
              <input
                className={inputClass("zipcode")}
                name="zipcode"
                type="text"
                onChange={onChangeHandler}
                value={data.zipcode}
                placeholder="Zip Code"
              />
              {errors.zipcode && (
                <span className="error-msg">⚠️ {errors.zipcode}</span>
              )}
            </div>
            <div className="field-wrapper">
              <input
                className={inputClass("country")}
                name="country"
                type="text"
                onChange={onChangeHandler}
                value={data.country}
                placeholder="Country"
              />
              {errors.country && (
                <span className="error-msg">⚠️ {errors.country}</span>
              )}
            </div>
          </div>

          <div className="field-wrapper">
            <input
              className={inputClass("phone")}
              name="phone"
              type="text"
              onChange={onChangeHandler}
              value={data.phone}
              placeholder="Phone Number (10 digits)"
            />
            {errors.phone && (
              <span className="error-msg">⚠️ {errors.phone}</span>
            )}
          </div>

          <div className="payment-method-section">
            <p className="title">💳 Payment Method</p>
            <div className="payment-options">
              <div
                className={`payment-card ${
                  paymentMethod === "COD" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("COD")}
              >
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <h4>Cash on Delivery</h4>
                  <p>Pay when your order arrives</p>
                </div>
                <div className="payment-radio">
                  {paymentMethod === "COD" && <div className="radio-dot" />}
                </div>
              </div>

              <div
                className={`payment-card ${
                  paymentMethod === "Stripe" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("Stripe")}
              >
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <h4>Pay Online</h4>
                  <p>Credit / Debit Card via Stripe</p>
                </div>
                <div className="payment-radio">
                  {paymentMethod === "Stripe" && (
                    <div className="radio-dot" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹2</p>
              </div>
              <div className="cart-total-details">
                <p>Payment</p>
                <p>{paymentMethod === "COD" ? "💵 Cash" : "💳 Online"}</p>
              </div>
              <div className="cart-total-details">
                <b>Total</b>
                <b>₹{getTotalCartAmount() + 2}</b>
              </div>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading
              ? "⏳ Placing Order..."
              : paymentMethod === "COD"
              ? "Place Order (Pay on Delivery) 💵"
              : "PROCEED TO PAYMENT 💳"}
          </button>
        </div>
      </form>

      {/* ✅ COD CONFIRM POPUP */}
      {showConfirm && paymentMethod === "COD" && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">🤔</div>
            <h3 className="confirm-title">Place this order?</h3>
            <p className="confirm-message">
              You will pay ₹{getTotalCartAmount() + 2} when your order arrives.
            </p>

            <div className="confirm-summary">
              <div className="confirm-row">
                <span>Items</span>
                <span>
                  {food_list.filter((f) => cartItems[f._id] > 0).length} items
                </span>
              </div>
              <div className="confirm-row">
                <span>Payment</span>
                <span>💵 Cash</span>
              </div>
              <div className="confirm-row confirm-total">
                <b>Total</b>
                <b>₹{getTotalCartAmount() + 2}</b>
              </div>
            </div>

            <div className="confirm-actions">
              <button
                className="confirm-btn cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn proceed" onClick={placeOrderNow}>
                Yes, Place Order 💵
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { getCartCount, token, user, logout } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowProfileDropdown(false);
  }, [location.pathname]);

  // ✅ URL → Menu sync (so correct tab highlights)
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/home") setMenu("home");
    else if (path === "/myorders") setMenu("orders");
    else if (path === "/wishlist") setMenu("wishlist");
    else if (path === "/cart") setMenu("cart");
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const userName =
    user?.name && user.name.trim() !== ""
      ? user.name
      : user?.email?.split("@")[0] || "User";

  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?\n\nAap logout karna chahte ho?"
    );
    if (confirmLogout) {
      logout();
      toast.success("Logged out successfully! 👋");
      setShowProfileDropdown(false);
      navigate("/");
    }
  };

  // ✅ Smooth scroll to section
  const scrollToSection = (sectionId) => {
    setShowMobileMenu(false);

    // Agar home page pe nahi hain → pehle home pe jao
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      return;
    }

    // Home pe hain → direct scroll
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      toast.info("Section not found");
    }
  };

  // ✅ Mobile-App link ke liye handlers
  const handleMobileApp = () => {
    setMenu("mobile-App");
    scrollToSection("app-download");
  };

  // ✅ Contact Us link ke liye handler
  const handleContactUs = () => {
    setMenu("contact us");
    scrollToSection("footer");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      {/* LOGO */}
      <Link to="/" className="navbar-logo">
        <img src={assets.logo} alt="logo" />
      </Link>

      {/* DESKTOP MENU */}
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            className={menu === "home" ? "active" : ""}
            onClick={() => setMenu("home")}
          >
            Home
          </Link>
        </li>

        {token && (
          <li>
            <Link
              to="/myorders"
              className={menu === "orders" ? "active" : ""}
              onClick={() => setMenu("orders")}
            >
              My Orders
            </Link>
          </li>
        )}

        {token && (
          <li>
            <Link
              to="/wishlist"
              className={menu === "wishlist" ? "active" : ""}
              onClick={() => setMenu("wishlist")}
            >
              Wishlist
            </Link>
          </li>
        )}

        <li>
          <button
            type="button"
            className={`nav-menu-btn ${menu === "mobile-App" ? "active" : ""}`}
            onClick={handleMobileApp}
          >
            Mobile-App
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`nav-menu-btn ${
              menu === "contact us" ? "active" : ""
            }`}
            onClick={handleContactUs}
          >
            Contact Us
          </button>
        </li>
      </ul>

      {/* RIGHT SECTION */}
      <div className="navbar-right">
        <button className="nav-icon-btn" title="Search">
          <img src={assets.search_icon} alt="search" />
        </button>

        {/* ✅ Wishlist — no badge number */}
        <Link to="/wishlist" className="nav-icon-btn wishlist-btn-nav" title="My Wishlist">
          <span className="icon-emoji">❤️</span>
        </Link>

        {/* ✅ Cart — badge stays */}
        <Link to="/cart" className="nav-icon-btn cart-btn" title="My Cart">
          <img src={assets.basket_icon} alt="cart" />
          {getCartCount() > 0 && (
            <span className="badge cart-badge">{getCartCount()}</span>
          )}
        </Link>

        {!token ? (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Sign In
          </button>
        ) : (
          <div className="navbar-profile" ref={profileRef}>
            <button
              className="profile-btn"
              onClick={() => setShowProfileDropdown((p) => !p)}
            >
              <div className="user-avatar">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-email">{userEmail}</span>
              </div>
              <span
                className={`dropdown-arrow ${
                  showProfileDropdown ? "open" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showProfileDropdown && (
              <div className="nav-profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-avatar-large">{userInitial}</div>
                  <div>
                    <p className="dropdown-user-name">{userName}</p>
                    <p className="dropdown-user-email">{userEmail}</p>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <ul className="dropdown-menu">
                  <li
                    onClick={() => {
                      navigate("/myorders");
                      setShowProfileDropdown(false);
                    }}
                  >
                    <span className="dropdown-icon">📦</span>
                    <p>My Orders</p>
                  </li>
                  <li
                    onClick={() => {
                      navigate("/wishlist");
                      setShowProfileDropdown(false);
                    }}
                  >
                    <span className="dropdown-icon">❤️</span>
                    <p>Wishlist</p>
                  </li>
                  <li
                    onClick={() => {
                      navigate("/cart");
                      setShowProfileDropdown(false);
                    }}
                  >
                    <span className="dropdown-icon">🛒</span>
                    <p>My Cart</p>
                  </li>
                </ul>

                <div className="dropdown-divider" />

                <ul className="dropdown-menu">
                  <li onClick={handleLogout} className="logout-item">
                    <span className="dropdown-icon">🚪</span>
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* MOBILE HAMBURGER */}
        <button
          className={`hamburger ${showMobileMenu ? "open" : ""}`}
          onClick={() => setShowMobileMenu((m) => !m)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/"
              className={menu === "home" ? "active" : ""}
              onClick={() => {
                setMenu("home");
                setShowMobileMenu(false);
              }}
            >
              🏠 Home
            </Link>
          </li>

          {token && (
            <li>
              <Link
                to="/myorders"
                className={menu === "orders" ? "active" : ""}
                onClick={() => {
                  setMenu("orders");
                  setShowMobileMenu(false);
                }}
              >
                📦 My Orders
              </Link>
            </li>
          )}

          {token && (
            <li>
              <Link
                to="/wishlist"
                className={menu === "wishlist" ? "active" : ""}
                onClick={() => {
                  setMenu("wishlist");
                  setShowMobileMenu(false);
                }}
              >
                ❤️ Wishlist
              </Link>
            </li>
          )}

          <li>
            <button
              type="button"
              className={`mobile-menu-btn ${
                menu === "mobile-App" ? "active" : ""
              }`}
              onClick={handleMobileApp}
            >
              📱 Mobile-App
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`mobile-menu-btn ${
                menu === "contact us" ? "active" : ""
              }`}
              onClick={handleContactUs}
            >
              📞 Contact Us
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
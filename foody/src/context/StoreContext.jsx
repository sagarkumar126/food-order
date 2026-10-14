import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const url = "http://localhost:4000";

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // ✅ Save cart to localStorage
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const fetchFoodList = async () => {
    const res = await axios.get(url + "/api/food/list");
    setFoodList(res.data.data);
  };

  useEffect(() => {
    async function load() {
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("userData");

      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
    load();
  }, []);

  useEffect(() => {
    const fetchCartFromDB = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${url}/api/user/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setCartItems(res.data.cartData || {});
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartFromDB();
  }, [token]);

  // ✅ FIXED: Ab unique products count karega, total quantity nahi
  const getCartCount = () => {
    return Object.keys(cartItems).filter((id) => cartItems[id] > 0).length;
  };

  const getTotalCartAmount = () => {
    let t = 0;
    for (const i in cartItems) {
      if (cartItems[i] > 0) {
        const info = food_list.find((p) => String(p._id) === String(i));
        info && (t += info.price * cartItems[i]);
      }
    }
    return t;
  };

  const syncCartToDB = async (newCart) => {
    if (!token) return;
    try {
      await axios.post(
        `${url}/api/user/cart`,
        { cartData: newCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const addToCart = (id) => {
    const newCart = { ...cartItems, [id]: (cartItems[id] || 0) + 1 };
    setCartItems(newCart);
    syncCartToDB(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = { ...cartItems };
    if (!newCart[id]) return;
    newCart[id]--;
    if (newCart[id] <= 0) delete newCart[id];
    setCartItems(newCart);
    syncCartToDB(newCart);
  };

  const clearCart = async () => {
    setCartItems({});
    localStorage.removeItem("cartItems");

    if (token) {
      try {
        await axios.post(
          `${url}/api/user/cart`,
          { cartData: {} },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    setUser(null);
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    clearCart,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getCartCount,
    url,
    token,
    setToken,
    user,
    setUser,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;





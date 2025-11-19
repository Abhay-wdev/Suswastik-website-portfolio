import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, X, Loader2 } from "lucide-react";
import useCartStore from "../store/useCartStore";
import toast from "react-hot-toast";

const HeaderCart = () => {
  const { cart, fetchCart, removeItem, calculateTotals } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const themeColor = "#943900";

  // ⭐ Fetch cart on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const savedToken = localStorage.getItem("token");

    setUserId(savedUserId);
    setToken(savedToken);

    if (savedUserId && savedToken) {
      fetchCart(savedUserId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchCart]);

  const isLoggedIn = userId && token;

  // ⭐ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Calculate totals
  const totals = calculateTotals();
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition"
      >
        <ShoppingBag size={22} style={{ color: themeColor }} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-50 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="font-semibold text-gray-800">Your Cart</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : !isLoggedIn ? (
            // 🔥 FIXED
            <div className="p-4 text-center text-gray-600">
              <p className="mb-2">Please log in to see your cart.</p>
              <Link
                to="/login"
                className="inline-block text-white px-4 py-2 rounded"
                style={{ backgroundColor: themeColor }}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          ) : cart?.items?.length > 0 ? (
            <>
              {/* Items List */}
              <div className="max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 transition">
                    <img
                      src={item.productSnapshot?.image || "/no-image.png"}
                      alt={item.productSnapshot?.name}
                      className="w-12 h-12 rounded-md border object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {item.productSnapshot?.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ₹{item.productSnapshot?.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-4 py-3 border-t text-sm text-gray-700 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span>Total:</span>
                  <span className="font-semibold">₹ {totals.grandTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between gap-2">
                  <Link to="/cart" onClick={() => setIsOpen(false)} className="flex-1 text-center border rounded-lg py-2 hover:bg-gray-100 transition">
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center text-white rounded-lg py-2"
                    style={{ backgroundColor: themeColor }}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          ) : (
            // Empty Cart
            <div className="p-6 text-center text-gray-500">
              <img src="/images/emptycart.gif" alt="Empty Cart" className="w-24 mx-auto mb-3 opacity-80" />
              <p>Your cart is empty</p>
              <Link to="/products" onClick={() => setIsOpen(false)} className="inline-block mt-3 text-white px-4 py-2 rounded" style={{ backgroundColor: themeColor }}>
                Shop Now
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderCart;

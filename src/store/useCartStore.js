// src/app/store/useCartStore.js
"use client";

import { create } from "zustand";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/cart`;

const useCartStore = create((set, get) => ({
  cart: {
    user: "",
    items: [],
    discount: 0,
    totalPrice: 0,
    grandTotal: 0,
    status: "active",
  },

  loading: false,
  error: null,

  // 🔹 Helper to get token
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  // ============================
  // 🛒 Fetch Cart
  // ============================
  fetchCart: async (userId) => {
    const token = get().getToken();
    if (!token || !userId) return null;

    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_BASE}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ cart: data.cart || get().cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      return null;
    }
  },

  // ============================
  // ➕ Add item
  // ============================
  addItem: async (userId, productId, quantity = 1, variant = {}) => {
    const token = get().getToken();
    if (!token || !userId) throw new Error("Missing authentication");

    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API_BASE}/add`,
        { userId, productId, quantity, variant },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ============================
  // ✏️ Update item
  // ============================
  updateItem: async (userId, productId, quantity) => {
    const token = get().getToken();
    if (!token || !userId) throw new Error("Missing authentication");

    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_BASE}/update`,
        { userId, productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ============================
  // ❌ Remove Item
  // ============================
  removeItem: async (userId, productId) => {
    const token = get().getToken();
    if (!token || !userId) throw new Error("Missing authentication");

    set({ loading: true, error: null });
    try {
      const { data } = await axios.delete(`${API_BASE}/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, productId },
      });

      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ============================
  // 🧹 Clear cart (server)
  // ============================
  clearCart: async (userId) => {
    const token = get().getToken();
    if (!token || !userId) throw new Error("Missing authentication");

    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE}/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        cart: {
          user: "",
          items: [],
          discount: 0,
          totalPrice: 0,
          grandTotal: 0,
          status: "active",
        },
        loading: false,
      });
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ============================
  // 🎟️ Apply coupon
  // ============================
  applyCoupon: async (userId, couponCode) => {
    const token = get().getToken();
    if (!token || !userId) throw new Error("Missing authentication");

    set({ loading: true, error: null });

    try {
      const { data } = await axios.post(
        `${API_BASE}/apply-coupon`,
        { userId, couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ cart: data.cart, loading: false });
      return data.cart;
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  // ============================
  // 🧮 Totals (FINAL FIX)
  // ============================
  calculateTotals: () => {
    const { cart } = get();

    return {
      totalPrice: Number(cart.totalPrice || 0),
      discount: Number(cart.discount || 0),
      grandTotal: Number(cart.grandTotal || 0),
    };
  },
}));

export default useCartStore;

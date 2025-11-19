import { create } from "zustand";
import axios from "axios";

// Base URL for backend (Vite environment)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance INSIDE the store (no external import)
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

// Auto attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


export const useAuthStore = create((set, get) => ({

  user: null,
  token: null,
  users: [],
  message: "",
  loading: false,
  error: "",
  step: 1,

  // =========================================================
  // LOGIN
  // =========================================================
  login: async (form, router) => {
    try {
      set({ loading: true, error: "", message: "" });

      const res = await api.post(`/user/login`, form);

      const { success, user, token, message } = res.data;

      if (!success) {
        set({ loading: false, error: message || "Login failed" });
        return { success: false, message };
      }

      // Save
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      // Redirect
      if (router) {
        if (user.role === "admin") router("/admin");
        else router("/");
      }

      set({ loading: false, user, token, message: message || "Login success" });
      return { success: true, user, token };

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================
  // LOGOUT
  // =========================================================
logout: (router) => {
  // Remove all localStorage keys
  const removeKeys = ["token", "user", "userId", "shippingAddressId"];
  removeKeys.forEach((key) => localStorage.removeItem(key));

  // Reset auth store
  set({
    user: null,
    token: null,
    message: "Logged out successfully",
  });

  // 🔥 RESET CART STORE DIRECTLY (best & safest)
  import("./useCartStore").then((module) => {
    const cartStore = module.default;
    cartStore.setState({
      cart: {
        user: "",
        items: [],
        discount: 0,
        totalPrice: 0,
        grandTotal: 0,
        status: "active",
      },
    });
  });

  // Redirect
  if (router && typeof router.push === "function") {
    router.push("/login");
  }
},


  // =========================================================
  // SEND OTP FOR SIGNUP
  // =========================================================
  sendOtp: async (email) => {
    try {
      set({ loading: true, message: "" });

      const res = await api.post(`/auth/send-otp`, { email });

      if (res.data.success) {
        set({ step: 2, message: res.data.message });
      } else {
        set({ message: res.data.message });
      }

    } catch (err) {
      set({ message: err.response?.data?.message || "Error sending OTP" });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // VERIFY OTP
  // =========================================================
  verifyOtp: async (data, router) => {
    try {
      set({ loading: true });

      const res = await api.post(`/auth/verify-otp`, data);

      if (res.data.success) {
        const { user, message } = res.data;

        localStorage.setItem("user", JSON.stringify(user));

        set({ user, step: 1, message });

        setTimeout(() => router("/login"), 1500);
      } else {
        set({ message: res.data.message });
      }

    } catch (err) {
      set({ message: err.response?.data?.message || "OTP verification failed" });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // FORGOT PASSWORD OTP
  // =========================================================
  sendForgotPasswordOtp: async (email) => {
    try {
      set({ loading: true });

      const res = await api.post(`/auth/send-forgot-password-otp`, { email });

      if (res.data.success) {
        set({ step: 2, message: res.data.message });
      } else {
        set({ message: res.data.message });
      }

    } catch (err) {
      set({ message: err.response?.data?.message || "Error sending OTP" });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // RESET PASSWORD
  // =========================================================
  resetPassword: async (data, router) => {
    try {
      set({ loading: true });

      const res = await api.post(`/auth/reset-password`, data);

      if (res.data.success) {
        set({ step: 1, message: res.data.message });
        setTimeout(() => router("/login"), 1500);
      } else {
        set({ message: res.data.message });
      }

    } catch (err) {
      set({ message: err.response?.data?.message || "Reset failed" });
    } finally {
      set({ loading: false });
    }
  },

  // =========================================================
  // USER MANAGEMENT
  // =========================================================
  getUserById: async (userId) => {
    try {
      set({ loading: true });

      const res = await api.get(`/user/${userId}`);

      set({ user: res.data.user });

    } catch (err) {
      set({ message: err.response?.data?.message || "User not found" });
    } finally {
      set({ loading: false });
    }
  },
 updateUser: async (userId, updatedData, file = null) => {
    try {
      set({ loading: true, message: "", error: "" });

      const token = get().token || localStorage.getItem("token");

      const formData = new FormData();
      Object.entries(updatedData).forEach(([k, v]) =>
        formData.append(k, v)
      );
      if (file) formData.append("image", file);

      const res = await api.put(
        `${BASE_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        set({
          user: updatedUser,
          message: "Profile updated successfully!",
          error: "",
        });
      } else {
        set({ error: res.data.message || "Update failed" });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import axios from "axios";

/* =========================================================
   AXIOS SETUP
========================================================= */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

/* =========================================================
   AUTH STORE
========================================================= */
export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  users: [],
  message: "",
  loading: false,
  error: "",
  step: 1,

  /* ================= UTILITIES ================= */
  setMessage: (msg) => set({ message: msg }),
  goToStep: (step) => set({ step }),

  /* =========================================================
     LOGIN
  ========================================================= */
  login: async (form, navigate) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await api.post("/user/login", form);
      const { success, user, token, message } = res.data;

      if (!success) {
        set({ error: message || "Login failed" });
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      set({
        user,
        token,
        message: message || "Login successful",
      });

      if (navigate) {
        user.role === "admin" ? navigate("/admin") : navigate("/");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     LOGOUT
  ========================================================= */
  logout: (navigate) => {
    ["token", "user", "userId", "shippingAddressId"].forEach((k) =>
      localStorage.removeItem(k)
    );

    set({
      user: null,
      token: null,
      message: "Logged out successfully",
    });

    // Reset cart store safely
    import("./useCartStore").then((module) => {
      module.default.setState({
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

    if (navigate) navigate("/login");
  },

  /* =========================================================
     SEND OTP (SIGNUP)
  ========================================================= */
  sendOtp: async (email) => {
    try {
      set({ loading: true, message: "" });

      const res = await api.post("/auth/send-otp", { email });

      if (res.data.success) {
        set({
          step: 2,
          message: res.data.message || "OTP sent successfully",
        });
      } else {
        set({ message: res.data.message || "Failed to send OTP" });
      }
    } catch (err) {
      set({
        message: err.response?.data?.message || "Error sending OTP",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     VERIFY OTP & REGISTER
  ========================================================= */
  verifyOtp: async (data, navigate) => {
    try {
      set({ loading: true, message: "" });

      const res = await api.post("/auth/verify-otp", data);

      if (res.data.success) {
        const { user, message } = res.data;

        localStorage.setItem("user", JSON.stringify(user));

        set({
          user,
          step: 1,
          message: message || "Registration successful",
        });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        set({ message: res.data.message || "Verification failed" });
      }
    } catch (err) {
      set({
        message: err.response?.data?.message || "OTP verification failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     FORGOT PASSWORD OTP
  ========================================================= */
  sendForgotPasswordOtp: async (email) => {
    try {
      set({ loading: true, message: "" });

      const res = await api.post("/auth/forgot-password", { email });

      if (res.data.success) {
        set({
          step: 2,
          message: res.data.message || "OTP sent",
        });
      } else {
        set({ message: res.data.message });
      }
    } catch (err) {
      set({
        message: err.response?.data?.message || "Error sending OTP",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     RESET PASSWORD
  ========================================================= */
  resetPassword: async (data, navigate) => {
    try {
      set({ loading: true, message: "" });

      const res = await api.post("/auth/reset-password", data);

      if (res.data.success) {
        set({
          step: 1,
          message: res.data.message || "Password reset successful",
        });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        set({ message: res.data.message });
      }
    } catch (err) {
      set({
        message: err.response?.data?.message || "Reset failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     GET USER BY ID
  ========================================================= */
  getUserById: async (userId) => {
    try {
      set({ loading: true });

      const res = await api.get(`/user/${userId}`);
      set({ user: res.data.user });
    } catch (err) {
      set({
        message: err.response?.data?.message || "User not found",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     UPDATE USER PROFILE
  ========================================================= */
  updateUser: async (userId, updatedData, file = null) => {
    try {
      set({ loading: true, message: "", error: "" });

      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (file) formData.append("image", file);

      const res = await api.put(`/user/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        set({
          user: res.data.user,
          message: "Profile updated successfully",
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

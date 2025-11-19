import { create } from "zustand";
import toast from "react-hot-toast";

export const useOrderStore = create((set, get) => ({
  orders: [],
  userOrders: [],
  singleOrder: null,
  loading: false,

  // 🟢 PLACE NEW ORDER
  placeOrder: async (userId, addressId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, addressId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        return data.order;
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("❌ placeOrder Error:", error);
      toast.error("Error placing order");
    } finally {
      set({ loading: false });
    }
  },

  // 🟡 GET ALL ORDERS (Admin)
  fetchAllOrders: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        set({ orders: data.orders });
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("❌ fetchAllOrders Error:", error);
      toast.error("Error fetching orders");
    } finally {
      set({ loading: false });
    }
  },

  // 🟠 GET USER ORDERS
  fetchUserOrders: async (userId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        set({ userOrders: data.orders });
      } else {
        toast.error(data.message || "Failed to fetch user orders");
      }
    } catch (error) {
      console.error("❌ fetchUserOrders Error:", error);
      toast.error("Error fetching user orders");
    } finally {
      set({ loading: false });
    }
  },

  // 🔵 GET SINGLE ORDER
  fetchOrderById: async (orderId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        set({ singleOrder: data.order });
      } else {
        toast.error(data.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error("❌ fetchOrderById Error:", error);
      toast.error("Error fetching order details");
    } finally {
      set({ loading: false });
    }
  },

  // 🟣 UPDATE ORDER (Admin)
  updateOrder: async (orderId, updates) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order updated successfully!");
        await get().fetchAllOrders();
      } else {
        toast.error(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("❌ updateOrder Error:", error);
      toast.error("Error updating order");
    } finally {
      set({ loading: false });
    }
  },

  // 🔴 DELETE ORDER (Admin)
  deleteOrder: async (orderId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted successfully!");
        set((state) => ({
          orders: state.orders.filter((order) => order._id !== orderId),
        }));
      } else {
        toast.error(data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("❌ deleteOrder Error:", error);
      toast.error("Error deleting order");
    } finally {
      set({ loading: false });
    }
  },

  // 🧾 GENERATE INVOICE (NEW)
  generateInvoice: async (orderId) => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orders/invoice/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to generate invoice");

      // 🧾 If server returns a file (PDF or blob)
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      link.click();
      toast.success("Invoice generated successfully!");
    } catch (error) {
      console.error("❌ generateInvoice Error:", error);
      toast.error("Error generating invoice");
    } finally {
      set({ loading: false });
    }
  },
}));

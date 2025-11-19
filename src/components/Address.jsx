import React, { useEffect, useState } from "react";
import { useShippingAddressStore } from "../store/shippingAddressStore";
import { useAuthStore } from "../store/UserStore";

const ShippingAddressManager = () => {
  const {
    addresses,
    loading,
    message,
    error,
    createAddress,
    getUserAddresses,
    updateAddress,
    deleteAddress,
    clearMessages,
  } = useShippingAddressStore();

  const { user } = useAuthStore();

  const initialForm = {
    fullName: "",
    phone: "",
    House_Number: "",
    street: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    label: "Home",
    message: "",
    isDefault: false,
    paymentMethod: "COD",
  };

  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Theme colors
  const themeColor = "#943900";
  const themeLight = "#c46e00"; // Lighter shade for hover states
  const themeBackground = "#f5e6d0"; // Light background for active states

  useEffect(() => {
    if (user?._id) getUserAddresses(user._id);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return alert("User not logged in");

    // Prevent creating new address if one already exists
    if (!isEditing && addresses.length > 0) {
      alert("You already have a shipping address. Please edit the existing one.");
      return;
    }

    if (isEditing && editId) {
      await updateAddress(editId, formData);
      setIsEditing(false);
      setEditId(null);
    } else {
      await createAddress({ ...formData, user: user._id });
    }

    setFormData(initialForm);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setIsEditing(true);
    setEditId(addr._id);
    setFormData({ ...addr });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(initialForm);
    setShowForm(false);
  };

  // Helper function to get payment method icon
  const getPaymentIcon = (method) => {
    switch (method) {
      case "COD":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case "Online":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case "Card":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "UPI":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "NetBanking":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
    }
  };

  // Helper function to get payment method display name
  const getPaymentDisplayName = (method) => {
    switch (method) {
      case "COD": return "Cash on Delivery";
      case "Online": return "Online Payment";
      case "Card": return "Credit/Debit Card";
      case "UPI": return "UPI";
      case "NetBanking": return "Net Banking";
      default: return method;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(to bottom right, #fdf8f3, #f9f3ed)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: themeColor }}>
            Shipping Address
          </h1>
          <p className="text-gray-600">Manage your delivery location and payment method</p>
        </div>

        {/* Alert Messages */}
        {message && (
          <div className="mb-6 p-4 rounded-lg relative animate-in fade-in slide-in-from-top-4 duration-300" style={{ backgroundColor: themeBackground, border: `1px solid ${themeColor}` }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: themeColor }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="flex-1" style={{ color: themeColor }}>{message}</span>
            </div>
            <button
              onClick={() => clearMessages()}
              className="absolute top-3 right-3 transition-colors"
              style={{ color: themeColor }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 relative animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
            <button
              onClick={() => clearMessages()}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Add New Address Button - Only show if no address exists */}
        {!showForm && addresses.length === 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: themeColor,
              color: "white",
              boxShadow: `0 4px 14px 0 ${themeColor}40`,
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Shipping Address
          </button>
        )}

        {/* Address Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-8 duration-300">
            <div className="px-6 py-4" style={{ background: `linear-gradient(to right, ${themeColor}, ${themeLight})` }}>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                </svg>
                {isEditing ? "Edit Address" : "Add Shipping Address"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">House Number *</label>
                  <input
                    type="text"
                    name="House_Number"
                    value={formData.House_Number}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Street *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Main Street"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near City Mall"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Label</label>
                  <select
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none bg-white"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Enhanced Payment Method Field */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {["COD", "Online", "Card", "UPI", "NetBanking"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: method})}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                          formData.paymentMethod === method
                            ? ""
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{
                          borderColor: formData.paymentMethod === method ? themeColor : "",
                          backgroundColor: formData.paymentMethod === method ? themeBackground : "",
                        }}
                      >
                        <div className={`mb-1 ${
                          formData.paymentMethod === method ? "" : "text-gray-500"
                        }`} style={{ color: formData.paymentMethod === method ? themeColor : "" }}>
                          {getPaymentIcon(method)}
                        </div>
                        <span className={`text-xs font-medium ${
                          formData.paymentMethod === method ? "" : "text-gray-700"
                        }`} style={{ color: formData.paymentMethod === method ? themeColor : "" }}>
                          {getPaymentDisplayName(method)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Delivery Instructions</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any special delivery instructions..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:border-transparent transition-all outline-none resize-none"
                    style={{ 
                      borderColor: themeColor,
                      focusRing: themeColor,
                    }}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors" style={{ peerChecked: `backgroundColor: ${themeColor}` }}></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Set as Default Address</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ 
                    backgroundColor: themeColor,
                    color: "white",
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isEditing ? "Update Address" : "Save Address"}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {loading && addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" style={{ color: themeColor }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 font-medium">Loading address...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No shipping address yet</h3>
            <p className="text-gray-500 mb-6">Add your shipping address to get started</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2"
                style={{ 
                  backgroundColor: themeColor,
                  color: "white",
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Address
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((a) => (
              <div
                key={a._id}
                className={`bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  a.isDefault ? "" : "border-gray-200"
                }`}
                style={{ borderColor: a.isDefault ? themeColor : "" }}
              >
                {a.isDefault && (
                  <div className="px-4 py-2 flex items-center gap-2" style={{ background: `linear-gradient(to right, ${themeColor}, ${themeLight})` }}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-white">Default Address</span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{a.fullName}</p>
                          <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {a.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-700 leading-relaxed">
                          {a.House_Number}, {a.street}
                          {a.addressLine2 && <>, {a.addressLine2}</>}
                          {a.landmark && <>, {a.landmark}</>}
                          <br />
                          {a.city}, {a.state} - {a.postalCode}
                          <br />
                          {a.country}
                        </p>
                      </div>
                      
                      {/* Enhanced Payment Method Display */}
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0" style={{ color: themeColor }}>
                          {getPaymentIcon(a.paymentMethod)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Payment Method</p>
                          <p className="text-gray-700 font-medium">{getPaymentDisplayName(a.paymentMethod)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {a.label && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: themeBackground, color: themeColor }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {a.label}
                          </span>
                        )}
                        
                        {a.message && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium max-w-xs truncate" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {a.message}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 md:items-end">
                      {/* Only show Edit button, remove Delete button */}
                      <button
                        onClick={() => handleEdit(a)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                        style={{ 
                          backgroundColor: themeBackground,
                          color: themeColor,
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Address & Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressManager;
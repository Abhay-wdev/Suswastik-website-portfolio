import React from "react";
import ShippingAddressManager from "../components/Address";
import Cart from "./Cart";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Section - Shipping Address */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl text-center font-semibold mb-4 text-gray-800">
            Shipping Details
          </h2>
          <ShippingAddressManager />
        </div>

        {/* Right Section - Cart Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl text-center font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <Cart />
        </div>

      </div>
    </div>
  );
}

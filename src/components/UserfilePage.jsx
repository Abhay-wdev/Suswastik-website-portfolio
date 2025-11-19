import React, { useState } from "react";
import { FaBars, FaCog } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import ProfilePage from "../components/ProfilePage";
 
import ShippingAddressManager from "../components/Address";
import Cart from "../components/Cart";
import OrdersPageWrapper from "./OrdersPage";

export default function UserfilePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true by default
  const [activeTab, setActiveTab] = useState("Profile");

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfilePage />;
      case "Address":
        return <ShippingAddressManager />;
      case "Cart":
        return <Cart />;
      case "Order history":
        return <OrdersPageWrapper />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile top navigation */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
         
          <span className="font-semibold">Your's</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
           <FaCog className="text-xl" />
          </button>
          
        </div>
      </div>

      {/* Sidebar - always visible on desktop, toggleable on mobile */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
        <Sidebar
          open={sidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setSidebarOpen={setSidebarOpen}
          onSelect={setActiveTab}
          activeLabel={activeTab}
        />
      </div>

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in overflow-hidden ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <main className="flex-1 p-4 overflow-y-auto hide-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
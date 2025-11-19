import { useState, useEffect } from "react";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { LuComponent } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { FaLocationArrow } from "react-icons/fa";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { MdWorkHistory } from "react-icons/md";

export default function Sidebar({ open, collapsed, setCollapsed, setSidebarOpen, onSelect, activeLabel }) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Force expanded state on mobile - never collapse on small screens
  const effectiveCollapsed = isMobile ? false : collapsed;

  const navItems = [
    { label: "Profile", icon: <CgProfile className="text-xl" /> },
    { label: "Address", icon: <FaLocationArrow className="text-xl" /> },
    { label: "Cart", icon: <MdOutlineShoppingCartCheckout className="text-xl" /> },
    { label: "Order history", icon: <MdWorkHistory className="text-xl" /> },
    // Add more items here
  ];

  // Theme colors
  const themeColor = "#943900";
  const themeLight = "#f9f3ed"; // Light version of theme color for hover
  const themeActive = "#f5e6d0"; // Light background for active state

  return (
    <div
      className={`h-full transition-all duration-300 ease-in-out
        ${effectiveCollapsed ? "w-16 md:w-20" : "w-full md:w-64"}
        shadow-lg overflow-y-auto bg-white`}
    >
      

     

      {/* Collapse button for desktop */}
      <div className="hidden md:flex justify-end mt-2 px-4 pb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaChevronLeft
            className={`cursor-pointer transition-transform duration-300 ${
              effectiveCollapsed ? "rotate-180" : ""
            }`}
            style={{ color: themeColor }}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-2 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeLabel === item.label;
            return (
              <li key={item.label}>
                <button
                  onClick={() => {
                    onSelect(item.label);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center gap-3 p-4 md:p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "font-medium" 
                      : "text-gray-700"
                  }`}
                  style={{
                    backgroundColor: isActive ? themeActive : "transparent",
                    color: isActive ? themeColor : "inherit"
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center ${
                      effectiveCollapsed ? "mx-auto" : ""
                    }`}
                    style={{ color: isActive ? themeColor : "inherit" }}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  {!effectiveCollapsed && (
                    <span className="text-base md:text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
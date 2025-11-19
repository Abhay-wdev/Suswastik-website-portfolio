import React, { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import UserDropdown from "../components/UserDropdown";
import ProfileIcon from "../../components/ProfileIcon";

const Header = ({ setSidebarOpen }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userRef = useRef();

  const getTitle = (path) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/services": return "Services";
      case "/category": return "Category";
      case "/template": return "Template";
      case "/profile": return "My Profile";
      case "/request": return "Requests";
      case "/combo": return "Combo";
      case "/users": return "Users";
      default: return "Admin Panel";
    }
  };

  const title = getTitle(pathname);

  const handleClickOutside = (e) => {
    if (userRef.current && !userRef.current.contains(e.target)) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
  };

  return (
    <header className="t-0 h-20 z-50 px-4 flex items-center justify-between backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      {/* Left Side: Menu Icon + Title */}
      <div className="flex items-center gap-4">
        <FaBars
          className="text-xl cursor-pointer md:hidden hover:text-primary transition"
          onClick={() => setSidebarOpen(true)}
        />
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Right Side: User */}
      <div className="flex items-center gap-4 relative" ref={userRef}>
        <div className="relative">
          <button onClick={toggleUserMenu}>
            <ProfileIcon />
          </button>

          {showUserMenu && (
            <UserDropdown onClose={() => setShowUserMenu(false)} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
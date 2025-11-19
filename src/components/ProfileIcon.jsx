import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UserStore";

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // ⭐ Zustand Store Methods
  const logout = useAuthStore((state) => state.logout);
  const getUserById = useAuthStore((state) => state.getUserById);
  const user = useAuthStore((state) => state.user);

  // 🔥 Load user from localStorage only once
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?._id) getUserById(parsed._id);
      } catch (err) {
        console.error("Invalid user in localStorage:", err);
      }
    }
  }, [getUserById]);

  // ❌ Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-close on mouse leave
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 500);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // 🎯 LOGOUT HANDLER
  const handleLogout = () => {
    logout({ push: navigate });  // <- pass router-like object
    setIsOpen(false);
  };

  // Generate initials if no image
  const getInitials = (name = "") => {
    if (!name.trim()) return "U"; // fallback for undefined name
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 
        hover:ring-2 hover:ring-indigo-400 transition-all bg-white overflow-hidden"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm">
            {getInitials(user?.name)}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg z-50">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;

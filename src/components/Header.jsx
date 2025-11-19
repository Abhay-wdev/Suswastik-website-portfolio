import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import LoginSignupButton from "./LoginSignupButton";
import HeaderCart from "./HeaderCart";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const location = useLocation();
  const mobileMenuRef = useRef(null);

  // =========================
  // STATIC MENU ITEMS
  // =========================
  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "About", href: "/about-us" },
    { title: "Contact", href: "/contact-us" },
    { title: "Blogs", href: "/blogs" },
  ];

  // =========================
  // MOUNT & INITIAL LOGIN CHECK
  // =========================
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // =========================
  // CHECK LOGIN ON ROUTE CHANGE
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // =========================
  // 🔄 AUTO CHECK LOGIN EVERY 2 SECONDS
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // CLICK OUTSIDE TO CLOSE MOBILE MENU
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Disable body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  const handleMobileMenuClose = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  // PREVENTS HYDRATION FLASH
  if (!isMounted) {
    return <div className="h-16 bg-white shadow" />;
  }

  return (
    <>
      {/* HEADER NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-20 relative">

            {/* LOGO */}
            <div className="flex sm:justify-center justify-start flex-1">
              <Link to="/" className="flex items-center">
                <img
                  src="/images/logo.webp"
                  alt="Logo"
                  className="h-14 md:h-20"
                />
              </Link>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center space-x-6 absolute left-0">
              {menuItems.map((item) => (
                <div key={item.title} className="relative group">
                  <Link
                    to={item.href}
                    className={`flex items-center font-medium transition-colors duration-200 ${
                      location.pathname === item.href
                        ? "text-green-500"
                        : "text-gray-700 hover:text-green-500"
                    }`}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE – CART + LOGIN/PROFILE */}
            <div className="hidden lg:flex items-center gap-5 absolute right-0">
              <Link to="/distributor">
                <div className="font-bold px-4 py-3 text-gray-600 hover:text-green-500">
                  Become a Partner
                </div>
              </Link>

              <HeaderCart />

              {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}
            </div>

            {/* MOBILE BUTTONS */}
            <div className="lg:hidden flex items-center gap-3 ml-auto">
              {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 p-2"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            style={{ top: "80px" }}
            onClick={handleMobileMenuClose}
          />

          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed left-0 right-0 bg-white shadow-2xl z-50"
            style={{ top: "80px", maxHeight: "calc(100vh - 80px)" }}
          >
            <div className="overflow-y-auto max-h-[calc(100vh-80px)] py-4 px-4">
              {menuItems.map((item) => (
                <div key={item.title} className="border-b border-gray-100">
                  <Link
                    to={item.href}
                    onClick={handleMobileMenuClose}
                    className={`block py-4 font-medium ${
                      location.pathname === item.href
                        ? "text-green-500"
                        : "text-gray-700 hover:text-green-500"
                    }`}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import LoginSignupButton from "./LoginSignupButton";
import HeaderCart from "./HeaderCart";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const location = useLocation();
  const mobileMenuRef = useRef(null);

  /* =========================
     MENU ITEMS (INTERNAL)
  ========================= */
  const menuItems = [
    { title: "Home", to: "/" },
    { title: "Products", to: "/products" },
    { title: "About", to: "/about-us" },
    { title: "Contact", to: "/contact-us" },
    { title: "Blogs", to: "/blogs" },
  ];

  /* =========================
     MOUNT & LOGIN CHECK
  ========================= */
  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]);

  /* =========================
     CLICK OUTSIDE – MOBILE
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /* =========================
     BODY SCROLL LOCK
  ========================= */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isMounted) return <div className="h-20 bg-white shadow" />;

  return (
    <>
      {/* HEADER */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20 relative">

            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo.webp"
                alt="Suswastik Logo"
                className="h-14 md:h-20"
              />
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className={`font-medium transition-colors ${
                    location.pathname === item.to
                      ? "text-green-500"
                      : "text-gray-700 hover:text-green-500"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex items-center gap-5">
              <Link
                to="/distributor"
                className="font-semibold text-gray-600 hover:text-green-500"
              >
                Become a Partner
              </Link>

              <HeaderCart />
              {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}
            </div>

            {/* MOBILE BUTTON */}
            <div className="lg:hidden flex items-center gap-3">
              {isLoggedIn ? <ProfileIcon /> : <LoginSignupButton />}

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700"
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
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={mobileMenuRef}
            className="fixed top-20 left-0 right-0 bg-white z-50 shadow-xl lg:hidden"
          >
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-4 border-b font-medium ${
                  location.pathname === item.to
                    ? "text-green-500"
                    : "text-gray-700 hover:text-green-500"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Header;

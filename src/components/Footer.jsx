import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Instagram, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/?limit=100`
        );
        const data = await res.json();

        const grouped = {};
        data.products.forEach((product) => {
          const subCatName = product.subCategory?.name || "Others";
          if (!grouped[subCatName]) grouped[subCatName] = [];
        });

        const menu = Object.keys(grouped).map((name) => ({
          name,
          to: `/products?subCategory=${encodeURIComponent(name.toLowerCase())}`,
        }));

        setSubCategories(menu);
      } catch (err) {
        console.error("Footer fetch error:", err);
      }
    };

    fetchProducts();
  }, []);

  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "Contact Us", to: "/contact-us" },
    { name: "About Us", to: "/about-us" },
    { name: "Blog", to: "/blogs" },
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Cancellations Policy", to: "/cancellations-policy" },
    { name: "Refund Policy", to: "/refund-policy" },
  ];

  return (
    <footer className="bg-[#c05300] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div className="space-y-6">
            <img
              src="/images/logo.webp"
              alt="Suswastik Logo"
              className="h-20 bg-amber-50 rounded-2xl"
            />

            <p className="text-sm">
              स्वाद से बढ़कर कुछ नहीं — Bringing authentic Indian flavors to your kitchen.
            </p>

            <div className="flex items-center space-x-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/_suswastik/"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="w-5 h-5 hover:text-white" />
              </a>

              {/* Amazon */}
              <a
                href="https://www.amazon.in/l/27943762031?me=A2W6NPLCNAU8Z3"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/amazon.webp"
                  alt="Amazon"
                  className="w-20 h-10"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-white flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Product Categories
            </h3>
            <ul className="space-y-4">
              {subCategories.length ? (
                subCategories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      to={cat.to}
                      className="text-sm hover:text-white flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-300">Loading...</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">
              <p className="flex">
                <MapPin className="w-5 h-5 mr-2" />
                Jaipur, Rajasthan – 302029
              </p>

              <p className="flex">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+919414446467">+91 9414446467</a>
              </p>

              <p className="flex">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:Suswastikspices@gmail.com">
                  Suswastikspices@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t text-center text-sm">
          © {currentYear} Developed by{" "}
          <a
            href="https://viralnexus.in/"
            target="_blank"
            rel="noreferrer"
            className="text-green-100 hover:font-bold"
          >
            VIRAL Nexus
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

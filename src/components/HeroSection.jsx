import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const HeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // For Vite, environment variables are accessed with VITE_ prefix
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  const HERO_IMAGES_ENDPOINT = `${API_BASE_URL}/hero`;

  // Fetch images
  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(HERO_IMAGES_ENDPOINT);
      localStorage.setItem(
        "heroImages",
        JSON.stringify({ data, savedAt: Date.now() })
      );
      setHeroImages(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch hero images");
    } finally {
      setLoading(false);
    }
  };

  // Load from cache or API
  useEffect(() => {
    const cached = localStorage.getItem("heroImages");
    const tenMinutes = 10 * 60 * 1000;

    if (cached) {
      const parsed = JSON.parse(cached);
      const isExpired = Date.now() - parsed.savedAt > tenMinutes;

      if (!isExpired && parsed.data?.length) {
        setHeroImages(parsed.data);
        setLoading(false);
        return;
      } else {
        localStorage.removeItem("heroImages");
      }
    }

    fetchHeroImages();
  }, []);

  // Auto-slide every 5s
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i === heroImages.length - 1 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages]);

  // Swipe controls
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 40) goToNext();
    if (delta < -40) goToPrev();
  };

  const goToPrev = () =>
    setCurrentIndex((i) => (i === 0 ? heroImages.length - 1 : i - 1));
  const goToNext = () =>
    setCurrentIndex((i) => (i === heroImages.length - 1 ? 0 : i + 1));
  const goToSlide = (i) => setCurrentIndex(i);

  // Loading & Error States
  if (loading) {
    return (
      <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-96 bg-red-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!heroImages.length) {
    return (
      <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No hero images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-96 md:h-[500px] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {/* SLIDER TRACK */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroImages.map((image) => (
          <Link
            key={image._id}
            to={image.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full flex-shrink-0"
          >
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={image.desktopImageUrl}
              />
              <img
                src={image.mobileImageUrl || image.desktopImageUrl}
                alt={image.alt || "Hero slide"}
                className="w-full h-full object-cover"
                draggable="false"
              />
            </picture>
          </Link>
        ))}
      </div>

      {/* DESKTOP/TABLET ARROWS (HIDDEN ON SMALL SCREENS) */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-green-600/80 hover:bg-green-700 text-white p-4 rounded-full transition-all shadow-md active:scale-95"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-green-600/80 hover:bg-green-700 text-white p-4 rounded-full transition-all shadow-md active:scale-95"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* DOTS */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                i === currentIndex ? "bg-green-600" : "bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
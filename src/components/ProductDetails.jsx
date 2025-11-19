import React, { useState, useEffect } from "react";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Package, 
  Globe, 
  Clock, 
  AlertTriangle,
  ChevronLeft,
  Share2,
  MapPin,
  Truck,
  Gift,
  Award,
  CheckCircle,
  Sparkles,
  HelpCircle,
  Weight,
  Plus,
  Minus
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useCartStore from "../store/useCartStore";
import CategoryMore from "./CategoryMore";
import ProductMore from "./CategoryMore";

const ProductDetails = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [updatingCart, setUpdatingCart] = useState(false);
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const [isInCartState, setIsInCartState] = useState(false); // New state to track cart status
  
  const { cart, addItem, updateItem, removeItem, fetchCart, loading: cartLoading } = useCartStore();
  
  // User credentials - should be replaced with actual authentication
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Check if product is in cart
  const isInCart = (productId) =>
    cart?.items?.some((item) => item.product._id === productId);

  // Fetch cart on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      if (!token) return; // Don't fetch cart if not logged in
      
      try {
        await fetchCart(userId, token);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        toast.error("Failed to fetch cart");
      }
    };
    
    fetchCartData();
  }, [fetchCart, userId, token]);

  // Update UI when cart changes
  useEffect(() => {
    if (product && token) { // Only update if logged in
      const cartItem = cart?.items?.find((item) => item.product._id === product._id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
        setShowQuantityControls(true);
        setIsInCartState(true); // Set cart status
      } else {
        setShowQuantityControls(false);
        setQuantity(1);
        setIsInCartState(false); // Set cart status
      }
    }
  }, [cart, product, token]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-orange-100">
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or is unavailable.</p>
          <Link to="/products" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Corrected price calculation: price - discount
  const discountAmount = product.discount ? (product.price * product.discount) / 100 : 0;
  const discountedPrice = product.price - discountAmount;

  // Function to render star ratings
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryInfo({
        available: true,
        message: "Delivery available by tomorrow",
        charge: "Free delivery"
      });
    } else {
      setDeliveryInfo({
        available: false,
        message: "Enter a valid pincode",
        charge: ""
      });
    }
  };

  // Cart functionality
  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if user is logged in
    if (!token) {
      toast.error("Please login first");
      return;
    }
    
    setUpdatingCart(true);
    try {
      await addItem(userId, product._id, quantity, {}, token);
      toast.success(`${product.name} added to cart!`);
      setShowQuantityControls(true);
      setIsInCartState(true); // Update cart status
      await fetchCart(userId, token);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    } finally {
      setUpdatingCart(false);
    }
  };

  const handleQuantityChange = async (delta) => {
    if (!product) return;
    
    const newQty = quantity + delta;
    if (newQty < 1) return;

    setQuantity(newQty);
    setUpdatingCart(true);

    try {
      await updateItem(userId, product._id, newQty, token);
      toast.success("Quantity updated!");
      await fetchCart(userId, token);
    } catch (err) {
      setQuantity(quantity); // Revert on error
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!product) return;
    
    setUpdatingCart(true);
    try {
      await removeItem(userId, product._id, token);
      setShowQuantityControls(false);
      setIsInCartState(false); // Update cart status
      setQuantity(1);
      toast.success("Item removed from cart");
      await fetchCart(userId, token);
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setUpdatingCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.category?.slug}`} className="hover:text-orange-600">{product.category?.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-inner">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-16 h-16" />
                  </div>
                )}
                
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full shadow-lg font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {product.discount}% OFF
                  </div>
                )}
                
                {product.isVegetarian && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    100% Vegetarian
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto py-2 px-1">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index 
                          ? "border-orange-500 scale-105 shadow-md" 
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Festive badge */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 text-center border border-amber-200">
                <div className="flex items-center justify-center gap-2 text-amber-800">
                  <Gift className="w-5 h-5" />
                  <span className="font-medium">Perfect Gift Option</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-600">{product.brand}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{product.category?.name}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{product.subCategory?.name}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const shareData = {
                          title: product.name || "Check this product!",
                          text: product.shortDescription || "Found something interesting on our store!",
                          url: window.location.href,
                        };

                        if (navigator.share) {
                          navigator.share(shareData)
                            .then(() => console.log("✅ Shared successfully"))
                            .catch((error) => console.error("❌ Share failed:", error));
                        } else {
                          // Fallback: copy URL to clipboard
                          navigator.clipboard.writeText(window.location.href);
                          alert("🔗 Product link copied to clipboard!");
                        }
                      }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition-all shadow-sm"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  {renderRating(product.ratings?.averageRating || 4.5)}
                  <span className="ml-2 text-sm text-gray-500">({product.ratings?.totalReviews || 0} reviews)</span>
                </div>
              </div>

              <div className="py-4 border-y border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">₹{Math.round(discountedPrice).toLocaleString()}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm font-medium bg-red-100 text-red-700 px-2 py-1 rounded">
                        Save ₹{Math.round(discountAmount)}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="mt-3 flex items-center text-sm">
                  <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                    product.availabilityStatus === "In Stock" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                    {product.availabilityStatus}
                  </span>
                  {product.availabeQuantity > 0 && (
                    <span className="ml-2 text-gray-600">Only {product.availabeQuantity} left</span>
                  )}
                </div>
              </div>

              {/* Added Weight Display */}
              {product.weight && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Weight className="w-4 h-4 text-orange-500" />
                      Weight <p className="text-gray-700">{product.weight}</p>
                  </h3>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.description || "No description available."}</p>
              </div>

              {product.shortdescription && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Highlights
                  </h3>
                  <p className="text-gray-700">{product.shortdescription}</p>
                </div>
              )}

              <div className="flex flex-col max-w-sm sm:flex-row gap-3 pt-2">
                {/* Use isInCartState instead of showQuantityControls to determine button state */}
                {isInCartState ? (
                  <div className="flex-1 flex gap-3">
                    <div className="flex items-center border-2 border-orange-200 rounded-xl overflow-hidden flex-1">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={updatingCart}
                        className="px-4 py-3 bg-orange-50 rounded-2xl cursor-pointer hover:bg-orange-100 transition disabled:opacity-50 flex-1"
                      >
                        <Minus className="w-5 h-5 text-orange-600 mx-auto" />
                      </button>
                      <span className="px-4 py-3 text-gray-800 font-bold text-lg min-w-[3rem] text-center bg-gray-50 relative">
                        {quantity}
                        {updatingCart && (
                          <span className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={updatingCart}
                        className="px-4 py-3 bg-orange-50 rounded-2xl cursor-pointer hover:bg-orange-100 transition disabled:opacity-50 flex-1"
                      >
                        <Plus className="w-5 h-5 text-orange-600 mx-auto" />
                      </button>
                    </div>
                    <button
                      onClick={handleRemoveFromCart}
                      disabled={updatingCart}
                      className="px-4 py-3 bg-red-50 cursor-pointer text-red-600 rounded-xl font-medium hover:bg-red-300 transition disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    disabled={cartLoading || updatingCart || product.availabilityStatus !== "In Stock"}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all ${
                      product.availabilityStatus !== "In Stock"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
                    }`}
                  >
                    {updatingCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </>
                    ) : product.availabilityStatus !== "In Stock" ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        ADD TO CART
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Additional Product Information */}
          <div className="border-t border-gray-100 p-6 md:p-8 bg-gradient-to-b from-white to-orange-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Nutritional Information */}
              {product.nutritionalInfo && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Nutritional Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-center w-full text-sm">
                      {product.nutritionalInfo.per && (
                        <div className="flex text-sm sm:text-base bg-amber-200 px-3 rounded-2xl pb-2">
                          <span className="text-gray-600 font-medium">Per</span> &nbsp;
                          <span className="font-semibold text-gray-800">{product.nutritionalInfo.per}</span>
                        </div>
                      )}
                    </div>
                    {product.nutritionalInfo.values && product.nutritionalInfo.values.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm border-b border-orange-100 pb-2">
                        <span className="text-gray-600 capitalize">{item.name}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage & Allergen Info */}
              {(product.shelfLife || product.storageInstructions || product.allergenInfo) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Storage & Ingredients Info
                  </h3>
                  <div className="space-y-3">
                    {product.shelfLife && (
                      <div className="flex items-start text-sm">
                        <span className="text-gray-600 w-24">Shelf Life</span>
                        <span className="font-medium">{product.shelfLife}</span>
                      </div>
                    )}

                    {product.storageInstructions && (
                      <div className="flex items-start text-sm">
                        <span className="text-gray-600 w-24">Storage</span>
                        <span className="font-medium">{product.storageInstructions}</span>
                      </div>
                    )}

                    {product.allergenInfo && (
                      <div className="flex items-start text-sm">
                        <span className="text-gray-600 w-24">Ingredients</span>
                        <span className="font-medium flex items-center">
                          <AlertTriangle className="w-4 h-4 text-green-500 mr-1" />
                          {product.allergenInfo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            {product.faq && product.faq.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {product.faq.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h4 className="font-medium text-gray-900">{item.question}</h4>
                      <p className="text-gray-700 mt-2">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Products Button */}
        <div className="mt-8 text-center">
          <Link to="/products" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to All Products
          </Link>
        </div>
      </div> 
    </div>
  );
};

export default ProductDetails;
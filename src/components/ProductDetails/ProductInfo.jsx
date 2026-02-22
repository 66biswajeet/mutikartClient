"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useRouter } from "next/navigation";

export default function ProductInfo({ product, quantity, onQuantityChange }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const inWishlist = isInWishlist(product._id);

  // Calculate discount percentage
  const discountPercentage =
    product.price && product.sale_price
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : 0;

  // Stock status check
  const isOutOfStock =
    product.stock_status === "out_of_stock" || product.quantity < 1;
  const isLowStock = !isOutOfStock && product.quantity <= 10;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      setAddingToCart(true);
      const API_URL =
        process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Product added to cart!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      setAddingToWishlist(true);

      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.product_name}
        </h1>

        {/* Brand */}
        {product.brand_id?.name && (
          <p className="text-sm text-gray-600">
            Brand: <span className="font-medium">{product.brand_id.name}</span>
          </p>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${
                index < Math.floor(product.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {product.rating ? product.rating.toFixed(1) : "0.0"}
          </span>
        </div>
        <span className="text-sm text-gray-400">|</span>
        <button className="text-sm text-blue-600 hover:underline">
          {product.reviews_count || 0} Reviews
        </button>
      </div>

      {/* Price */}
      <div className="border-t border-b border-gray-200 py-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            ${product.sale_price?.toFixed(2)}
          </span>

          {product.price && product.price !== product.sale_price && (
            <>
              <span className="text-xl text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="px-2 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
      </div>

      {/* Stock Status */}
      <div>
        {isOutOfStock ? (
          <p className="text-red-600 font-medium">Out of Stock</p>
        ) : isLowStock ? (
          <p className="text-orange-600 font-medium">
            Only {product.quantity} left in stock - Order soon
          </p>
        ) : (
          <p className="text-green-600 font-medium">In Stock</p>
        )}
      </div>

      {/* Short Description */}
      {product.short_description && (
        <div className="text-gray-700">
          <p>{product.short_description}</p>
        </div>
      )}

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
              min="1"
              max={product.quantity}
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= product.quantity}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || addingToCart}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {addingToCart
            ? "Adding..."
            : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || addingToCart}
          className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Buy Now
        </button>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={addingToWishlist}
        className="flex items-center justify-center space-x-2 border-2 border-gray-300 px-6 py-3 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
      >
        <svg
          className={`w-5 h-5 ${inWishlist ? "fill-current text-red-500" : ""}`}
          fill={inWishlist ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
      </button>

      {/* Product Info */}
      <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
        {product.sku && (
          <div className="flex">
            <span className="text-gray-600 w-32">SKU:</span>
            <span className="text-gray-900 font-medium">{product.sku}</span>
          </div>
        )}
        {product.category_id?.name && (
          <div className="flex">
            <span className="text-gray-600 w-32">Category:</span>
            <span className="text-gray-900 font-medium">
              {product.category_id.name}
            </span>
          </div>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex">
            <span className="text-gray-600 w-32">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  {tag.name || tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

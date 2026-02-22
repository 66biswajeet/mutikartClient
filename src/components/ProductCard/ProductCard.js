"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductCard({ product }) {
  const {
    _id,
    id,
    slug,
    product_name,
    product_thumbnail_image,
    image = "/assets/images/placeholder.jpg",
    title = "Product Title",
    description = "Short product description",
    short_description,
    price,
    sale_price,
    originalPrice,
    badge,
    actionType = "buy", // 'buy', 'bid', 'explore'
  } = product || {};

  const productId = _id || id;
  const productSlug = slug || productId;
  const displayTitle = product_name || title;
  const displayDescription = short_description || description;
  const displayImage = product_thumbnail_image || image;
  const displayPrice = sale_price || price;
  const displayOriginalPrice = price || originalPrice;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to add items to wishlist");
      return;
    }

    if (isAdding) return;

    setIsAdding(true);
    const result = await toggleWishlist(productId);
    setIsAdding(false);

    if (result.success) {
      // Optional: Show toast notification
      console.log(result.message);
    } else {
      alert(result.message || "Failed to update wishlist");
    }
  };

  const discount =
    displayOriginalPrice && displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : null;

  const getActionButton = () => {
    const buttonContent = (
      <>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 1L4.5 4M10 1l1.5 3M4 4h8l-1 6H5L4 4zM5.5 14a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM10.5 14a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Buy Now
      </>
    );
    
    return (
      <Link href={`/product/${productSlug}`} className={`${styles.actionBtn} ${styles.buyBtn}`}>
        {buttonContent}
      </Link>
    );
  };

  return (
    <Link href={`/product/${productSlug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image 
          src={displayImage} 
          alt={displayTitle} 
          className={styles.image}
          width={300}
          height={300}
          loading="lazy"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {badge && (
          <span className={`${styles.badge} ${styles[badge.type] || ""}`}>
            {badge.text}
          </span>
        )}
        {discount && (
          <span className={`${styles.badge} ${styles.discount}`}>
            -{discount}%
          </span>
        )}
        <button 
          className={`${styles.wishlistBtn} ${inWishlist ? styles.inWishlist : ""}`}
          onClick={handleWishlistClick}
          disabled={isAdding}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill={inWishlist ? "currentColor" : "none"}>
            <path
              d="M17.367 3.842a4.583 4.583 0 0 0-6.484 0L10 4.725l-.883-.883a4.583 4.583 0 1 0-6.484 6.483l.884.884L10 17.692l6.483-6.483.884-.884a4.583 4.583 0 0 0 0-6.483z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <p className={styles.description}>{displayDescription}</p>

        {displayPrice && (
          <div className={styles.priceContainer}>
            <span className={styles.price}>${displayPrice}</span>
            {displayOriginalPrice && displayOriginalPrice !== displayPrice && (
              <span className={styles.originalPrice}>${displayOriginalPrice}</span>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {getActionButton()}
        </div>
      </div>
    </Link>
  );
}

"use client";

import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const {
    image = "/assets/images/placeholder.jpg",
    title = "Product Title",
    description = "Short product description",
    price,
    originalPrice,
    badge,
    actionType = "buy", // 'buy', 'bid', 'explore'
  } = product || {};

  const discount =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const getActionButton = () => {
    switch (actionType) {
      case "bid":
        return (
          <button className={`${styles.actionBtn} ${styles.bidBtn}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1v14M1 8h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Place Bid
          </button>
        );
      case "explore":
        return (
          <button className={`${styles.actionBtn} ${styles.exploreBtn}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Explore
          </button>
        );
      default:
        return (
          <button className={`${styles.actionBtn} ${styles.buyBtn}`}>
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
          </button>
        );
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
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
        <button className={styles.wishlistBtn} aria-label="Add to wishlist">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        {price && (
          <div className={styles.priceContainer}>
            <span className={styles.price}>${price}</span>
            {originalPrice && (
              <span className={styles.originalPrice}>${originalPrice}</span>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.viewBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="8"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            View
          </button>
          <button className={styles.saveBtn} aria-label="Save for later">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 2H3a1 1 0 0 0-1 1v12l6-3 6 3V3a1 1 0 0 0-1-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Save
          </button>
          {getActionButton()}
        </div>
      </div>
    </article>
  );
}

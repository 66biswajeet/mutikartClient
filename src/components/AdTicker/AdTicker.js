"use client";

import styles from "./AdTicker.module.css";

export default function AdTicker() {
  const message = "50% discount — USE COUPONCODE: SAVE50";

  // Duplicate content to create a seamless scrolling loop
  return (
    <div
      className={styles.ticker}
      role="region"
      aria-label="Promotional ticker"
    >
      <div className={styles.track}>
        <div className={styles.block}>
          <span className={styles.item}>{message}</span>
          <span className={styles.item}>{message}</span>
          <span className={styles.item}>{message}</span>
        </div>
        <div className={styles.block} aria-hidden="true">
          <span className={styles.item}>{message}</span>
          <span className={styles.item}>{message}</span>
          <span className={styles.item}>{message}</span>
        </div>
      </div>
    </div>
  );
}

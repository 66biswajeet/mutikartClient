"use client";

import styles from "./AuthPrompt.module.css";

export default function AuthPrompt() {
  return (
    <section className={styles.authPrompt}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M24 16v8M24 30v.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className={styles.content}>
            <h2>Log Into view more personal recommendations</h2>
            <p>
              Sign in to access your personalized shopping experience, save
              favorites, and track your orders.
            </p>
          </div>

          <div className={styles.actions}>
            <button className={styles.signInBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 17v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign In
            </button>
            <button className={styles.createAccountBtn}>Create Account</button>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Save favorites</span>
            </div>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 2L6.5 6M15 2l2.5 4M6 6h12l-1.5 9H7.5L6 6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Track orders</span>
            </div>
            <div className={styles.feature}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Fast checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

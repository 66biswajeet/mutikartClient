"use client";

import { useState, useEffect } from "react";
import styles from "./EmailVerification.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function EmailVerification({ email, onVerified }) {
  const { verifyOTP, resendOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otp || otp.length < 5) {
      setError("Please enter a valid OTP code");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        setSuccessMessage("Email verified successfully!");

        // Redirect to home page after successful verification
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (error) {
      if (error.message.includes("Invalid OTP")) {
        setError("Invalid code!");
      } else if (error.message.includes("expired")) {
        setError("OTP has expired. Please request a new one.");
      } else {
        setError(error.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setSuccessMessage("");
    setResending(true);

    try {
      const result = await resendOTP(email);

      if (result.success) {
        setSuccessMessage("OTP sent successfully!");
        setResendCooldown(60); // 60 second cooldown
        setOtp(""); // Clear the input
      }
    } catch (error) {
      setError(error.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className={styles.icon}
          >
            <rect width="48" height="48" rx="24" fill="#EEF2FF" />
            <path
              d="M32 18L20 28L14 22"
              stroke="#667EEA"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className={styles.title}>Verify your email</h2>
        <p className={styles.description}>
          The verification code has been sent to your email
        </p>
        <p className={styles.email}>{email}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* OTP Input */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            className={`${styles.otpInput} ${error ? styles.inputError : ""}`}
            placeholder="Enter verification code"
            maxLength="6"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 4v5M8 11v.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 8l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Verify Button */}
        <button
          type="submit"
          className={styles.verifyButton}
          disabled={loading || !otp}
        >
          {loading ? <span className={styles.spinner}></span> : "Verify"}
        </button>

        {/* Resend Link */}
        <div className={styles.footer}>
          <span className={styles.footerText}>
            Not received verification code?{" "}
          </span>
          <button
            type="button"
            onClick={handleResend}
            className={styles.resendLink}
            disabled={resending || resendCooldown > 0}
          >
            {resending
              ? "Sending..."
              : resendCooldown > 0
              ? `Resend (${resendCooldown}s)`
              : "Resend verification code"}
          </button>
        </div>
      </form>
    </div>
  );
}

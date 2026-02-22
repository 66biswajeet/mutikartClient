"use client";

import { useState } from "react";
import styles from "./Login.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function Login({ onSwitchToRegister, onClose }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Check user role and redirect accordingly
        const userRole = result.data?.user?.role?.name;

        if (userRole === "vendor" || userRole === "Vendor") {
          // Redirect to vendor dashboard
          window.location.href = "/vendor/dashboard";
        } else {
          // Redirect to user dashboard or home
          window.location.href = "/";
        }

        onClose?.();
      }
    } catch (error) {
      setApiError(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sign in or create account</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email / Mobile
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
            placeholder="Enter email"
            autoComplete="email"
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        {/* Password Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M14.95 14.95A8.5 8.5 0 0 1 5.05 5.05m1.42 1.42a6 6 0 0 0 8.06 8.06m-9.54-9.54L2 2m16 16l-3-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 14a4 4 0 0 0 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className={styles.forgotPassword}>
          <a href="/forgot-password" className={styles.link}>
            Forgot Password?
          </a>
        </div>

        {/* API Error */}
        {apiError && <div className={styles.apiError}>{apiError}</div>}

        {/* Login Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner}></span> : "Log In"}
        </button>

        {/* Register Link */}
        <div className={styles.footer}>
          <span className={styles.footerText}>Not Registered? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className={styles.switchLink}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

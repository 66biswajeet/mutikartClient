"use client";

import { useState } from "react";
import styles from "./Register.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function Register({ onSwitchToLogin, onClose }) {
  const { register, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Must contain min 6 chars, uppercase, lowercase, number, and symbol
    const minLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        minLength && hasUppercase && hasLowercase && hasNumber && hasSymbol,
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol,
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      if (!passwordValidation.minLength) {
        newErrors.password = "Minimum 6 characters required";
      } else if (!passwordValidation.hasUppercase) {
        newErrors.password = "Must contain uppercase letter";
      } else if (!passwordValidation.hasLowercase) {
        newErrors.password = "Must contain lowercase letter";
      } else if (!passwordValidation.hasNumber) {
        newErrors.password = "Must contain number";
      } else if (!passwordValidation.hasSymbol) {
        newErrors.password = "Must contain symbol";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password mismatch";
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Registration successful, now auto-login
        try {
          await login(formData.email, formData.password);
          // Redirect to home page
          window.location.href = "/";
          onClose?.();
        } catch (loginError) {
          // If auto-login fails, show success message and switch to login
          setApiError("Registration successful! Please login.");
          setTimeout(() => {
            onSwitchToLogin();
          }, 2000);
        }
      }
    } catch (error) {
      if (error.message.includes("already registered")) {
        setApiError("Email already registered");
      } else {
        setApiError(error.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Register with a new account</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            First & Last name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
            placeholder="First & Last name"
            autoComplete="name"
          />
          {errors.name && (
            <span className={styles.errorText}>{errors.name}</span>
          )}
        </div>

        {/* Email Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Enter email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
            placeholder="example@email.com"
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
              autoComplete="new-password"
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

        {/* Confirm Password Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Re-enter password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <span className={styles.errorText}>{errors.confirmPassword}</span>
          )}
        </div>

        {/* API Error */}
        {apiError && <div className={styles.apiError}>{apiError}</div>}

        {/* Register Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? <span className={styles.spinner}></span> : "Register"}
        </button>

        {/* Login Link */}
        <div className={styles.footer}>
          <span className={styles.footerText}>Already Registered? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.switchLink}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

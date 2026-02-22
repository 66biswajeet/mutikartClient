"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./AuthModal.module.css";
import Login from "./Login";
import Register from "./Register";

const VIEWS = {
  LOGIN: "login",
  REGISTER: "register",
};

export default function AuthModal({ isOpen, onClose, initialView = "login" }) {
  const [currentView, setCurrentView] = useState(initialView);

  if (!isOpen) return null;

  const handleSwitchToRegister = () => {
    setCurrentView(VIEWS.REGISTER);
  };

  const handleSwitchToLogin = () => {
    setCurrentView(VIEWS.LOGIN);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.content}>
          {currentView === VIEWS.LOGIN && (
            <Login
              onSwitchToRegister={handleSwitchToRegister}
              onClose={onClose}
            />
          )}
          {currentView === VIEWS.REGISTER && (
            <Register onSwitchToLogin={handleSwitchToLogin} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}

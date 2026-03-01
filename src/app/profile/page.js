"use client";
//////// Hii Changes /////////

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./profile.module.css";

import CategoryBar from "@/components/CategoryBar/CategoryBar";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [isEditing, setIsEditing] = useState({
    name: false,
    gender: false,
    dob: false,
    email: false,
    mobile: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    dob: "",
    email: "",
    mobile: "",
  });

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        gender: "Male",
        dob: "08-Apr-1987",
        email: user.email || "",
        mobile: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <>
        <CategoryBar />
        <div style={{ padding: "100px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", color: "#6b7280" }}>Loading...</div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = (field) => {
    // TODO: Save to backend
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleVerifyEmail = async () => {
    setShowVerifyModal(true);
    // TODO: Send verification code to email
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError("Please enter verification code");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    // TODO: Verify code with backend
    setTimeout(() => {
      setIsVerifying(false);
      setShowVerifyModal(false);
      setVerificationCode("");
    }, 1000);
  };

  return (
    <>
      <CategoryBar />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className={styles.profileInfo}>
              <h3>{user?.name || "User"}</h3>
              <p>{user?.email || ""}</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <a href="/profile" className={styles.navItemActive}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16 17v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My Profile
            </a>
            <a href="/addresses" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.5 8.333c0 5-7.5 10-7.5 10s-7.5-5-7.5-10a7.5 7.5 0 1 1 15 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="10"
                  cy="8.333"
                  r="1.667"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Addresses
            </a>
            <a href="/wishlist" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.367 3.842a4.375 4.375 0 0 0-6.184 0L10 5.025 8.817 3.842a4.375 4.375 0 0 0-6.184 6.183L10 17.392l7.367-7.367a4.375 4.375 0 0 0 0-6.183z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My wishlist
            </a>
            <a href="/orders" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6.667 1.667v3.333m6.666-3.333v3.333M5.833 8.333h8.334M3.333 18.333h13.334a1.667 1.667 0 0 0 1.666-1.666V5.833a1.667 1.667 0 0 0-1.666-1.666H3.333a1.667 1.667 0 0 0-1.666 1.666v10.834a1.667 1.667 0 0 0 1.666 1.666z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              My Orders
            </a>
            <a href="/payment-methods" className={styles.navItem}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="1.667"
                  y="4.167"
                  width="16.666"
                  height="11.666"
                  rx="1.667"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M1.667 8.333h16.666"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Payment methods
            </a>
          </nav>

          <button className={styles.logoutBtn}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 17.5h-3.333a1.667 1.667 0 0 1-1.667-1.667V4.167a1.667 1.667 0 0 1 1.667-1.667H7.5M13.333 14.167l4.167-4.167-4.167-4.167M17.5 10h-10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </aside>

        <main className={styles.main}>
          <h1 className={styles.title}>User Profile</h1>

          <div className={styles.profileFields}>
            {/* Name Field */}
            <div className={styles.field}>
              <label>Name</label>
              {isEditing.name ? (
                <div className={styles.editField}>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave("name")}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className={styles.displayField}>
                  <span>{formData.name || "John Doe"}</span>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit("name")}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Gender Field */}
            <div className={styles.field}>
              <label>Gender</label>
              {isEditing.gender ? (
                <div className={styles.editField}>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave("gender")}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className={styles.displayField}>
                  <span>{formData.gender}</span>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit("gender")}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className={styles.field}>
              <label>Date of Birth</label>
              {isEditing.dob ? (
                <div className={styles.editField}>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave("dob")}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className={styles.displayField}>
                  <span>{formData.dob || "08-Apr-1987"}</span>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit("dob")}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.field}>
              <label>Email</label>
              {isEditing.email ? (
                <div className={styles.editField}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter new email"
                  />
                  <button
                    className={styles.verifyBtn}
                    onClick={handleVerifyEmail}
                  >
                    Verify
                  </button>
                </div>
              ) : (
                <div className={styles.displayField}>
                  <span>{formData.email || "jeon@sample.com"}</span>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit("email")}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Field */}
            <div className={styles.field}>
              <label>Mobile No</label>
              {isEditing.mobile ? (
                <div className={styles.editField}>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    placeholder="Enter mobile number"
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave("mobile")}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className={styles.displayField}>
                  {formData.mobile ? (
                    <>
                      <span>{formData.mobile}</span>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit("mobile")}
                      >
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={styles.emptyField}>
                        No mobile number added
                      </span>
                      <button
                        className={styles.addBtn}
                        onClick={() => handleEdit("mobile")}
                      >
                        Add
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.displayField}>
                <span>••••••••</span>
                <button
                  className={styles.editBtn}
                  onClick={() => (window.location.href = "/change-password")}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Email Verification Modal */}
      {showVerifyModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowVerifyModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowVerifyModal(false)}
            >
              ×
            </button>
            <h2 className={styles.modalTitle}>Verify your email</h2>
            <p className={styles.modalText}>
              This verification code has been sent to your email
              <br />
              <strong>{formData.email}</strong>
            </p>
            <input
              type="text"
              className={styles.verifyInput}
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            {verificationError && (
              <p className={styles.errorText}>{verificationError}</p>
            )}
            <button
              className={styles.verifySubmitBtn}
              onClick={handleVerifyCode}
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
            <p className={styles.resendText}>
              Not received your verification code?
              <br />
              <button className={styles.resendLink}>
                Cancel (Your email can be edit again)
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

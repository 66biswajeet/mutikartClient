"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./addresses.module.css";

import CategoryBar from "@/components/CategoryBar/CategoryBar";

export default function AddressesPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form fields aligned with backend Address model
  const [formData, setFormData] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone: "",
    is_default: false,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!loading && isAuthenticated) fetchAddresses();
  }, [loading, isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/address", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        // map backend _id to id for consistent rendering
        setAddresses((data.data || []).map((a) => ({ ...a })));
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setAddresses([]);
    }
  };

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

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      label: "Home",
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone: "",
      is_default: false,
    });
    setShowAddModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label || "Home",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      zip: address.zip || "",
      phone: address.phone || "",
      is_default: address.is_default || false,
    });
    setShowAddModal(true);
  };

  const handleRemove = async (addressId) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      const res = await fetch(`/api/address/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        await fetchAddresses();
      } else {
        alert(data.message || "Failed to delete address");
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
      alert("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      // Update chosen address to is_default=true
      const address = addresses.find(
        (a) => a._id === addressId || a.id === addressId,
      );
      if (!address) return;
      const body = { ...address, is_default: true };
      const res = await fetch(`/api/address/${address._id || address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAddresses();
      } else {
        alert(data.message || "Failed to set default");
      }
    } catch (err) {
      console.error("Failed to set default:", err);
      alert("Failed to set default");
    }
  };

  const handleSave = async () => {
    try {
      if (editingAddress) {
        const res = await fetch(
          `/api/address/${editingAddress._id || editingAddress.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
          },
        );
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Update failed");
      } else {
        const res = await fetch(`/api/address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Create failed");
      }
      await fetchAddresses();
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to save address:", err);
      alert(err.message || "Failed to save address");
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
            <a href="/profile" className={styles.navItem}>
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
            <a href="/addresses" className={styles.navItemActive}>
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
          <h1 className={styles.title}>My Addresses</h1>

          <p className={styles.subtitle}>
            Customers Default address is shown here every time user log in.
            <br />
            During the session customer can change it if multiple addresses are
            available.
            <br />
            Whatever address is selected here will be used to show delivery time
            and delivery fees when shopping.
          </p>

          <div className={styles.addressGrid}>
            {/* Add New Address Card */}
            <div className={styles.addCard} onClick={handleAddNew}>
              <div className={styles.addIcon}>+</div>
              <span>Add new address</span>
            </div>

            {/* Address Cards */}
            {addresses.map((address) => (
              <div key={address.id} className={styles.addressCard}>
                {address.isDefault && (
                  <span className={styles.defaultBadge}>Default</span>
                )}
                <h3>{address.name}</h3>
                <p className={styles.addressText}>{address.address}</p>
                <p className={styles.addressDetails}>{address.details}</p>
                <p className={styles.addressPhone}>{address.phone}</p>
                <div className={styles.addressActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => handleRemove(address.id)}
                  >
                    Remove
                  </button>
                  {!address.isDefault && (
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            <h2 className={styles.modalTitle}>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>

            <div className={styles.formFields}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Label</label>
                  <select
                    value={formData.label}
                    onChange={(e) => handleChange("label", e.target.value)}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Street Address *</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => handleChange("zip", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => handleChange("is_default", e.target.checked)}
                />
                <label htmlFor="is_default">Set as default address</label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

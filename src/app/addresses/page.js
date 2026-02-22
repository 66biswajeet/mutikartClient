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
  const [addressType, setAddressType] = useState("Residential");

  const [formData, setFormData] = useState({
    buildingName: "",
    floor: "",
    unit: "",
    island: "Maldives",
    atoll: "",
    country: "Maldives",
    contactName: "",
    contactNo: "",
    isDefault: false,
    // Vessel specific fields
    vesselName: "",
    dockJettyFloatMale: "",
    contactNameVessel: "",
    contactNoVessel: "",
    isDefaultVessel: false,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    // TODO: Fetch addresses from backend
    const mockAddresses = [
      {
        id: 1,
        type: "Residential",
        name: "Jeon Doe",
        address: "H. New Florida, Unit 49",
        details: "5th Floor, Ahmed Magu, Malé, Maldives",
        phone: "+960 7496969",
        isDefault: true,
      },
    ];
    setAddresses(mockAddresses);
  }, []);

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
      buildingName: "",
      floor: "",
      unit: "",
      island: "Maldives",
      atoll: "",
      country: "Maldives",
      contactName: "",
      contactNo: "",
      isDefault: false,
      vesselName: "",
      dockJettyFloatMale: "",
      contactNameVessel: "",
      contactNoVessel: "",
      isDefaultVessel: false,
    });
    setAddressType("Residential");
    setShowAddModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      buildingName: address.buildingName || "",
      floor: address.floor || "",
      unit: address.unit || "",
      island: address.island || "Maldives",
      atoll: address.atoll || "",
      country: address.country || "Maldives",
      contactName: address.name || "",
      contactNo: address.phone || "",
      isDefault: address.isDefault || false,
      vesselName: address.vesselName || "",
      dockJettyFloatMale: address.dockJettyFloatMale || "",
      contactNameVessel: address.contactNameVessel || "",
      contactNoVessel: address.contactNoVessel || "",
      isDefaultVessel: address.isDefaultVessel || false,
    });
    setAddressType(address.type || "Residential");
    setShowAddModal(true);
  };

  const handleRemove = (addressId) => {
    if (confirm("Are you sure you want to remove this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      // TODO: Delete from backend
    }
  };

  const handleSetDefault = (addressId) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      })),
    );
    // TODO: Update backend
  };

  const handleSave = () => {
    if (editingAddress) {
      // Update existing
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...editingAddress, ...formData }
            : addr,
        ),
      );
    } else {
      // Add new
      const newAddress = {
        id: Date.now(),
        type: addressType,
        name:
          addressType === "Residential"
            ? formData.contactName
            : formData.contactNameVessel,
        address:
          addressType === "Residential"
            ? `${formData.buildingName}, Unit ${formData.unit}`
            : formData.vesselName,
        details:
          addressType === "Residential"
            ? `${formData.floor}, ${formData.atoll}, ${formData.island}`
            : formData.dockJettyFloatMale,
        phone:
          addressType === "Residential"
            ? formData.contactNo
            : formData.contactNoVessel,
        isDefault:
          addressType === "Residential"
            ? formData.isDefault
            : formData.isDefaultVessel,
        ...formData,
      };
      setAddresses([...addresses, newAddress]);
    }
    setShowAddModal(false);
    // TODO: Save to backend
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

            {/* Address Type Toggle */}
            <div className={styles.typeToggle}>
              <button
                className={
                  addressType === "Residential"
                    ? styles.typeActive
                    : styles.typeInactive
                }
                onClick={() => setAddressType("Residential")}
              >
                ● Residential
              </button>
              <button
                className={
                  addressType === "Vessel"
                    ? styles.typeActive
                    : styles.typeInactive
                }
                onClick={() => setAddressType("Vessel")}
              >
                ● Vessel
              </button>
            </div>

            {/* Residential Form */}
            {addressType === "Residential" && (
              <div className={styles.formFields}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Building Name</label>
                    <input
                      type="text"
                      value={formData.buildingName}
                      onChange={(e) =>
                        handleChange("buildingName", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Floor</label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={(e) => handleChange("floor", e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Island</label>
                    <select
                      value={formData.island}
                      onChange={(e) => handleChange("island", e.target.value)}
                    >
                      <option>Maldives</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Atoll</label>
                    <select
                      value={formData.atoll}
                      onChange={(e) => handleChange("atoll", e.target.value)}
                    >
                      <option value="">Select Atoll</option>
                      <option>North Malé Atoll</option>
                      <option>South Malé Atoll</option>
                      <option>Ari Atoll</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    >
                      <option>Maldives</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Contact Name</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        handleChange("contactName", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Contact No</label>
                    <input
                      type="tel"
                      value={formData.contactNo}
                      onChange={(e) =>
                        handleChange("contactNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) =>
                      handleChange("isDefault", e.target.checked)
                    }
                  />
                  <label htmlFor="isDefault">Default address</label>
                </div>
              </div>
            )}

            {/* Vessel Form */}
            {addressType === "Vessel" && (
              <div className={styles.formFields}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Vessel Name</label>
                    <input
                      type="text"
                      value={formData.vesselName}
                      onChange={(e) =>
                        handleChange("vesselName", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Dock, Jetty Float, Malé</label>
                    <input
                      type="text"
                      value={formData.dockJettyFloatMale}
                      onChange={(e) =>
                        handleChange("dockJettyFloatMale", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Contact Name</label>
                    <input
                      type="text"
                      value={formData.contactNameVessel}
                      onChange={(e) =>
                        handleChange("contactNameVessel", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Contact No</label>
                    <input
                      type="tel"
                      value={formData.contactNoVessel}
                      onChange={(e) =>
                        handleChange("contactNoVessel", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="isDefaultVessel"
                    checked={formData.isDefaultVessel}
                    onChange={(e) =>
                      handleChange("isDefaultVessel", e.target.checked)
                    }
                  />
                  <label htmlFor="isDefaultVessel">Default address</label>
                </div>
              </div>
            )}

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

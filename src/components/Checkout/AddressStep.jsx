"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./AddressStep.module.css";

export default function AddressStep({
  onNext,
  onAddressSelect,
  selectedAddress,
}) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
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
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/address", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setAddresses(data.data || []);
        // Auto-select default address
        const defaultAddr = data.data.find((addr) => addr.is_default);
        if (defaultAddr && !selectedAddress) {
          onAddressSelect(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAddresses();
        setShowAddForm(false);
        onAddressSelect(data.data);
        setFormData({
          label: "HOME",
          street: "",
          city: "",
          state: "",
          country: "",
          zip: "",
          phone: "",
          is_default: false,
        });
      } else {
        alert(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
        <p>Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className={styles.addressStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>Deliver to:</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={styles.addButton}
        >
          {showAddForm ? "Cancel" : "+ Add New Address"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <h3 className={styles.formTitle}>Add Delivery Address</h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Label</label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Street Address *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={styles.input}
              placeholder="Street address, building name, apartment"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
                placeholder="City"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={styles.input}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={styles.input}
                placeholder="Country"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ZIP Code *</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className={styles.input}
                placeholder="ZIP"
                required
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="is_default" className={styles.checkboxLabel}>
              Set as default address
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Address
          </button>
        </form>
      )}

      {/* Address List */}
      <div className={styles.addressList}>
        {addresses.length === 0 ? (
          <div className={styles.noAddresses}>
            <p>No addresses found. Please add a delivery address.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`${styles.addressCard} ${
                selectedAddress?._id === address._id ? styles.selected : ""
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className={styles.radioButton}>
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress?._id === address._id}
                  onChange={() => onAddressSelect(address)}
                  className={styles.radio}
                />
              </div>

              <div className={styles.addressDetails}>
                <div className={styles.addressHeader}>
                  <span className={styles.addressLabel}>{address.label}</span>
                  {address.is_default && (
                    <span className={styles.defaultBadge}>Default</span>
                  )}
                </div>
                <p className={styles.addressText}>
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.zip}
                  <br />
                  {address.country}
                </p>
                {address.phone && (
                  <p className={styles.phoneText}>{address.phone}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Continue Button */}
      <div className={styles.footer}>
        <button
          onClick={onNext}
          disabled={!selectedAddress}
          className={styles.continueButton}
        >
          Continue to Order Summary
        </button>
      </div>
    </div>
  );
}

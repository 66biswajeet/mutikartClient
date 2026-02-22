"use client";

import { useState } from "react";
import styles from "./PaymentStep.module.css";

export default function PaymentStep({
  cart,
  cartTotal,
  selectedAddress,
  onComplete,
  onBack,
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  const fees = 156;
  const discounts = cart.reduce((total, item) => {
    const itemDiscount = (item.price - item.sale_price) * item.quantity;
    return total + itemDiscount;
  }, 0);

  const mrp = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalAmount = cartTotal + fees;

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      subtitle: "Pay by any UPI app",
      offers: "Get upto ₹30 cashback • 3 offers available",
      icon: "💳",
    },
    {
      id: "card",
      name: "Credit / Debit / ATM Card",
      subtitle: "Add and secure cards as per RBI guidelines",
      offers: "Save upto ₹5,000 • 4 offers available",
      icon: "💳",
    },
    {
      id: "emi",
      name: "EMI",
      subtitle: "Credit Card EMI",
      icon: "📅",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "🏦",
    },
    {
      id: "giftcard",
      name: "Have a Flipkart Gift Card?",
      icon: "🎁",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      subtitle: "Unavailable",
      disabled: true,
      icon: "💵",
    },
  ];

  const handlePayment = async () => {
    if (selectedPaymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID");
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onComplete(selectedPaymentMethod);
    }, 2000);
  };

  return (
    <div className={styles.paymentStep}>
      <div className={styles.container}>
        {/* Left Section - Payment Options */}
        <div className={styles.leftSection}>
          <div className={styles.header}>
            <button onClick={onBack} className={styles.backButton}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15l-5-5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Complete Payment
            </button>
            <div className={styles.securebadge}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1l5 2v4.5c0 3.5-2 6.5-5 7.5-3-1-5-4-5-7.5V3l5-2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              100% Secure
            </div>
          </div>

          <div className={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`${styles.paymentMethod} ${
                  selectedPaymentMethod === method.id ? styles.selected : ""
                } ${method.disabled ? styles.disabled : ""}`}
                onClick={() =>
                  !method.disabled && setSelectedPaymentMethod(method.id)
                }
              >
                <div className={styles.methodIcon}>{method.icon}</div>
                <div className={styles.methodDetails}>
                  <div className={styles.methodName}>{method.name}</div>
                  {method.subtitle && (
                    <div className={styles.methodSubtitle}>
                      {method.subtitle}
                    </div>
                  )}
                  {method.offers && selectedPaymentMethod !== method.id && (
                    <div className={styles.methodOffers}>{method.offers}</div>
                  )}
                </div>
                {method.disabled && (
                  <div className={styles.unavailableBadge}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 0L1 11m10 0L6 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* UPI Form */}
          {selectedPaymentMethod === "upi" && (
            <div className={styles.paymentForm}>
              <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Add new UPI ID</h3>
                <a href="#" className={styles.helpLink}>
                  How to find?
                </a>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>UPI ID</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter your UPI ID"
                    className={styles.input}
                  />
                  <button className={styles.verifyButton}>Verify</button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={styles.payButton}
              >
                {processing
                  ? "Processing..."
                  : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>

              <div className={styles.discountBanner}>
                <div className={styles.discountContent}>
                  <span className={styles.discountText}>
                    10% instant discount
                  </span>
                  <span className={styles.discountSubtext}>
                    Claim now with payment offers
                  </span>
                </div>
                <div className={styles.discountIcons}>
                  <span className={styles.discountIcon}>🏦</span>
                  <span className={styles.discountIcon}>✅</span>
                  <span className={styles.discountMore}>+3</span>
                </div>
              </div>
            </div>
          )}

          {/* Other Payment Methods */}
          {selectedPaymentMethod === "card" && (
            <div className={styles.paymentForm}>
              <h3 className={styles.formTitle}>
                Add Credit / Debit / ATM Card
              </h3>
              <p className={styles.formSubtitle}>
                Add and secure cards as per RBI guidelines
              </p>
              <button onClick={handlePayment} className={styles.payButton}>
                {processing
                  ? "Processing..."
                  : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>
            </div>
          )}

          {selectedPaymentMethod === "emi" && (
            <div className={styles.paymentForm}>
              <h3 className={styles.formTitle}>Credit Card EMI</h3>
              <button onClick={handlePayment} className={styles.payButton}>
                {processing
                  ? "Processing..."
                  : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>
            </div>
          )}

          {selectedPaymentMethod === "netbanking" && (
            <div className={styles.paymentForm}>
              <h3 className={styles.formTitle}>Net Banking</h3>
              <button onClick={handlePayment} className={styles.payButton}>
                {processing
                  ? "Processing..."
                  : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>
            </div>
          )}

          {selectedPaymentMethod === "giftcard" && (
            <div className={styles.paymentForm}>
              <h3 className={styles.formTitle}>Have a Flipkart Gift Card?</h3>
              <button onClick={handlePayment} className={styles.payButton}>
                {processing
                  ? "Processing..."
                  : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {/* Right Section - Price Summary */}
        <div className={styles.rightSection}>
          <div className={styles.priceCard}>
            <h3 className={styles.priceTitle}>MRP (incl. of all taxes)</h3>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceAmount}>₹{mrp.toFixed(2)}</div>

              <div className={styles.feesSection}>
                <button className={styles.feesToggle}>
                  Fees <span className={styles.chevron}>^</span>
                </button>
                <div className={styles.feesDetail}>
                  <span>Protect Promise Fee</span>
                  <span>₹{fees}</span>
                </div>
              </div>

              <div className={styles.discountsSection}>
                <button className={styles.discountsToggle}>
                  Discounts <span className={styles.chevron}>^</span>
                </button>
                <div className={styles.discountsDetail}>
                  <span>MRP Discount</span>
                  <span className={styles.discountValue}>
                    -₹{discounts.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Amount</span>
                <span className={styles.totalValue}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

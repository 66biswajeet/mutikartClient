"use client";

import styles from "./OrderSummaryStep.module.css";

export default function OrderSummaryStep({
  cart,
  cartTotal,
  selectedAddress,
  onNext,
  onBack,
}) {
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

  return (
    <div className={styles.orderSummaryStep}>
      <div className={styles.container}>
        {/* Left Section - Order Details */}
        <div className={styles.leftSection}>
          {/* Delivery Address */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Deliver to:</h3>
              <button onClick={onBack} className={styles.changeButton}>
                Change
              </button>
            </div>
            <div className={styles.addressBox}>
              <div className={styles.addressHeader}>
                <span className={styles.addressLabel}>
                  {selectedAddress?.label}
                </span>
                <span className={styles.badge}>HOME</span>
              </div>
              <p className={styles.addressText}>
                {selectedAddress?.street}
                <br />
                {selectedAddress?.city}, {selectedAddress?.state}{" "}
                {selectedAddress?.zip}
              </p>
              {selectedAddress?.phone && (
                <p className={styles.phoneText}>{selectedAddress.phone}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Order Items</h3>
            <div className={styles.orderItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={item.product_image || "/placeholder.png"}
                      alt={item.product_name}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.product_name}</h4>
                    {item.variation_options && (
                      <p className={styles.itemVariation}>
                        {Object.entries(item.variation_options)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                    )}

                    <div className={styles.itemPricing}>
                      <div className={styles.priceRow}>
                        <span className={styles.discount}>
                          ↓{" "}
                          {Math.round(
                            ((item.price - item.sale_price) / item.price) * 100,
                          )}
                          %
                        </span>
                        <span className={styles.originalPrice}>
                          ₹{item.price.toFixed(2)}
                        </span>
                        <span className={styles.salePrice}>
                          ₹{item.sale_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemQuantity}>
                    <div className={styles.quantityBadge}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className={styles.deliveryInfo}>
            <div className={styles.deliveryBadge}>
              <svg
                className={styles.deliveryIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>EXPRESS Delivery by tomorrow</span>
            </div>
          </div>
        </div>

        {/* Right Section - Price Summary */}
        <div className={styles.rightSection}>
          <div className={styles.priceCard}>
            <h3 className={styles.priceTitle}>Price Details</h3>

            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>MRP</span>
                <span className={styles.priceValue}>₹{mrp.toFixed(2)}</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Fees</span>
                <span className={styles.priceValue}>₹{fees}</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Discounts</span>
                <span className={styles.discountValue}>
                  -₹{discounts.toFixed(2)}
                </span>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Amount</span>
                <span className={styles.totalValue}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={styles.savingsBox}>
              <svg
                className={styles.savingsIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>You'll save ₹{discounts.toFixed(2)} on this order!</span>
            </div>

            <button onClick={onNext} className={styles.continueButton}>
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./CartSlider.module.css";

export default function CartSlider() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={closeCart} />

      {/* Cart Slider */}
      <div className={styles.cartSlider}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Shopping Cart
            {cartCount > 0 && (
              <span className={styles.count}>({cartCount} items)</span>
            )}
          </h2>
          <button onClick={closeCart} className={styles.closeButton}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <svg
                className={styles.emptyCartIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className={styles.emptyCartText}>Your cart is empty</p>
              <button
                onClick={handleContinueShopping}
                className={styles.continueButton}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  {/* Product Image */}
                  <div className={styles.itemImage}>
                    <img
                      src={item.product_image || "/placeholder.png"}
                      alt={item.product_name}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.product_name}</h3>
                    {item.variation_options && (
                      <p className={styles.itemVariation}>
                        {Object.entries(item.variation_options)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                    )}
                    <div className={styles.itemPrice}>
                      <span className={styles.priceLabel}>Price:</span>
                      <span className={styles.price}>
                        ${item.sale_price.toFixed(2)}
                      </span>
                      {item.price !== item.sale_price && (
                        <span className={styles.originalPrice}>
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className={styles.quantityButton}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className={styles.subtotal}>
                      Subtotal: ${item.sub_total.toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeButton}
                    title="Remove item"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button onClick={handleCheckout} className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
            <button
              onClick={handleContinueShopping}
              className={styles.continueShoppingButton}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

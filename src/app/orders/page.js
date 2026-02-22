"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./orders.module.css";

import CategoryBar from "@/components/CategoryBar/CategoryBar";

export default function OrdersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    // TODO: Fetch orders from backend
    const mockOrders = [
      {
        id: "GLOF263 18:34",
        orderNumber: "GLOF263 18:34",
        orderDate: "30-10-2021",
        items: 3,
        totalPrice: 1293.0,
        status: "delivered",
        deliveryAddress: {
          name: "Jeon Doe",
          street: "H. New Florida, Malé City",
          phone: "+960 7496969",
        },
        deliveryTime: "Friday, 17-Oct-2025",
        products: [
          {
            id: 1,
            name: "Beko Sport Baby G Console/7.5mm/T/Shirt-C - Available for Bulk Delivery from 1st December",
            image: "/carousel/1.jpg",
            price: 293.32,
            quantity: 1,
          },
          {
            id: 2,
            name: "Old Baby Maxi/Red, Bamboo - Mini, Maxi/Blue Bat",
            image: "/carousel/2.jpg",
            price: 199.0,
            quantity: 2,
          },
        ],
        timeline: [
          { status: "Order placed", completed: true },
          { status: "In/With cash payment", completed: true },
          { status: "Verifying order", completed: true },
          { status: "Ready to dispatch", completed: true },
          { status: "Awaiting payment", completed: true },
          { status: "Payment confirmed", completed: true },
          { status: "Processing your order", completed: true },
          { status: "Ready for pickup", completed: true },
          { status: "Out for delivery", completed: true },
          { status: "Arrived at delivery", completed: true },
          { status: "Order delivery", completed: true },
        ],
      },
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === activeFilter),
      );
    }
  }, [activeFilter, orders]);

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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleTrackOrder = () => {
    setShowOrderModal(false);
    setShowTrackingModal(true);
  };

  const filters = [
    { id: "all", label: "All Orders" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "returns", label: "Returns" },
  ];

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
            <a href="/orders" className={styles.navItemActive}>
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
          <h1 className={styles.title}>My Orders</h1>

          <div className={styles.filters}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={
                  activeFilter === filter.id
                    ? styles.filterActive
                    : styles.filterBtn
                }
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className={styles.ordersList}>
            {filteredOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <rect
                    x="20"
                    y="30"
                    width="80"
                    height="70"
                    rx="4"
                    stroke="#CBD5E1"
                    strokeWidth="4"
                  />
                  <path d="M20 50h80" stroke="#CBD5E1" strokeWidth="4" />
                </svg>
                <h2>No orders found</h2>
                <p>You haven't placed any orders yet</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3>THU, {order.orderNumber}</h3>
                      <p>Out for delivery</p>
                    </div>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderDate}>
                        {order.orderDate}
                      </span>
                      <span className={styles.orderItems}>
                        {order.items} items | ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.viewDetailsBtn}
                    onClick={() => handleViewDetails(order)}
                  >
                    View details
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowOrderModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowOrderModal(false)}
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <h2>THU, {selectedOrder.orderNumber}</h2>
              <p>Out for delivery - {selectedOrder.orderDate}</p>
              <div className={styles.modalMeta}>
                <span>
                  {selectedOrder.items} items | ₹
                  {selectedOrder.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3>Ship to</h3>
              <div className={styles.addressBox}>
                <p>
                  <strong>{selectedOrder.deliveryAddress.name}</strong>
                </p>
                <p>{selectedOrder.deliveryAddress.street}</p>
                <p>{selectedOrder.deliveryAddress.phone}</p>
              </div>
            </div>

            <div className={styles.modalSection}>
              <h3>Delivery Time</h3>
              <p className={styles.deliveryTime}>
                {selectedOrder.deliveryTime}
              </p>
            </div>

            <div className={styles.modalSection}>
              <h3>Products</h3>
              <div className={styles.productsList}>
                {selectedOrder.products.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <img src={product.image} alt={product.name} />
                    <div className={styles.productDetails}>
                      <h4>{product.name}</h4>
                      <p>Qty: {product.quantity}</p>
                      <p className={styles.productPrice}>
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.trackBtn} onClick={handleTrackOrder}>
                Track Order
              </button>
              <button className={styles.reviewBtn}>Leave a review</button>
              <button className={styles.storeBtn}>Write to store</button>
              <button className={styles.cancelBtn}>Cancel Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Timeline Modal */}
      {showTrackingModal && selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTrackingModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowTrackingModal(false)}
            >
              ×
            </button>

            <h2 className={styles.trackingTitle}>Order Tracking</h2>
            <p className={styles.trackingSubtitle}>
              Order {selectedOrder.orderNumber}
            </p>

            <div className={styles.timeline}>
              {selectedOrder.timeline.map((step, index) => (
                <div
                  key={index}
                  className={
                    step.completed
                      ? styles.timelineItemCompleted
                      : styles.timelineItem
                  }
                >
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <p>{step.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={styles.closeTrackingBtn}
              onClick={() => setShowTrackingModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

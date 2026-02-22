"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AddressStep from "@/components/Checkout/AddressStep";
import OrderSummaryStep from "@/components/Checkout/OrderSummaryStep";
import PaymentStep from "@/components/Checkout/PaymentStep";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { cart, cartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (cart.length === 0 && !authLoading) {
      router.push("/");
    }
  }, [cart, authLoading, router]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressNext = () => {
    if (selectedAddress) {
      setCurrentStep(2);
    }
  };

  const handleOrderSummaryNext = () => {
    setCurrentStep(3);
  };

  const handlePaymentComplete = async (paymentMethod) => {
    // TODO: Process payment and create order
    console.log("Payment completed with method:", paymentMethod);
    router.push("/orders");
  };

  const steps = [
    { number: 1, name: "Address", completed: currentStep > 1 },
    { number: 2, name: "Order Summary", completed: currentStep > 2 },
    { number: 3, name: "Payment", completed: false },
  ];

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        {/* Progress Steps */}
        <div className={styles.progressContainer}>
          <div className={styles.progressSteps}>
            {steps.map((step, index) => (
              <div key={step.number} className={styles.stepWrapper}>
                <div
                  className={`${styles.step} ${
                    currentStep === step.number
                      ? styles.stepActive
                      : currentStep > step.number
                        ? styles.stepCompleted
                        : styles.stepPending
                  }`}
                >
                  <div className={styles.stepNumber}>
                    {step.completed ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className={styles.stepName}>{step.name}</div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`${styles.stepConnector} ${
                      currentStep > step.number
                        ? styles.stepConnectorActive
                        : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className={styles.stepContent}>
          {currentStep === 1 && (
            <AddressStep
              onNext={handleAddressNext}
              onAddressSelect={handleAddressSelect}
              selectedAddress={selectedAddress}
            />
          )}
          {currentStep === 2 && (
            <OrderSummaryStep
              cart={cart}
              cartTotal={cartTotal}
              selectedAddress={selectedAddress}
              onNext={handleOrderSummaryNext}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep
              cart={cart}
              cartTotal={cartTotal}
              selectedAddress={selectedAddress}
              onComplete={handlePaymentComplete}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

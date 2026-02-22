"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Calculate cart totals
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.sub_total, 0);
    setCartCount(count);
    setCartTotal(total);
  }, [cart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = async (product, quantity = 1, variation = null) => {
    try {
      setLoading(true);

      // Calculate price
      const price = product.sale_price || product.price;
      const sub_total = price * quantity;

      // Create cart item
      const cartItem = {
        id: variation ? `${product._id}-${variation._id}` : product._id,
        product_id: product._id,
        variation_id: variation?._id || null,
        product_name: product.product_name,
        product_sku: product.sku,
        product_image:
          product.product_thumbnail || product.product_galleries?.[0],
        quantity: quantity,
        price: product.price,
        sale_price: price,
        sub_total: sub_total,
        variation_options: variation || null,
        stock: product.quantity,
      };

      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(
        (item) => item.id === cartItem.id,
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedCart = [...cart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;

        // Check stock limit
        if (newQuantity > cartItem.stock) {
          return {
            success: false,
            message: "Cannot add more items than available in stock",
          };
        }

        updatedCart[existingItemIndex].quantity = newQuantity;
        updatedCart[existingItemIndex].sub_total = price * newQuantity;
        setCart(updatedCart);
      } else {
        // Add new item
        setCart([...cart, cartItem]);
      }

      // Open cart slider
      setIsCartOpen(true);

      return {
        success: true,
        message: "Product added to cart",
        item: cartItem,
      };
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return {
        success: false,
        message: "Failed to add to cart. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        // Check stock limit
        if (newQuantity > item.stock) {
          return item;
        }
        return {
          ...item,
          quantity: newQuantity,
          sub_total: item.sale_price * newQuantity,
        };
      }
      return item;
    });

    setCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        loading,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

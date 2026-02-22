"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistCount(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ADMIN_API_URL}/api/wishlist`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setWishlist(data.data || []);
        setWishlistCount(data.data?.length || 0);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      // OPTIMISTIC UPDATE: Add immediately to UI for better UX
      const optimisticItem = {
        id: `temp-${Date.now()}`,
        productId: productId,
        product_name: "Loading...",
        createdAt: new Date().toISOString(),
      };

      setWishlist((prev) => [optimisticItem, ...prev]);
      setWishlistCount((prev) => prev + 1);

      const response = await fetch(`${ADMIN_API_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // Replace optimistic item with real data
        await fetchWishlist();
        return { success: true, message: data.message || "Added to wishlist" };
      } else {
        // ROLLBACK: Remove optimistic item on failure
        setWishlist((prev) =>
          prev.filter((item) => item.id !== optimisticItem.id),
        );
        setWishlistCount((prev) => prev - 1);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // ROLLBACK: Refresh to get correct state
      await fetchWishlist();
      return {
        success: false,
        message: "Failed to add to wishlist. Please try again.",
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      // OPTIMISTIC UPDATE: Remove immediately from UI
      const previousWishlist = [...wishlist];
      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.productId !== productId &&
            item._id !== productId &&
            item.id !== productId,
        ),
      );
      setWishlistCount((prev) => Math.max(0, prev - 1));

      const response = await fetch(
        `${ADMIN_API_URL}/api/wishlist?productId=${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        // Confirm removal was successful
        return {
          success: true,
          message: data.message || "Removed from wishlist",
        };
      } else {
        // ROLLBACK: Restore previous state on failure
        setWishlist(previousWishlist);
        setWishlistCount(previousWishlist.length);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // ROLLBACK: Refresh to get correct state
      await fetchWishlist();
      return {
        success: false,
        message: "Failed to remove from wishlist. Please try again.",
      };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        item.productId === productId ||
        item._id === productId ||
        item.id === productId ||
        item.productId?.toString() === productId?.toString(),
    );
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    // Provide safe no-op defaults when no provider is present
    return {
      wishlist: [],
      wishlistCount: 0,
      loading: false,
      addToWishlist: async () => ({
        success: false,
        message: "No wishlist provider",
      }),
      removeFromWishlist: async () => ({
        success: false,
        message: "No wishlist provider",
      }),
      isInWishlist: () => false,
      toggleWishlist: async () => ({
        success: false,
        message: "No wishlist provider",
      }),
      refreshWishlist: async () => {},
    };
  }
  return context;
}

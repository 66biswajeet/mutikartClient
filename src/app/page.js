"use client";

import { useState, lazy, Suspense } from "react";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import AdTicker from "@/components/AdTicker/AdTicker";
import ProductFeed from "@/components/ProductFeed/ProductFeed";
import styles from "./page.module.css";

// Lazy load heavy components
const PopularCategories = lazy(() => import("@/components/PopularCategories/PopularCategories"));
const StickyNote = lazy(() => import("@/components/StickyNote/StickyNote"));
const Sidebar = lazy(() => import("@/components/Sidebar/Sidebar"));
const AuthPrompt = lazy(() => import("@/components/AuthPrompt/AuthPrompt"));
const Footer = lazy(() => import("@/components/Footer/Footer"));
const AnimatedCounter = lazy(() => import("@/components/AnimatedCounter/AnimatedCounter"));

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <CategoryBar onMenuClick={handleMenuClick} />
      <HeroCarousel />
      <AdTicker />
      
      <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
        <PopularCategories />
      </Suspense>
      
      <Suspense fallback={null}>
        <StickyNote />
      </Suspense>

      <Suspense fallback={null}>
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </Suspense>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>New Collection</span>
            <h1>Discover Your Perfect Style</h1>
            <p>Explore thousands of premium products curated just for you</p>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn}>Shop Now</button>
              <button className={styles.secondaryBtn}>
                Browse Collections
              </button>
            </div>
          </div>
          <div className={styles.heroStats}>
            <Suspense fallback={<div>50K+</div>}>
              <div className={styles.stat}>
                <h3>
                  <AnimatedCounter end={50} duration={1400} suffix={"K+"} />
                </h3>
                <p>Products</p>
              </div>
            </Suspense>
            <Suspense fallback={<div>10K+</div>}>
              <div className={styles.stat}>
                <h3>
                  <AnimatedCounter end={10} duration={1200} suffix={"K+"} />
                </h3>
                <p>Happy Customers</p>
              </div>
            </Suspense>
            <Suspense fallback={<div>99%</div>}>
              <div className={styles.stat}>
                <h3>
                  <AnimatedCounter end={99} duration={1000} suffix={"%"} />
                </h3>
                <p>Satisfaction</p>
              </div>
            </Suspense>
          </div>
        </section>

        {/* Product Feed */}
        <ProductFeed />

        {/* Auth Prompt */}
        <Suspense fallback={null}>
          <AuthPrompt />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

const FEATURED_CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    iconSrc: "/category/mobiles.webp",
    count: "2.5K",
    href: "/category/electronics",
  },
  {
    id: 2,
    name: "Fashion",
    iconSrc: "/category/mobiles.webp",
    count: "5.2K",
    href: "/category/fashion",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    iconSrc: "/category/mobiles.webp",
    count: "3.1K",
    href: "/category/home",
  },
  {
    id: 4,
    name: "Beauty",
    iconSrc: "/category/mobiles.webp",
    count: "1.8K",
    href: "/category/beauty",
  },
  {
    id: 5,
    name: "Sports",
    iconSrc: "/category/mobiles.webp",
    count: "2.3K",
    href: "/category/sports",
  },
  {
    id: 6,
    name: "Baby & Kids",
    iconSrc: "/category/mobiles.webp",
    count: "1.5K",
    href: "/category/baby",
  },
];
